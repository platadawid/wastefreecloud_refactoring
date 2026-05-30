import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

// Services
import { CurrentUserService } from '@app/core/services/current-user.service';
import { TranslationService } from '@app/core/services/translation.service';
import { AuthService } from '@app/core/services/auth.service';
import { CityService } from '@app/services/city.service';
import { SignalRService } from '@app/services/signalr.service';
import { ProfileService } from '@app/shared/services/profile.service';
import { WalletService } from '@app/features/wallet/services/wallet.service';

// Pipes
import { TranslatePipe } from '@app/shared/pipes/translate.pipe';
import { LocalizedCityPipe } from '@app/shared/pipes/localized-city.pipe';

// Models & Forms
import { RegisterRequest } from '@app/shared/models/auth';
import { PickupOption } from '@app/shared/models/garbage-orders';
import { User } from '@app/shared/models/user';
import { buildAddressFormGroup } from '@app/forms/address-form';

// Constants
import {
  USER_ROLES,
  LANGUAGE_PREFERENCES,
  AUTH_DEFAULTS,
  REGISTRATION_STEPS,
  getTotalSteps,
  getControlPathsForStep,
  mapLanguageCodeToPreference,
  type UserRole,
  type LanguagePreference
} from '../../constants/auth.constants';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe, LocalizedCityPipe, RouterModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  private readonly bodyClass = 'auth-bg';
  private readonly signalR = inject(SignalRService);

  // UI State
  isLoginMode = true;
  isLoading = false;
  showLoadingText = false;
  isRegisterLoading = false;
  showRegisterLoadingText = false;
  showActivationSection = false;
  registerStep: number = REGISTRATION_STEPS.CREDENTIALS;

  // Forms
  loginForm: FormGroup;
  registerForm: FormGroup;

  // Cities
  cities: string[] = [];
  isLoadingCities = false;
  cityLoadError = false;

  // Subscriptions
  private langSub: Subscription | null = null;
  private citySub: Subscription | null = null;

  // Constants exposed to template
  readonly USER_ROLES = USER_ROLES;
  readonly LANGUAGE_PREFERENCES = LANGUAGE_PREFERENCES;
  readonly pickupOptionChoices: ReadonlyArray<{ value: PickupOption; label: string; description: string }> = [
    { value: PickupOption.SmallPickup, label: 'auth.preferences.options.smallPickup.title', description: 'auth.preferences.options.smallPickup.desc' },
    { value: PickupOption.Pickup, label: 'auth.preferences.options.pickup.title', description: 'auth.preferences.options.pickup.desc' },
    { value: PickupOption.Container, label: 'auth.preferences.options.container.title', description: 'auth.preferences.options.container.desc' },
    { value: PickupOption.SpecialOrder, label: 'auth.preferences.options.special.title', description: 'auth.preferences.options.special.desc' }
  ];

  // Computed properties
  private get totalSteps(): number {
    return getTotalSteps(this.currentRole);
  }

  private get currentRole(): UserRole {
    return this.registerForm.get('role')?.value || USER_ROLES.USER;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private translation: TranslationService,
    private currentUser: CurrentUserService,
    private profileService: ProfileService,
    private wallet: WalletService,
    private router: Router,
    private cityService: CityService,
  ) {
    // Initialize login form
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // Initialize register form with defaults
    const initialLang = mapLanguageCodeToPreference(this.translation.currentLang);
    
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: [AUTH_DEFAULTS.ROLE, Validators.required],
      languagePreference: [initialLang, Validators.required],
      address: buildAddressFormGroup(this.fb),
      pickupOptions: this.fb.control<number[]>([])
    });

    // Subscribe to language changes
    this.langSub = this.translation.onLangChange.subscribe((langCode) => {
      const preference = mapLanguageCodeToPreference(langCode);
      this.registerForm.get('languagePreference')?.setValue(preference);
    });

    // Load cities
    this.cities = cityService.cities() ?? [];
    if (this.cities.length) {
      this.applyDefaultCityFromList();
    }

    // Subscribe to role changes
    const roleControl = this.registerForm.get('role');
    roleControl?.valueChanges.subscribe((role) => this.handleRoleChange(role));
    this.handleRoleChange(roleControl?.value as UserRole);
  }

  ngOnInit(): void {
    document.body.classList.add(this.bodyClass);
    this.loadCities();
  }

  ngOnDestroy(): void {
    document.body.classList.remove(this.bodyClass);
    if (this.langSub) { this.langSub.unsubscribe(); this.langSub = null; }
    if (this.citySub) { this.citySub.unsubscribe(); this.citySub = null; }
  }

  toggleMode(event: Event): void {
    event.preventDefault();
    this.isLoginMode = !this.isLoginMode;
    this.showActivationSection = false;
    this.registerStep = REGISTRATION_STEPS.CREDENTIALS;
    if (!this.isLoginMode) {
      this.loadCities();
    }
  }

  onLogin() {
    if (!this.loginForm.valid) return;

    this.isLoading = true;

    const start = Date.now();
    let success = false;

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.showLoadingText = true;

        const applied = this.applyAuthResult(res.resultModel);
        success = applied;

        if (!applied) {
          this.finishLoading(start, success, () => {
            this.isLoading = false;
            this.showLoadingText = false;
          });
          return;
        }

        this.finishLoading(start, success, () => {
          this.isLoading = false;
          this.showLoadingText = false;
          this.signalR.startConnection();
          try { this.router.navigate(['/portal']); } catch { location.href = '/portal'; }
        });
      },
      error: () => {
        this.finishLoading(start, success, () => {
          this.isLoading = false;
          this.showLoadingText = false;
        });
      }
    });
  }

  onRegister() {
    this.showActivationSection = false;

    if (!this.isRegisterLastStep) {
      this.goToNextRegisterStep();
      return;
    }

    this.markCurrentStepControlsAsTouched();

    if (!this.registerForm.valid) {
      this.registerForm.updateValueAndValidity({ onlySelf: false, emitEvent: true });
      return;
    }

    const formValue = this.registerForm.value as RegisterRequest & { pickupOptions: number[] };
    const { username, email, password, role, languagePreference, address, pickupOptions } = formValue;

    const payload: RegisterRequest = {
      username,
      email,
      password,
      role,
      languagePreference,
      address,
      pickupOptions: role === USER_ROLES.GARBAGE_ADMIN ? pickupOptions : undefined
    };

    this.isRegisterLoading = true;
    const start = Date.now();
    let success = false;

    this.authService.register(payload).subscribe({
      next: () => {
        this.showRegisterLoadingText = true;
        this.showActivationSection = true;
        success = true;

        this.finishLoading(start, success, () => {
          this.isRegisterLoading = false;
          this.showRegisterLoadingText = false;
          this.resetRegisterFormDefaults();
        });
      },
      error: () => {
        this.finishLoading(start, success, () => {
          this.isRegisterLoading = false;
          this.showRegisterLoadingText = false;
        });
      }
    });
  }

  returnToLogin() {
    this.showActivationSection = false;
    this.isLoginMode = true;
    this.loginForm.reset();
    this.resetRegisterFormDefaults();
  }

  get isRegisterFirstStep(): boolean {
    return this.registerStep === 1;
  }

  get isRegisterLastStep(): boolean {
    return this.registerStep === this.totalSteps;
  }

  get isCurrentRegisterStepValid(): boolean {
    return this.getControlPathsForCurrentStep().every((path) => {
      const control = this.registerForm.get(path);
      return control ? control.valid : false;
    });
  }

  private goToNextRegisterStep() {
    if (this.isRegisterLastStep) return;
    this.markCurrentStepControlsAsTouched();
    if (!this.isCurrentRegisterStepValid) {
      this.registerForm.updateValueAndValidity({ onlySelf: false, emitEvent: true });
      return;
    }
    this.registerStep = Math.min(this.registerStep + 1, this.totalSteps);
  }

  goToPreviousRegisterStep() {
    if (this.isRegisterFirstStep) return;
    this.registerStep = Math.max(1, this.registerStep - 1);
  }

  private markCurrentStepControlsAsTouched() {
    this.getControlPathsForCurrentStep().forEach((path) => {
      const control = this.registerForm.get(path);
      control?.markAsTouched();
      control?.markAsDirty();
    });
  }

  private getControlPathsForCurrentStep(): string[] {
    return this.getControlPathsForStep(this.registerStep);
  }

  private getControlPathsForStep(step: number): string[] {
    if (step === 1) {
      return ['username', 'email', 'password', 'role'];
    }

    if (step === 2) {
      return ['languagePreference', 'address.city', 'address.postalCode', 'address.street'];
    }

    if (step === 3 && this.isGarbageAdminRole) {
      return ['pickupOptions'];
    }

    return [];
  }

  private loadCities(force = false) {
    const cachedCities = this.cityService.cities();
    if (!force && Array.isArray(cachedCities) && cachedCities.length) {
      this.cities = cachedCities;
      this.applyDefaultCityFromList();
      return;
    }

    if (this.citySub) {
      this.citySub.unsubscribe();
      this.citySub = null;
    }

    this.isLoadingCities = true;
    this.cityLoadError = false;

  this.citySub = this.cityService.getCitiesList(force).subscribe({
      next: (cities) => {
        this.cities = cities;
        this.isLoadingCities = false;
        this.cityLoadError = !cities.length;
        this.applyDefaultCityFromList();
      },
      error: () => {
        this.isLoadingCities = false;
        this.cityLoadError = true;
      }
    });
  }

  private applyDefaultCityFromList() {
    if (!this.cities.length) {
      return;
    }
    const cityControl = this.registerForm.get('address.city');
    const currentValue = cityControl?.value;
    if (!cityControl) {
      return;
    }
    if (!currentValue) {
      cityControl.setValue(this.cities[0], { emitEvent: false });
      cityControl.markAsPristine();
      cityControl.markAsUntouched();
    }
  }


  private finishLoading(start: number, isSuccess: boolean, done: () => void, minMs = 1000) {
    const elapsed = Date.now() - start;
    const wait = isSuccess ? Math.max(0, minMs - elapsed) : 0;
    setTimeout(done, wait);
  }

  private applyAuthResult(res: User | null): boolean {
    if (!res) {
      return false;
    }
    const token = res.token;

    if (token) {
      localStorage.setItem('authToken', token);
      this.profileService.clear();
      this.wallet.resetState();
      void this.wallet.refreshBalance();
      this.currentUser.setUser({
        id: res.id,
        username: res.username,
        role: res.userRole,
        acceptedConsents: res.acceptedConsents,
        avatarUrl: res.avatarUrl ?? null
      });
      return true;
    }

    return false;
  }

  private mapLangForControl(lang: string | undefined): 'English' | 'Polish' {
    if (!lang) return 'Polish';
    const code = String(lang).toLowerCase();
    if (code.startsWith('pl')) return 'Polish';
    return 'English';
  }
  private resetRegisterFormDefaults() {
    const initialLang = this.mapLangForControl(this.translation.currentLang);
    const defaultCity = this.cities[0] ?? '';

    this.registerForm.reset({
      username: '',
      email: '',
      password: '',
      role: USER_ROLES.USER,
      languagePreference: initialLang,
      address: {
        city: defaultCity,
        postalCode: '',
        street: ''
      },
      pickupOptions: []
    });
    this.handleRoleChange(USER_ROLES.USER);
    this.registerStep = 1;
  }

  private get registerAddressGroup(): FormGroup {
    return this.registerForm.get('address') as FormGroup;
  }

  get pickupOptionsControl(): FormControl<number[]> {
    return this.registerForm.get('pickupOptions') as FormControl<number[]>;
  }

  get isGarbageAdminRole(): boolean {
    return this.registerForm.get('role')?.value === USER_ROLES.GARBAGE_ADMIN;
  }

  get registerStepSequence(): number[] {
    return Array.from({ length: this.totalSteps }, (_value, index) => index + 1);
  }

  isPickupOptionSelected(option: PickupOption): boolean {
    return (this.pickupOptionsControl.value ?? []).includes(option);
  }

  togglePickupOption(option: PickupOption, selected: boolean): void {
    const current = this.pickupOptionsControl.value ?? [];
    const next = selected
      ? Array.from(new Set([...current, option]))
      : current.filter((value) => value !== option);
    this.pickupOptionsControl.setValue(next);
    this.pickupOptionsControl.markAsDirty();
    this.pickupOptionsControl.markAsTouched();
    this.pickupOptionsControl.updateValueAndValidity({ emitEvent: false });
  }

  onPickupOptionToggle(option: PickupOption, event: Event): void {
    const checkbox = event.target as HTMLInputElement | null;
    const selected = checkbox?.checked ?? false;
    this.togglePickupOption(option, selected);
  }

  private handleRoleChange(role: RegisterRequest['role'] | null | undefined): void {
    const pickupControl = this.pickupOptionsControl;

    if (role === USER_ROLES.GARBAGE_ADMIN) {
      pickupControl.setValidators([Validators.required]);
    } else {
      pickupControl.clearValidators();
      if ((pickupControl.value?.length ?? 0) > 0) {
        pickupControl.setValue([]);
      }
      pickupControl.markAsPristine();
      pickupControl.markAsUntouched();
    }

    pickupControl.updateValueAndValidity({ emitEvent: false });

    if (this.registerStep > this.totalSteps) {
      this.registerStep = this.totalSteps;
    }
  }
}



