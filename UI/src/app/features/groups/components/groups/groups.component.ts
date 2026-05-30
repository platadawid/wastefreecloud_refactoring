import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, NgIf, NgForOf, NgClass, SlicePipe, UpperCasePipe } from '@angular/common';
import { finalize } from 'rxjs';

// Services
import { GarbageGroupService } from '@app/features/groups/services/garbage-group.service';

// Models
import { GarbageGroupInfo } from '@app/shared/models/garbage-groups';

// Pipes
import { TranslatePipe } from '@app/shared/pipes/translate.pipe';

// Utils
import { getAvatarColor } from '../../utils/group.utils';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [RouterModule, CommonModule, TranslatePipe, NgIf, NgForOf, NgClass, SlicePipe, UpperCasePipe],
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  groups: GarbageGroupInfo[] = [];
  loading = false;
  loadError: string | null = null;
  groupService = inject(GarbageGroupService);

  fetchGroups(): void {
    this.loading = true;
    this.loadError = null;
    this.groupService.list()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: res => {
          this.groups = res.resultModel || [];
        },
        error: err => {
          this.loadError = err?.error?.errorMessage;
        }
      });
  }

  ngOnInit(): void {
    this.fetchGroups();
  }

  /**
   * Get avatar color for a group name
   * Uses utility function for consistent color generation
   */
  avatarColor(name: string): string {
    return getAvatarColor(name);
  }

}



