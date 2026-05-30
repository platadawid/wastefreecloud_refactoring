import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslatePipe } from '@app/shared/pipes/translate.pipe';
import { TranslationService } from '@app/core/services/translation.service';
import { AuthService } from '@app/core/services/auth.service';

type ActivationStatus = 'pending' | 'success' | 'error';

@Component({
  selector: 'app-activation',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss']
})
export class ActivationComponent implements OnInit, OnDestroy {
  private readonly bodyClass = 'auth-bg';
  
  status: ActivationStatus = 'pending';
  message: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router,
    private t: TranslationService
  ) {}

  ngOnInit(): void {
    document.body.classList.add(this.bodyClass);
    this.activateAccount();
  }

  ngOnDestroy(): void {
    document.body.classList.remove(this.bodyClass);
  }

  private activateAccount(): void {
    const token = this.extractToken();

    if (!token) {
      this.handleError('Missing activation token');
      return;
    }

    this.auth.activate(token).subscribe({
      next: () => {
        this.status = 'success';
      },
      error: (err: any) => {
        const errorMessage = err?.error?.errorMessage || 'Activation failed';
        this.handleError(errorMessage);
      }
    });
  }

  private extractToken(): string | null {
    // Try route params first
    let token = this.route.snapshot.paramMap.get('token');
    if (token) return token;

    // Try URL segments
    const urlSegments = this.route.snapshot.url;
    if (urlSegments?.length) {
      token = urlSegments.map(s => s.path).join('/');
      if (token) return token;
    }

    // Try query params
    token = this.route.snapshot.queryParamMap.get('token');
    if (token) return token;

    // Try parsing from full URL as fallback
    try {
      const href = window.location.href;
      const marker = '/activate-account/';
      const markerIndex = href.indexOf(marker);
      
      if (markerIndex !== -1) {
        let raw = href.substring(markerIndex + marker.length);
        raw = raw.split('?')[0].split('#')[0];
        return decodeURIComponent(raw);
      }
    } catch (error) {
      console.error('Error parsing token from URL:', error);
    }

    return null;
  }

  private handleError(message: string): void {
    this.status = 'error';
    this.message = message;
    console.error('Account activation error:', message);
  }

  private navigateSafely(path: string): void {
    this.router.navigate([path]).catch(() => {
      window.location.href = path;
    });
  }

  gotoLogin(): void {
    this.navigateSafely('/auth');
  }

  gotoHome(): void {
    this.navigateSafely('/');
  }
}



