import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@app/shared/pipes/translate.pipe';
import { CurrentUserService } from '@app/core/services/current-user.service';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.scss'
})
export class BottomNavComponent {
  private currentUserService = inject(CurrentUserService);

  isAuthenticated() {
    return !!this.currentUserService.user();
  }
}

// Made with Bob
