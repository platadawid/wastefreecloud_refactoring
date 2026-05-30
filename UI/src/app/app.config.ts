import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { TranslationService } from './core/services/translation.service';
import { localeInterceptor } from './core/interceptors/locale.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';

registerLocaleData(localePl);

export function initTranslationsFactory(translationService: TranslationService) {
  return () => translationService.loadLangPromise();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor, authInterceptor, localeInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: initTranslationsFactory,
      deps: [TranslationService],
      multi: true
    },
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    })
  ]
};

