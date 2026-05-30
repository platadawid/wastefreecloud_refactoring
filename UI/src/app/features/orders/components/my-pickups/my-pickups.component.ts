import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';

// Services
import { MyPickupsFilters, MyPickupsService } from '@app/features/orders/services/my-pickups.service';

// Models
import { Pager, PaginatedResult } from '@app/shared/models/result';
import { MyPickupDto } from '@app/shared/models/pickups';
import { PickupOptionKey } from '@app/shared/models/profile';

// Pipes
import { TranslatePipe } from '@app/shared/pipes/translate.pipe';

// Constants & Utils
import {
  PickupStatusKey,
  STATUS_VALUE_TO_KEY,
  STATUS_KEY_TO_VALUE,
  PICKUP_OPTION_VALUE_TO_KEY,
  STATUS_ORDER,
  ORDER_DEFAULTS,
  getStatusClass,
  getStatusTranslationKey,
  getPickupOptionTranslationKey,
  statusValueToKey,
  pickupOptionValueToKey
} from '../../constants/order.constants';
import { formatOrderNumber } from '../../utils/order.utils';

interface PortalPickupItem {
  id: string;
  orderNumber: string;
  groupId: string | null;
  groupName: string;
  isPrivateGroup: boolean;
  status: PickupStatusKey;
  cost: number;
  pickupDate: string | null;
  pickupOption: PickupOptionKey;
  isHighPriority: boolean;
}

interface GroupOption {
  id: string;
  name: string;
  isPrivate: boolean;
}

type StatusFilter = PickupStatusKey | 'all';
type GroupFilter = string | 'all';

@Component({
  selector: 'app-my-pickups',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, FormsModule],
  templateUrl: './my-pickups.component.html',
  styleUrls: ['./my-pickups.component.scss']
})
export class MyPickupsComponent implements OnInit {
  private readonly myPickupsService = inject(MyPickupsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly pickups = signal<PortalPickupItem[]>([]);
  readonly totalCount = signal(0);
  readonly itemsPerPage = ORDER_DEFAULTS.DEFAULT_ITEMS_PER_PAGE;
  readonly apiPageSize = this.itemsPerPage;
  readonly statusOptions = signal<PickupStatusKey[]>([...STATUS_ORDER]);
  readonly statusFilter = signal<StatusFilter>('all');
  readonly groupFilter = signal<GroupFilter>('all');
  readonly currentPage = signal(1);
  readonly pager = signal<Pager | null>(null);
  readonly hasAnyPickups = signal(false);
  readonly groupOptions = signal<GroupOption[]>([]);

  readonly totalPages = computed(() => this.pager()?.totalPages ?? 0);

  readonly pages = computed(() => {
    const total = this.totalPages();
    return total === 0 ? [] : Array.from({ length: total }, (_value, index) => index + 1);
  });

  readonly pageStartIndex = computed(() => {
    const pager = this.pager();
    if (!pager || pager.totalCount === 0) {
      return 0;
    }

    return (pager.pageNumber - 1) * pager.pageSize;
  });

  readonly pageEndIndex = computed(() => {
    const pager = this.pager();
    if (!pager || pager.totalCount === 0) {
      return 0;
    }

    return Math.min(pager.pageNumber * pager.pageSize, pager.totalCount);
  });

  ngOnInit(): void {
    this.fetchPickups();
  }

  trackByOrder(_index: number, pickup: PortalPickupItem): string {
    return pickup.id;
  }

  setStatusFilter(raw: StatusFilter | string): void {
    const value: StatusFilter = raw === 'all' ? 'all' : (raw as PickupStatusKey);

    if (this.statusFilter() === value) {
      return;
    }

    this.statusFilter.set(value);
    this.fetchPickups(1);
  }

  setGroupFilter(raw: GroupFilter | string): void {
    const value: GroupFilter = raw === 'all' ? 'all' : String(raw);

    if (this.groupFilter() === value) {
      return;
    }

    this.groupFilter.set(value);
    this.fetchPickups(1);
  }

  goToPage(page: number): void {
    const total = this.totalPages();

    if (total === 0) {
      return;
    }

    const clamped = Math.min(Math.max(page, 1), total);
    if (clamped === this.currentPage()) {
      return;
    }

    this.fetchPickups(clamped);
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.fetchPickups(this.currentPage() - 1);
    }
  }

