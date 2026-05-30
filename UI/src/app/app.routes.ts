import { PortalComponent } from '@app/shared/components/portal/portal.component';
import { HomeComponent } from '@app/shared/components/home/home.component';
import { Routes } from '@angular/router';
import { AuthComponent } from '@app/features/auth/components/auth/auth.component';
import { authGuard } from '@app/core/guards/auth.guard';
import { ActivationComponent } from '@app/features/auth/components/activation/activation.component';
import { UrlSegment, UrlMatchResult } from '@angular/router';
import { WalletComponent } from '@app/features/wallet/components/wallet/wallet.component';
import { InboxComponent } from '@app/shared/components/inbox/inbox.component';
import { PortalHomeComponent } from '@app/shared/components/portal-home/portal-home.component';
import { GroupsComponent } from '@app/features/groups/components/groups/groups.component';
import { GroupsManagementComponent } from '@app/features/groups/components/groups-management/groups-management.component';
import { ProfileComponent } from '@app/shared/components/profile/profile.component';
import { GroupPanelComponent } from '@app/features/groups/components/group-panel/group-panel.component';
import { groupResolver } from '@app/resolvers/group.resolver';
import { NotFoundComponent } from '@app/shared/components/not-found/not-found.component';
import { PickupOrderComponent } from '@app/features/orders/components/pickup-order/pickup-order.component';
import { MyPickupsComponent } from '@app/features/orders/components/my-pickups/my-pickups.component';
import { OrderDetailsComponent } from '@app/features/orders/components/order-details/order-details.component';
import { GarbageAdminOrdersWaitingComponent } from '@app/features/admin/components/garbage-admin/orders/waiting/garbage-admin-orders-waiting.component';
import { GarbageAdminOrdersAssignedComponent } from '@app/features/admin/components/garbage-admin/orders/assigned/garbage-admin-orders-assigned.component';
import { garbageAdminGuard } from '@app/core/guards/garbage-admin.guard';

function activateAccountMatcher(segments: UrlSegment[]): UrlMatchResult | null {
    if (!segments || segments.length === 0) return null;
    if (segments[0].path !== 'activate-account') return null;

    const tokenSegments = segments.slice(1);
    if (tokenSegments.length === 0) return null;

    const token = tokenSegments.map(s => s.path).join('/');

    return {
        consumed: segments,
        posParams: {
            token: new UrlSegment(token, {})
        }
    };
}

export const routes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: 'portal',
        component: PortalComponent,
        data: { showTopbar: true },
        canActivate: [authGuard],
        children: [
            { path: '', component: PortalHomeComponent },
            { path: 'wallet', component: WalletComponent },
            { path: 'inbox', component: InboxComponent },
            { path: 'pickup-order', component: PickupOrderComponent },
            { path: 'my-pickups', component: MyPickupsComponent },
            { path: 'my-pickups/:orderId', component: OrderDetailsComponent },
            { path: 'garbage-admin/orders/waiting', component: GarbageAdminOrdersWaitingComponent, canActivate: [garbageAdminGuard] },
            { path: 'garbage-admin/orders/assigned', component: GarbageAdminOrdersAssignedComponent, canActivate: [garbageAdminGuard] },
            { path: 'groups', component: GroupsComponent },
            { path: 'groups/manage', component: GroupsManagementComponent },
            { path: 'groups/:groupId', component: GroupPanelComponent, resolve: { group: groupResolver } },
            { path: 'profile', component: ProfileComponent },

        ]
    },
    { path: 'auth', component: AuthComponent },
    { matcher: activateAccountMatcher, component: ActivationComponent },
    { path: '**', component: NotFoundComponent }
];