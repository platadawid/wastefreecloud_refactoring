import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslationService } from '@app/core/services/translation.service';
import { LanguageSwitcherComponent } from '@app/shared/components/language-switcher/language-switcher.component';
import { TopbarComponent } from '@app/shared/components/topbar/topbar.component';
import { BottomNavComponent } from '@app/shared/components/bottom-nav/bottom-nav.component';
import { LoaderOverlayComponent } from '@app/shared/components/loader-overlay/loader-overlay.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LanguageSwitcherComponent, TopbarComponent, BottomNavComponent, LoaderOverlayComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'WasteFree';
  dropdownOpen = false;
  showGlobalLang = true;
  toastr = inject(ToastrService);

  constructor(public t: TranslationService, private router: Router) {
    const check = () => {
      const url = this.router.url || '';
      this.showGlobalLang = !url.startsWith('/portal');
    };
    check();
    this.router.events.subscribe(e => { if (e instanceof NavigationEnd) check(); });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  selectLanguage(lang: string) {
    this.t.setLanguage(lang);
    this.closeDropdown();
  }
}



