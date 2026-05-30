# Plan Refaktoryzacji Frontendu WasteFree

## 📋 Spis Treści
1. [Analiza Obecnego Stanu](#analiza-obecnego-stanu)
2. [Zidentyfikowane Problemy](#zidentyfikowane-problemy)
3. [Architektura Docelowa](#architektura-docelowa)
4. [Plan Implementacji](#plan-implementacji)
5. [Design System](#design-system)
6. [Konwencje Nazewnictwa](#konwencje-nazewnictwa)
7. [Responsywność](#responsywność)
8. [Harmonogram](#harmonogram)

---

## 🔍 Analiza Obecnego Stanu

### Technologie
- **Framework**: Angular 17.3 (standalone components)
- **UI Libraries**: Angular Material 17.3, Bootstrap 5.3.7
- **State Management**: Signals (Angular 17+)
- **Real-time**: SignalR (@microsoft/signalr 8.0.4)
- **Notifications**: ngx-toastr 19.1.0
- **i18n**: Custom translation service

### Struktura Projektu
```
UI/src/app/
├── _models/           # Modele danych
├── components/        # Komponenty
│   ├── garbage-admin/ # Admin śmieciowy
│   ├── shared/        # Współdzielone
│   └── user/          # Użytkownik
├── directives/        # Dyrektywy
├── forms/            # Formularze
├── guards/           # Guards
├── helpers/          # Helpery
├── interceptors/     # Interceptory HTTP
├── pipes/            # Pipes
├── resolvers/        # Resolvers
└── services/         # Serwisy
```

---

## ⚠️ Zidentyfikowane Problemy

### 1. **Niespójność Stylów CSS**
- **Problem**: Mieszanie Bootstrap, Angular Material i custom CSS
- **Przykład**: `home.component.css` ma 480 linii z duplikującymi się stylami
- **Wpływ**: Trudność w utrzymaniu, duży rozmiar bundle

### 2. **Niespójna Struktura Komponentów**
- **Problem**: Brak jednolitego wzorca organizacji komponentów
- **Przykład**: 
  - `components/shared/` zawiera zarówno layout (portal, topbar) jak i feature components (wallet, inbox)
  - `components/user/` i `components/garbage-admin/` mieszają logikę biznesową
- **Wpływ**: Trudność w nawigacji, słaba separacja odpowiedzialności

### 3. **Problemy z Nazewnictwem**
- **Problem**: Niespójne nazewnictwo w całej aplikacji
- **Przykłady**:
  - Modele: `_models/` (underscore prefix)
  - Komponenty: mix `garbage-admin-orders-waiting` vs `groups-management`
  - Serwisy: `current-user.service.ts` vs `auth.service.ts`
- **Wpływ**: Trudność w zrozumieniu struktury projektu

### 4. **Duplikacja Kodu**
- **Problem**: Powtarzające się wzorce bez abstrakcji
- **Przykłady**:
  - Loading states w każdym komponencie osobno
  - Error handling duplikowany w serwisach
  - Form validation patterns powtarzane
- **Wpływ**: Więcej kodu do utrzymania, większe ryzyko błędów

### 5. **Słaba Responsywność**
- **Problem**: Brak systematycznego podejścia do mobile-first
- **Przykład**: `portal.component.css` ma tylko podstawowe media queries
- **Wpływ**: Słabe UX na urządzeniach mobilnych

### 6. **Problemy z i18n**
- **Problem**: Custom translation service zamiast standardowego rozwiązania
- **Przykład**: `translation.service.ts` - 112 linii custom logiki
- **Wpływ**: Trudniejsze utrzymanie, brak wsparcia dla zaawansowanych funkcji

### 7. **Brak Spójnego Design System**
- **Problem**: Kolory, spacing, typography rozproszone po plikach
- **Przykład**: 
  - `--primary-green: #2bb673` w `styles.css`
  - Hardcoded colors w component CSS
- **Wpływ**: Niespójny wygląd, trudność w rebrandingu

### 8. **Problemy z Architekturą**
- **Problem**: Tight coupling między komponentami
- **Przykład**: Komponenty bezpośrednio używają wielu serwisów
- **Wpływ**: Trudność w testowaniu i refaktoryzacji

---

## 🎯 Architektura Docelowa

### Struktura Katalogów (Nowa)

```
UI/src/app/
├── core/                          # Singleton services, guards, interceptors
│   ├── auth/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── services/
│   ├── i18n/
│   ├── http/
│   └── state/
├── shared/                        # Reusable components, directives, pipes
│   ├── components/
│   │   ├── ui/                   # Pure UI components (buttons, cards, etc.)
│   │   └── layout/               # Layout components (header, sidebar, etc.)
│   ├── directives/
│   ├── pipes/
│   └── models/
├── features/                      # Feature modules
│   ├── auth/
│   │   ├── components/
│   │   ├── services/
│   │   └── models/
│   ├── groups/
│   │   ├── components/
│   │   ├── services/
│   │   └── models/
│   ├── orders/
│   │   ├── components/
│   │   ├── services/
│   │   └── models/
│   ├── wallet/
│   │   ├── components/
│   │   ├── services/
│   │   └── models/
│   └── admin/
│       ├── components/
│       ├── services/
│       └── models/
└── styles/                        # Global styles
    ├── abstracts/                # Variables, mixins, functions
    ├── base/                     # Reset, typography, base styles
    ├── components/               # Component-specific styles
    ├── layout/                   # Layout styles
    └── themes/                   # Theme configurations
```

### Zasady Architektury

#### 1. **Feature-Based Organization**
- Każda funkcjonalność w osobnym module
- Jasna separacja odpowiedzialności
- Łatwe skalowanie

#### 2. **Smart vs Presentational Components**
- **Smart (Container)**: Zarządzają stanem, komunikują się z serwisami
- **Presentational**: Tylko wyświetlanie, Input/Output

#### 3. **Reactive State Management**
- Wykorzystanie Angular Signals
- Centralizacja stanu w serwisach
- Unidirectional data flow

#### 4. **Dependency Injection**
- Proper use of `providedIn: 'root'`
- Feature-specific providers
- Testability

---

## 📝 Plan Implementacji

### Faza 1: Fundament (Tydzień 1-2)

#### 1.1 Setup Design System
**Cel**: Stworzyć spójny system projektowy

**Zadania**:
- [ ] Zdefiniować paletę kolorów (primary, secondary, accent, semantic)
- [ ] Ustalić typografię (font families, sizes, weights, line heights)
- [ ] Zdefiniować spacing scale (4px, 8px, 16px, 24px, 32px, 48px, 64px)
- [ ] Stworzyć breakpoints dla responsywności
- [ ] Zdefiniować shadows, borders, radius
- [ ] Stworzyć CSS variables w `styles/abstracts/_variables.scss`

**Deliverables**:
```scss
// styles/abstracts/_variables.scss
:root {
  // Colors
  --color-primary-50: #e8f5e9;
  --color-primary-100: #c8e6c9;
  --color-primary-500: #2bb673;
  --color-primary-700: #1f8b56;
  --color-primary-900: #1b5e20;
  
  // Spacing
  --spacing-xs: 0.25rem;  // 4px
  --spacing-sm: 0.5rem;   // 8px
  --spacing-md: 1rem;     // 16px
  --spacing-lg: 1.5rem;   // 24px
  --spacing-xl: 2rem;     // 32px
  
  // Typography
  --font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-size-xs: 0.75rem;   // 12px
  --font-size-sm: 0.875rem;  // 14px
  --font-size-base: 1rem;    // 16px
  --font-size-lg: 1.125rem;  // 18px
  --font-size-xl: 1.25rem;   // 20px
  
  // Breakpoints (for JS)
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
}
```

#### 1.2 Refaktoryzacja Core Services
**Cel**: Uporządkować podstawowe serwisy

**Zadania**:
- [ ] Przenieść auth-related services do `core/auth/`
- [ ] Ujednolicić error handling
- [ ] Stworzyć `HttpService` wrapper dla API calls
- [ ] Zrefaktoryzować `TranslationService` lub migrować do `@ngx-translate`
- [ ] Stworzyć `StateService` dla global state

**Przykład - HttpService**:
```typescript
// core/http/http.service.ts
@Injectable({ providedIn: 'root' })
export class HttpService {
  private readonly apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}
  
  get<T>(endpoint: string, options?: HttpOptions): Observable<Result<T>> {
    return this.http.get<Result<T>>(`${this.apiUrl}${endpoint}`, options)
      .pipe(
        catchError(this.handleError),
        tap(this.logResponse)
      );
  }
  
  post<T>(endpoint: string, body: any, options?: HttpOptions): Observable<Result<T>> {
    return this.http.post<Result<T>>(`${this.apiUrl}${endpoint}`, body, options)
      .pipe(
        catchError(this.handleError),
        tap(this.logResponse)
      );
  }
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    // Centralized error handling
    return throwError(() => error);
  }
}
```

#### 1.3 Stworzyć Shared UI Components
**Cel**: Biblioteka reusable komponentów

**Komponenty do stworzenia**:
- [ ] `ButtonComponent` (primary, secondary, ghost, danger)
- [ ] `CardComponent` (z variants)
- [ ] `InputComponent` (text, email, password, number)
- [ ] `SelectComponent`
- [ ] `ModalComponent`
- [ ] `LoaderComponent` (spinner, skeleton)
- [ ] `AlertComponent` (success, error, warning, info)
- [ ] `BadgeComponent`
- [ ] `AvatarComponent`
- [ ] `EmptyStateComponent`

**Przykład - ButtonComponent**:
```typescript
// shared/components/ui/button/button.component.ts
@Component({
  selector: 'wf-button',
  standalone: true,
  template: `
    <button 
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
      (click)="handleClick($event)">
      <span *ngIf="loading" class="spinner"></span>
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Output() clicked = new EventEmitter<MouseEvent>();
  
  get buttonClasses(): string {
    return [
      'wf-button',
      `wf-button--${this.variant}`,
      `wf-button--${this.size}`,
      this.fullWidth ? 'wf-button--full-width' : '',
      this.loading ? 'wf-button--loading' : ''
    ].filter(Boolean).join(' ');
  }
  
  handleClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}
```

### Faza 2: Moduł Autentykacji (Tydzień 2-3)

#### 2.1 Refaktoryzacja Auth Flow
**Cel**: Uporządkować proces autentykacji

**Zadania**:
- [ ] Przenieść do `features/auth/`
- [ ] Rozdzielić login i register na osobne komponenty
- [ ] Stworzyć `AuthFacade` service
- [ ] Ujednolicić form validation
- [ ] Dodać proper error messages
- [ ] Poprawić UX (loading states, success feedback)

**Struktura**:
```
features/auth/
├── components/
│   ├── login/
│   │   ├── login.component.ts
│   │   ├── login.component.html
│   │   └── login.component.scss
│   ├── register/
│   │   ├── register.component.ts
│   │   ├── register.component.html
│   │   └── register.component.scss
│   └── activation/
│       ├── activation.component.ts
│       ├── activation.component.html
│       └── activation.component.scss
├── services/
│   ├── auth-facade.service.ts
│   └── auth-api.service.ts
└── models/
    ├── auth.model.ts
    └── user.model.ts
```

#### 2.2 Responsive Auth Pages
**Zadania**:
- [ ] Mobile-first design
- [ ] Tablet optimization
- [ ] Desktop enhancement
- [ ] Touch-friendly inputs
- [ ] Proper keyboard navigation

### Faza 3: Moduł Grup (Tydzień 3-4)

#### 3.1 Refaktoryzacja Groups
**Cel**: Uporządkować funkcjonalność grup

**Zadania**:
- [ ] Przenieść do `features/groups/`
- [ ] Rozdzielić na smart/presentational components
- [ ] Stworzyć `GroupsFacade` service
- [ ] Dodać proper state management
- [ ] Poprawić UX list i details
- [ ] Zoptymalizować group chat (SignalR)

**Komponenty**:
```
features/groups/
├── components/
│   ├── groups-list/
│   │   ├── groups-list.component.ts (smart)
│   │   ├── groups-list.component.html
│   │   └── groups-list.component.scss
│   ├── group-card/
│   │   ├── group-card.component.ts (presentational)
│   │   ├── group-card.component.html
│   │   └── group-card.component.scss
│   ├── group-details/
│   │   ├── group-details.component.ts (smart)
│   │   ├── group-details.component.html
│   │   └── group-details.component.scss
│   ├── group-chat/
│   │   ├── group-chat.component.ts
│   │   ├── group-chat.component.html
│   │   └── group-chat.component.scss
│   └── group-management/
│       ├── group-management.component.ts
│       ├── group-management.component.html
│       └── group-management.component.scss
├── services/
│   ├── groups-facade.service.ts
│   ├── groups-api.service.ts
│   └── group-chat.service.ts
└── models/
    └── group.model.ts
```

#### 3.2 Responsive Groups UI
**Zadania**:
- [ ] Card grid responsive layout
- [ ] Mobile-optimized chat
- [ ] Touch gestures for actions
- [ ] Optimized member list

### Faza 4: Moduł Zamówień (Tydzień 4-5)

#### 4.1 Refaktoryzacja Orders/Pickups
**Cel**: Uporządkować zarządzanie zamówieniami

**Zadania**:
- [ ] Przenieść do `features/orders/`
- [ ] Ujednolicić nazewnictwo (orders vs pickups)
- [ ] Stworzyć `OrdersFacade` service
- [ ] Poprawić flow tworzenia zamówienia
- [ ] Zoptymalizować listę zamówień
- [ ] Dodać filtry i sortowanie

**Struktura**:
```
features/orders/
├── components/
│   ├── orders-list/
│   ├── order-card/
│   ├── order-details/
│   ├── order-create/
│   └── order-filters/
├── services/
│   ├── orders-facade.service.ts
│   └── orders-api.service.ts
└── models/
    └── order.model.ts
```

#### 4.2 Admin Orders Module
**Zadania**:
- [ ] Przenieść do `features/admin/orders/`
- [ ] Rozdzielić waiting/assigned views
- [ ] Poprawić UX akceptacji zamówień
- [ ] Dodać bulk actions

### Faza 5: Moduł Portfela (Tydzień 5-6)

#### 5.1 Refaktoryzacja Wallet
**Cel**: Uporządkować funkcjonalność portfela

**Zadania**:
- [ ] Przenieść do `features/wallet/`
- [ ] Rozdzielić na komponenty (balance, top-up, withdraw, history)
- [ ] Stworzyć `WalletFacade` service
- [ ] Poprawić UX transakcji
- [ ] Dodać transaction history z paginacją
- [ ] Zoptymalizować real-time updates

**Komponenty**:
```
features/wallet/
├── components/
│   ├── wallet-overview/
│   ├── wallet-balance/
│   ├── wallet-top-up/
│   ├── wallet-withdraw/
│   └── wallet-history/
├── services/
│   ├── wallet-facade.service.ts
│   └── wallet-api.service.ts
└── models/
    └── wallet.model.ts
```

### Faza 6: Layout & Navigation (Tydzień 6-7)

#### 6.1 Refaktoryzacja Layout
**Cel**: Spójny, responsywny layout

**Zadania**:
- [ ] Przenieść do `shared/components/layout/`
- [ ] Stworzyć responsive sidebar
- [ ] Zoptymalizować topbar
- [ ] Dodać mobile navigation (bottom nav lub hamburger)
- [ ] Poprawić breadcrumbs
- [ ] Zoptymalizować notifications (inbox)

**Komponenty**:
```
shared/components/layout/
├── app-shell/
├── header/
├── sidebar/
├── mobile-nav/
├── breadcrumbs/
└── footer/
```

#### 6.2 Mobile Navigation
**Zadania**:
- [ ] Bottom navigation dla mobile
- [ ] Hamburger menu dla tablet
- [ ] Gesture support
- [ ] Smooth transitions

### Faza 7: Responsywność (Tydzień 7-8)

#### 7.1 Mobile-First Approach
**Zadania**:
- [ ] Audit wszystkich komponentów
- [ ] Implementacja breakpoints
- [ ] Touch-friendly interactions
- [ ] Optimized forms dla mobile
- [ ] Proper viewport meta tags

#### 7.2 Testing na Urządzeniach
**Zadania**:
- [ ] iPhone (różne rozmiary)
- [ ] Android (różne rozmiary)
- [ ] iPad
- [ ] Android tablets
- [ ] Desktop (różne rozdzielczości)

### Faza 8: Optymalizacja & Cleanup (Tydzień 8-9)

#### 8.1 Performance Optimization
**Zadania**:
- [ ] Lazy loading dla feature modules
- [ ] Image optimization
- [ ] Bundle size analysis
- [ ] Remove unused dependencies
- [ ] Optimize CSS (remove duplicates)
- [ ] Implement OnPush change detection

#### 8.2 Code Cleanup
**Zadania**:
- [ ] Remove dead code
- [ ] Fix linting issues
- [ ] Standardize naming conventions
- [ ] Add missing types
- [ ] Improve error handling
- [ ] Add proper logging

#### 8.3 Documentation
**Zadania**:
- [ ] Component documentation
- [ ] API documentation
- [ ] Architecture documentation
- [ ] Setup guide
- [ ] Contributing guidelines

---

## 🎨 Design System

### Paleta Kolorów

#### Primary (Green)
```scss
--color-primary-50: #e8f5e9;
--color-primary-100: #c8e6c9;
--color-primary-200: #a5d6a7;
--color-primary-300: #81c784;
--color-primary-400: #66bb6a;
--color-primary-500: #2bb673;  // Main
--color-primary-600: #43a047;
--color-primary-700: #1f8b56;  // Dark
--color-primary-800: #2e7d32;
--color-primary-900: #1b5e20;
```

#### Semantic Colors
```scss
// Success
--color-success: #4caf50;
--color-success-light: #81c784;
--color-success-dark: #388e3c;

// Warning
--color-warning: #ff9800;
--color-warning-light: #ffb74d;
--color-warning-dark: #f57c00;

// Error
--color-error: #f44336;
--color-error-light: #e57373;
--color-error-dark: #d32f2f;

// Info
--color-info: #2196f3;
--color-info-light: #64b5f6;
--color-info-dark: #1976d2;
```

#### Neutrals
```scss
--color-gray-50: #fafafa;
--color-gray-100: #f5f5f5;
--color-gray-200: #eeeeee;
--color-gray-300: #e0e0e0;
--color-gray-400: #bdbdbd;
--color-gray-500: #9e9e9e;
--color-gray-600: #757575;
--color-gray-700: #616161;
--color-gray-800: #424242;
--color-gray-900: #212121;
```

### Typography

```scss
// Font Families
--font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-family-heading: 'Inter', sans-serif;
--font-family-mono: 'Fira Code', 'Courier New', monospace;

// Font Sizes
--font-size-xs: 0.75rem;    // 12px
--font-size-sm: 0.875rem;   // 14px
--font-size-base: 1rem;     // 16px
--font-size-lg: 1.125rem;   // 18px
--font-size-xl: 1.25rem;    // 20px
--font-size-2xl: 1.5rem;    // 24px
--font-size-3xl: 1.875rem;  // 30px
--font-size-4xl: 2.25rem;   // 36px
--font-size-5xl: 3rem;      // 48px

// Font Weights
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;

// Line Heights
--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
--line-height-loose: 2;
```

### Spacing Scale

```scss
--spacing-0: 0;
--spacing-1: 0.25rem;   // 4px
--spacing-2: 0.5rem;    // 8px
--spacing-3: 0.75rem;   // 12px
--spacing-4: 1rem;      // 16px
--spacing-5: 1.25rem;   // 20px
--spacing-6: 1.5rem;    // 24px
--spacing-8: 2rem;      // 32px
--spacing-10: 2.5rem;   // 40px
--spacing-12: 3rem;     // 48px
--spacing-16: 4rem;     // 64px
--spacing-20: 5rem;     // 80px
--spacing-24: 6rem;     // 96px
```

### Shadows

```scss
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

### Border Radius

```scss
--radius-none: 0;
--radius-sm: 0.25rem;   // 4px
--radius-md: 0.375rem;  // 6px
--radius-lg: 0.5rem;    // 8px
--radius-xl: 0.75rem;   // 12px
--radius-2xl: 1rem;     // 16px
--radius-3xl: 1.5rem;   // 24px
--radius-full: 9999px;
```

### Breakpoints

```scss
// Mobile First
$breakpoint-sm: 576px;   // Small devices (landscape phones)
$breakpoint-md: 768px;   // Medium devices (tablets)
$breakpoint-lg: 992px;   // Large devices (desktops)
$breakpoint-xl: 1200px;  // Extra large devices (large desktops)
$breakpoint-xxl: 1400px; // Extra extra large devices

// Mixins
@mixin respond-to($breakpoint) {
  @if $breakpoint == 'sm' {
    @media (min-width: $breakpoint-sm) { @content; }
  }
  @else if $breakpoint == 'md' {
    @media (min-width: $breakpoint-md) { @content; }
  }
  @else if $breakpoint == 'lg' {
    @media (min-width: $breakpoint-lg) { @content; }
  }
  @else if $breakpoint == 'xl' {
    @media (min-width: $breakpoint-xl) { @content; }
  }
  @else if $breakpoint == 'xxl' {
    @media (min-width: $breakpoint-xxl) { @content; }
  }
}
```

---

## 📐 Konwencje Nazewnictwa

### Pliki i Katalogi

#### Komponenty
```
feature-name.component.ts
feature-name.component.html
feature-name.component.scss
feature-name.component.spec.ts
```

#### Serwisy
```
feature-name.service.ts
feature-name.service.spec.ts
```

#### Modele
```
feature-name.model.ts
feature-name.interface.ts
```

#### Guards
```
feature-name.guard.ts
```

#### Interceptors
```
feature-name.interceptor.ts
```

### TypeScript

#### Klasy
```typescript
// PascalCase
export class UserProfileComponent { }
export class AuthService { }
export class UserModel { }
```

#### Interfejsy
```typescript
// PascalCase z prefix 'I' (opcjonalnie)
export interface User { }
export interface IUserProfile { }
```

#### Typy
```typescript
// PascalCase
export type UserRole = 'admin' | 'user' | 'guest';
export type ApiResponse<T> = { data: T; error?: string };
```

#### Zmienne i Funkcje
```typescript
// camelCase
const userName = 'John';
function getUserProfile() { }
```

#### Stałe
```typescript
// UPPER_SNAKE_CASE dla globalnych stałych
export const API_BASE_URL = 'https://api.example.com';
export const MAX_RETRY_ATTEMPTS = 3;

// camelCase dla lokalnych stałych
const defaultPageSize = 10;
```

#### Enums
```typescript
// PascalCase dla enum, UPPER_SNAKE_CASE dla wartości
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}
```

### CSS/SCSS

#### Klasy
```scss
// BEM (Block Element Modifier)
.wf-button { }
.wf-button__icon { }
.wf-button--primary { }
.wf-button--large { }

// Przykład
.wf-card {
  &__header { }
  &__body { }
  &__footer { }
  
  &--elevated { }
  &--outlined { }
}
```

#### CSS Variables
```scss
// kebab-case z prefix
--wf-color-primary: #2bb673;
--wf-spacing-md: 1rem;
--wf-font-size-base: 16px;
```

### Routing

```typescript
// kebab-case
const routes: Routes = [
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'order-details/:id', component: OrderDetailsComponent },
  { path: 'admin/user-management', component: UserManagementComponent }
];
```

### Selektory Komponentów

```typescript
// Prefix 'wf-' (WasteFree) + kebab-case
@Component({
  selector: 'wf-button',
  // ...
})

@Component({
  selector: 'wf-user-profile',
  // ...
})
```

---

## 📱 Responsywność

### Mobile-First Strategy

#### Breakpoints
```scss
// Base styles (mobile)
.component {
  padding: var(--spacing-4);
  font-size: var(--font-size-sm);
}

// Tablet
@include respond-to('md') {
  .component {
    padding: var(--spacing-6);
    font-size: var(--font-size-base);
  }
}

// Desktop
@include respond-to('lg') {
  .component {
    padding: var(--spacing-8);
    font-size: var(--font-size-lg);
  }
}
```

### Touch Targets

```scss
// Minimum 44x44px dla touch targets (Apple HIG)
// Minimum 48x48px dla touch targets (Material Design)
.wf-button {
  min-height: 44px;
  min-width: 44px;
  padding: var(--spacing-3) var(--spacing-6);
}
```

### Responsive Typography

```scss
// Fluid typography
.wf-heading-1 {
  font-size: clamp(1.5rem, 4vw, 3rem);
}

.wf-heading-2 {
  font-size: clamp(1.25rem, 3vw, 2.25rem);
}

.wf-body {
  font-size: clamp(0.875rem, 2vw, 1rem);
}
```

### Responsive Images

```html
<!-- Responsive images -->
<img 
  src="image-mobile.jpg"
  srcset="image-mobile.jpg 576w,
          image-tablet.jpg 768w,
          image-desktop.jpg 1200w"
  sizes="(max-width: 576px) 100vw,
         (max-width: 768px) 50vw,
         33vw"
  alt="Description">
```

### Layout Patterns

#### Stack (Mobile) → Grid (Desktop)
```scss
.wf-card-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  
  @include respond-to('md') {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-6);
  }
  
  @include respond-to('lg') {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-8);
  }
}
```

#### Sidebar Layout
```scss
.wf-layout {
  display: flex;
  flex-direction: column;
  
  @include respond-to('lg') {
    flex-direction: row;
  }
}

.wf-sidebar {
  width: 100%;
  
  @include respond-to('lg') {
    width: 240px;
    flex-shrink: 0;
  }
}

.wf-content {
  flex: 1;
  min-width: 0; // Prevent overflow
}
```

### Navigation Patterns

#### Mobile: Bottom Navigation
```html
<nav class="wf-mobile-nav">
  <a routerLink="/home" class="wf-mobile-nav__item">
    <wf-icon name="home"></wf-icon>
    <span>Home</span>
  </a>
  <!-- More items -->
</nav>
```

```scss
.wf-mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  background: white;
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-2);
  
  @include respond-to('lg') {
    display: none; // Hide on desktop
  }
  
  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-1);
    padding: var(--spacing-2);
    min-width: 64px;
  }
}
```

#### Desktop: Sidebar Navigation
```scss
.wf-sidebar-nav {
  display: none;
  
  @include respond-to('lg') {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 240px;
  }
}
```

---

## 📅 Harmonogram

### Tydzień 1-2: Fundament
- Setup design system
- Refaktoryzacja core services
- Shared UI components

### Tydzień 2-3: Autentykacja
- Refaktoryzacja auth flow
- Responsive auth pages
- Testing

### Tydzień 3-4: Grupy
- Refaktoryzacja groups module
- Responsive UI
- Chat optimization

### Tydzień 4-5: Zamówienia
- Refaktoryzacja orders/pickups
- Admin orders module
- Responsive UI

### Tydzień 5-6: Portfel
- Refaktoryzacja wallet
- Transaction history
- Real-time updates

### Tydzień 6-7: Layout & Navigation
- Responsive layout
- Mobile navigation
- Optimizations

### Tydzień 7-8: Responsywność
- Mobile-first audit
- Testing na urządzeniach
- Fine-tuning

### Tydzień 8-9: Optymalizacja & Cleanup
- Performance optimization
- Code cleanup
- Documentation

---

## 🎯 Metryki Sukcesu

### Performance
- [ ] Lighthouse Score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Bundle size < 500KB (initial)

### Code Quality
- [ ] 0 linting errors
- [ ] TypeScript strict mode enabled
- [ ] 100% type coverage
- [ ] No console.log in production

### Responsiveness
- [ ] Działa na iPhone SE (375px)
- [ ] Działa na iPad (768px)
- [ ] Działa na Desktop (1920px)
- [ ] Touch targets >= 44px

### Accessibility
- [ ] WCAG 2.1 Level AA
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] Proper ARIA labels

### User Experience
- [ ] Loading states dla wszystkich akcji
- [ ] Error handling z user-friendly messages
- [ ] Success feedback
- [ ] Smooth transitions

---

## 📚 Dodatkowe Zasoby

### Dokumentacja
- [Angular Style Guide](https://angular.io/guide/styleguide)
- [Material Design Guidelines](https://material.io/design)
- [Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Narzędzia
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [BrowserStack](https://www.browserstack.com/) - Testing na urządzeniach
- [Figma](https://www.figma.com/) - Design system
- [Storybook](https://storybook.js.org/) - Component library

### Inspiracje
- [Tailwind UI](https://tailwindui.com/)
- [Material Design](https://material.io/)
- [Ant Design](https://ant.design/)
- [Chakra UI](https://chakra-ui.com/)

---

## ✅ Checklist przed Rozpoczęciem

- [ ] Backup obecnego kodu
- [ ] Setup Git branch strategy
- [ ] Przygotowanie środowiska dev
- [ ] Instalacja narzędzi (Figma, BrowserStack, etc.)
- [ ] Code review obecnego stanu
- [ ] Spotkanie z zespołem - omówienie planu
- [ ] Ustalenie priorytetów
- [ ] Setup CI/CD dla nowej struktury

---

**Ostatnia aktualizacja**: 2026-05-30
**Wersja**: 1.0
**Autor**: Bob (Plan Mode)