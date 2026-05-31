import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { TranslatePipe } from '@app/shared/pipes/translate.pipe';
import { CurrentUserService } from '@app/core/services/current-user.service';
import { UserRole } from '@app/shared/models/user';

type ActionSheetType = 'groups' | 'pickups' | null;

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.scss',
  animations: [
    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('250ms ease-out', style({ transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(100%)' }))
      ])
    ])
  ]
})
export class BottomNavComponent {
  private currentUserService = inject(CurrentUserService);
  private router = inject(Router);
  userRole = UserRole;
  
  activeSheet: ActionSheetType = null;

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

  openActionSheet(type: ActionSheetType, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.activeSheet = type;
  }

  closeActionSheet() {
    this.activeSheet = null;
  }

  navigateAndClose(path: string) {
    this.router.navigate([path]);
    this.closeActionSheet();
  }

  isGroupsActive(): boolean {
    return this.router.url.startsWith('/portal/groups');
  }

  isPickupsActive(): boolean {
    return this.router.url.startsWith('/portal/my-pickups') ||
           this.router.url.startsWith('/portal/pickup-order');
  }
}

// Made with Bob
