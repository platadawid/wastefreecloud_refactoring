import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

// Services
import { WalletService } from '@app/features/wallet/services/wallet.service';
import { TranslationService } from '@app/core/services/translation.service';
import { ProfileService } from '@app/shared/services/profile.service';
import { ToastrService } from 'ngx-toastr';

// Models
import { PaymentStatus } from '@app/shared/models/wallet';

// Pipes
import { TranslatePipe } from '@app/shared/pipes/translate.pipe';

// Constants
const DEFAULT_AMOUNT = 10;
const BLIK_CODE_PATTERN = /^[0-9]{6}$/;

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslatePipe],
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})

export class WalletComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private wallet = inject(WalletService);
  private t = inject(TranslationService);
  private toastr = inject(ToastrService);
  private translationService = inject(TranslationService);
  private balanceSub?: Subscription;

  // Public for template access
  profileSvc = inject(ProfileService);

  balance = 0;
  methodsLoaded = false;
  paymentStatus: PaymentStatus | null = null;
  PaymentStatus = PaymentStatus;

  topUpForm = this.fb.group({
    amount: [DEFAULT_AMOUNT, [Validators.required, Validators.min(1)]],
    blikCode: ['', [Validators.required, Validators.pattern(BLIK_CODE_PATTERN)]]
  });

  withdrawForm = this.fb.group({
    amount: [DEFAULT_AMOUNT, [Validators.required, Validators.min(1)]],
  });

  // Separate loading states so that top-up tile can show full-tile loader
  topUpLoading = false;
  withdrawLoading = false;

  // Backward compatibility: some template / code might still reference `loading`
  get loading(): boolean {
    return this.topUpLoading || this.withdrawLoading;
  }

  constructor() {
    this.balanceSub = this.wallet.balance$.subscribe(b => this.balance = b);
  }

  ngOnInit() {
    this.wallet.ensureInit().then(() => {
      this.methodsLoaded = true;
    });
    // ensure profile loaded to get saved bank account number
    this.profileSvc.refresh();
  }

  ngOnDestroy(): void {
    this.balanceSub?.unsubscribe();
  }


  topUp(): void {
    if (this.topUpForm.invalid) return;

    this.resetMessages();
    this.topUpLoading = true;

    const amount = Number(this.topUpForm.value.amount);
    const blik = String(this.topUpForm.value.blikCode);

    this.wallet.createTransaction({ code: 'BLIK', amount, paymentProperty: blik }).subscribe({
      next: ({ status }) => {
        this.paymentStatus = status;
        this.topUpLoading = false;
        this.toastr.success(this.translationService.translate('wallet.message.topupSuccess'));

        if (status === PaymentStatus.Completed) {
          this.topUpForm.reset({ amount: DEFAULT_AMOUNT, blikCode: '' });
        }
      },
      error: () => {
        this.topUpLoading = false;
        this.paymentStatus = PaymentStatus.Invalid;
      }
    });
  }

  withdraw(): void {
    if (this.withdrawForm.invalid) return;

    this.resetMessages();
    this.withdrawLoading = true;

    const amount = Number(this.withdrawForm.value.amount);
    const iban = this.profileSvc.profile()?.bankAccountNumber || '';

    if (!iban) {
      this.withdrawLoading = false;
      this.toastr.error(this.translationService.translate('wallet.withdraw.noIban'));
      return;
    }

    this.wallet.createTransaction({ code: 'IBAN', amount, paymentProperty: iban }).subscribe({
      next: ({ status }) => {
        this.paymentStatus = status;
        this.withdrawLoading = false;
        this.toastr.success(this.translationService.translate('wallet.message.withdrawSuccess'));

        if (status === PaymentStatus.Completed) {
          this.withdrawForm.reset({ amount: DEFAULT_AMOUNT });
        }
      },
      error: () => {
        this.withdrawLoading = false;
        this.paymentStatus = PaymentStatus.Invalid;
      }
    });
  }

  private resetMessages() {
    this.paymentStatus = null;
  }
}