  nextPage(): void {
    const total = this.totalPages();

    if (total > 0 && this.currentPage() < total) {
      this.fetchPickups(this.currentPage() + 1);
    }
  }

  openDetails(pickup: PortalPickupItem): void {
    this.router.navigate(['/portal/my-pickups', pickup.id]);
  }

  orderCode(pickup: PortalPickupItem): string {
    return pickup.orderNumber;
  }

  statusClass(status: PickupStatusKey): string {
    return getStatusClass(status);
  }

  statusTranslationKey(status: PickupStatusKey): string {
    return getStatusTranslationKey(status);
  }

  pickupOptionKey(option: PickupOptionKey): string {
    return getPickupOptionTranslationKey(option);
  }

  private buildFilters(): MyPickupsFilters {
    const statusFilter = this.statusFilter();
    const groupFilter = this.groupFilter();

    return {
      garbageGroupId: groupFilter === 'all' ? null : groupFilter,
      statuses: statusFilter === 'all' ? null : [STATUS_KEY_TO_VALUE[statusFilter]]
    };
  }

  private fetchPickups(pageOverride?: number): void {
    this.loading.set(true);
    this.error.set(null);
    const previousPage = this.currentPage();
    const targetPage = Math.max(pageOverride ?? previousPage, 1);
    const filters = this.buildFilters();

    this.myPickupsService
      .getMyPickups(targetPage, this.apiPageSize, filters)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response: PaginatedResult<MyPickupDto[]>) => {
          const items = Array.isArray(response?.resultModel) ? response.resultModel : [];
          const mapped = items.map((item) => this.toPortalPickup(item));
          this.pickups.set(mapped);

          const pager = response?.pager ?? null;
          this.pager.set(pager);

          const totalItems = pager?.totalCount ?? mapped.length;
          this.totalCount.set(totalItems);

          const resolvedPage = pager?.pageNumber ?? targetPage;
          this.currentPage.set(resolvedPage);

          if (totalItems === 0 && this.statusFilter() === 'all' && this.groupFilter() === 'all') {
            this.groupOptions.set([]);
          } else {
            this.updateGroupOptions(mapped);
          }

          if (this.statusFilter() === 'all' && this.groupFilter() === 'all') {
            this.hasAnyPickups.set(totalItems > 0);
          } else if (totalItems > 0) {
            this.hasAnyPickups.set(true);
          }
        },
        error: () => {
          this.error.set('myPickups.loadError');
          this.currentPage.set(previousPage);
        }
      });
  }

  private updateGroupOptions(items: PortalPickupItem[]): void {
    if (!items.length) {
      return;
    }

    const existing = new Map<string, GroupOption>();

    for (const option of this.groupOptions()) {
      existing.set(option.id, option);
    }

    for (const pickup of items) {
      if (pickup.groupId) {
        existing.set(pickup.groupId, {
          id: pickup.groupId,
          name: pickup.groupName,
          isPrivate: pickup.isPrivateGroup
        });
      }
    }

    const options = Array.from(existing.values()).sort((a, b) => a.name.localeCompare(b.name));
    this.groupOptions.set(options);
  }

  private toPortalPickup(dto: MyPickupDto): PortalPickupItem {
    const status = statusValueToKey(dto.garbageOrderStatus);
    const pickupOption = pickupOptionValueToKey(dto.pickupOption);
    const groupName = dto.garbageGroupName?.trim() || ORDER_DEFAULTS.UNKNOWN_GROUP_NAME;
    const groupId = dto.garbageGroupId?.trim() || null;
    const pickupDate = dto.pickupDate ?? dto.dropOffDate;
    const cost = typeof dto.cost === 'number' && Number.isFinite(dto.cost) ? dto.cost : 0;

    return {
      id: dto.id,
      orderNumber: formatOrderNumber(dto.id),
      groupId,
      groupName,
      isPrivateGroup: dto.garbageGroupIsPrivate,
      status,
      cost,
      pickupDate,
      pickupOption,
      isHighPriority: dto.isHighPriority
    };
  }
}



