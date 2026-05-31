import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@app/shared/pipes/translate.pipe';
import { CurrentUserService } from '@app/core/services/current-user.service';
import { UserRole } from '@app/shared/models/user';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.scss'
})
export class BottomNavComponent {
  private currentUserService = inject(CurrentUserService);
  userRole = UserRole;

  isAuthenticated() {
    return !!this.currentUserService.user();
  }

  isGarbageAdmin() {
    const user = this.currentUserService.user();
    return user?.role === UserRole.GarbageAdmin;
  }

  isUserOrAdmin() {
    const user = this.currentUserService.user();
    return user?.role === UserRole.User || user?.role === UserRole.Admin;
  }
}

// Made with Bob
