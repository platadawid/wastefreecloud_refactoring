# WasteFree Frontend - Developer Guidelines

**Wersja:** 1.0  
**Data:** 30 maja 2026  
**Framework:** Angular 17 (Standalone Components)

---

## 📋 Spis Treści

1. [Wprowadzenie](#wprowadzenie)
2. [Struktura Projektu](#struktura-projektu)
3. [Konwencje Nazewnictwa](#konwencje-nazewnictwa)
4. [Design System](#design-system)
5. [Wzorce i Best Practices](#wzorce-i-best-practices)
6. [Tworzenie Nowych Komponentów](#tworzenie-nowych-komponentów)
7. [Stylowanie](#stylowanie)
8. [State Management](#state-management)
9. [Routing](#routing)
10. [Internationalization](#internationalization)
11. [Testing](#testing)
12. [Git Workflow](#git-workflow)

---

## 🎯 Wprowadzenie

Ten dokument zawiera wytyczne dla deweloperów pracujących nad aplikacją WasteFree Frontend. Przestrzeganie tych zasad zapewnia spójność kodu i ułatwia współpracę w zespole.

### Kluczowe Zasady
- ✅ **Standalone Components** - Używamy nowoczesnej architektury Angular 17
- ✅ **Mobile-First** - Projektujemy najpierw dla urządzeń mobilnych
- ✅ **DRY Principle** - Nie powtarzamy kodu
- ✅ **Type Safety** - Pełne typowanie TypeScript
- ✅ **Design System** - Używamy zmiennych i mixinów SCSS

---

## 📁 Struktura Projektu

```
UI/src/app/
├── core/                    # Singleton services, guards, interceptors
│   ├── guards/             # Route guards (auth, role-based)
│   ├── interceptors/       # HTTP interceptors (auth, error)
│   ├── services/           # Core services (auth, translation, current-user)
│   └── helpers/            # Helper functions
│
├── shared/                  # Shared components, pipes, directives
│   ├── components/         # Reusable components (topbar, bottom-nav, etc.)
│   ├── pipes/              # Custom pipes (translate)
│   ├── directives/         # Custom directives (show-for-roles)
│   └── models/             # Shared TypeScript interfaces/types
│
├── features/               # Feature modules (lazy-loadable)
│   ├── auth/              # Authentication feature
│   │   ├── components/    # Auth-specific components
│   │   ├── services/      # Auth-specific services
│   │   └── constants/     # Auth constants
│   │
│   ├── groups/            # Groups feature
│   │   ├── components/
│   │   ├── services/
│   │   └── utils/         # Feature-specific utilities
│   │
│   ├── orders/            # Orders/Pickups feature
│   │   ├── components/
│   │   ├── services/
│   │   ├── constants/
│   │   └── utils/
│   │
│   ├── wallet/            # Wallet feature
│   │   ├── components/
│   │   └── services/
│   │
│   └── admin/             # Admin feature
│       ├── components/
│       └── services/
│
├── resolvers/              # Route resolvers
├── services/               # Legacy services (to be moved)
└── styles/                 # Global styles
    ├── _variables.scss    # Design system variables
    ├── _mixins.scss       # Reusable mixins
    ├── _utilities.scss    # Utility classes
    ├── _forms.scss        # Form styles
    ├── _cards.scss        # Card styles
    └── styles.scss        # Main stylesheet
```

### Path Mappings

Używamy aliasów TypeScript dla czystszych importów:

```typescript
// ❌ Źle - relatywne ścieżki
import { AuthService } from '../../../core/services/auth.service';

// ✅ Dobrze - aliasy
import { AuthService } from '@app/core/services/auth.service';
```

**Dostępne aliasy:**
- `@app/*` → `src/app/*`
- `@core/*` → `src/app/core/*`
- `@shared/*` → `src/app/shared/*`
- `@features/*` → `src/app/features/*`
- `@environments/*` → `src/environments/*`

---

## 📝 Konwencje Nazewnictwa

### Pliki i Katalogi

```
kebab-case.component.ts     # Komponenty
kebab-case.service.ts       # Serwisy
kebab-case.guard.ts         # Guards
kebab-case.interceptor.ts   # Interceptors
kebab-case.pipe.ts          # Pipes
kebab-case.directive.ts     # Directives
kebab-case.model.ts         # Modele/Interfejsy
kebab-case.constants.ts     # Stałe
kebab-case.utils.ts         # Funkcje pomocnicze
kebab-case.types.ts         # Typy TypeScript
```

### TypeScript

```typescript
// Klasy - PascalCase
export class UserService { }
export class AuthGuard { }

// Interfejsy - PascalCase
export interface User { }
export interface LoginRequest { }

// Typy - PascalCase
export type UserRole = 'user' | 'admin';

// Stałe - UPPER_SNAKE_CASE
export const API_BASE_URL = 'https://api.example.com';
export const DEFAULT_LANGUAGE = 'pl';

// Funkcje - camelCase
export function formatOrderNumber(id: string): string { }
export function getAvatarColor(name: string): string { }

// Zmienne - camelCase
const currentUser = signal<User | null>(null);
const isLoading = signal(false);
```

### SCSS

```scss
// Klasy - kebab-case z BEM
.component-name { }
.component-name__element { }
.component-name--modifier { }

// Zmienne - kebab-case z prefix
$color-primary: #007bff;
$spacing-md: 1rem;
$font-size-lg: 1.125rem;

// Mixins - kebab-case
@mixin button-primary { }
@mixin touch-button { }
```

---

## 🎨 Design System

### Kolory

```scss
// Primary colors
$color-primary: #007bff;
$color-primary-dark: #0056b3;
$color-primary-light: #e7f3ff;

// Semantic colors
$color-success: #28a745;
$color-danger: #dc3545;
$color-warning: #ffc107;
$color-info: #17a2b8;

// Neutral colors
$color-text: #212529;
$color-text-muted: #6c757d;
$color-background: #f8f9fa;
$color-border: #dee2e6;
```

**Użycie:**
```scss
.button {
  background-color: $color-primary;
  color: white;
  
  &:hover {
    background-color: $color-primary-dark;
  }
}
```

### Spacing

```scss
$spacing-xs: 0.25rem;   // 4px
$spacing-sm: 0.5rem;    // 8px
$spacing-md: 1rem;      // 16px
$spacing-lg: 1.5rem;    // 24px
$spacing-xl: 2rem;      // 32px
$spacing-2xl: 5rem;     // 80px
$spacing-3xl: 6rem;     // 96px
$spacing-4xl: 8rem;     // 128px
```

**Użycie:**
```scss
.card {
  padding: $spacing-md;
  margin-bottom: $spacing-lg;
  gap: $spacing-sm;
}
```

### Typography

```scss
$font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

$font-size-xs: 0.75rem;    // 12px
$font-size-sm: 0.875rem;   // 14px
$font-size-base: 1rem;     // 16px
$font-size-lg: 1.125rem;   // 18px
$font-size-xl: 1.25rem;    // 20px
$font-size-2xl: 1.5rem;    // 24px
$font-size-3xl: 2rem;      // 32px

$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

### Breakpoints

```scss
$breakpoint-sm: 576px;   // Small devices (phones)
$breakpoint-md: 768px;   // Medium devices (tablets)
$breakpoint-lg: 992px;   // Large devices (desktops)
$breakpoint-xl: 1200px;  // Extra large devices
```

**Użycie z mixinami:**
```scss
.component {
  padding: $spacing-sm;
  
  @include respond-to('md') {
    padding: $spacing-md;
  }
  
  @include respond-to('lg') {
    padding: $spacing-lg;
  }
}
```

### Mixins

#### Button Mixins
```scss
// Primary button
@include button-primary;

// Secondary button
@include button-secondary;

// Touch-friendly button (min 48px)
@include touch-button;
```

#### Card Mixins
```scss
// Standard card
@include card;

// Hoverable card
@include card-hover;
```

#### Form Mixins
```scss
// Form input
@include form-input;

// Form label
@include form-label;
```

---

## 💡 Wzorce i Best Practices

### 1. Dependency Injection - inject() Pattern

**✅ Dobrze - Nowoczesny Angular 17:**
```typescript
import { inject } from '@angular/core';

export class MyComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  
  // Component logic
}
```

**❌ Źle - Stary pattern:**
```typescript
export class MyComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }
}
```

### 2. Signals dla State Management

**✅ Dobrze:**
```typescript
export class MyComponent {
  // Reactive state
  users = signal<User[]>([]);
  isLoading = signal(false);
  selectedUser = signal<User | null>(null);
  
  // Computed values
  userCount = computed(() => this.users().length);
  hasUsers = computed(() => this.users().length > 0);
  
  loadUsers() {
    this.isLoading.set(true);
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}
```

### 3. Constants Extraction

**✅ Dobrze - Wydzielone stałe:**
```typescript
// feature.constants.ts
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const STATUS_LABELS = {
  pending: 'status.pending',
  approved: 'status.approved',
  rejected: 'status.rejected'
} as const;

export type StatusKey = keyof typeof STATUS_LABELS;
```

**❌ Źle - Hardcoded values:**
```typescript
if (items.length > 10) { } // Magic number
const status = 'pending'; // Magic string
```

### 4. Utility Functions

**✅ Dobrze - Reużywalne funkcje:**
```typescript
// feature.utils.ts
export function formatOrderNumber(id: string): string {
  return `#${id.substring(0, 8).toUpperCase()}`;
}

export function isFutureDate(date: Date | string): boolean {
  return new Date(date) > new Date();
}

// W komponencie
import { formatOrderNumber } from './utils/feature.utils';

const displayId = formatOrderNumber(order.id);
```

### 5. Error Handling

**✅ Dobrze:**
```typescript
this.service.getData().subscribe({
  next: (data) => {
    this.data.set(data);
  },
  error: (err) => {
    const message = err?.error?.errorMessage || 'errors.generic';
    this.toastr.error(this.translate.translate(message));
    console.error('Operation failed', { err });
  }
});
```

### 6. Organizacja Importów

**✅ Dobrze - Pogrupowane importy:**
```typescript
// Angular core
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { AuthService } from '@app/core/services/auth.service';
import { TranslationService } from '@app/core/services/translation.service';

// Models
import { User } from '@app/shared/models/user';
import { LoginRequest } from '@app/shared/models/auth';

// Pipes
import { TranslatePipe } from '@app/shared/pipes/translate.pipe';

// Constants & Utils
import { USER_ROLES } from './constants/auth.constants';
import { formatDate } from './utils/date.utils';
```

---

## 🆕 Tworzenie Nowych Komponentów

### 1. Generowanie Komponentu

```bash
# Standalone component
ng generate component features/my-feature/components/my-component --standalone

# Z routing
ng generate component features/my-feature/components/my-component --standalone --routing
```

### 2. Template Komponentu

```typescript
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// Services
import { MyService } from '@app/features/my-feature/services/my.service';
import { TranslationService } from '@app/core/services/translation.service';

// Models
import { MyModel } from '@app/shared/models/my-model';

// Pipes
import { TranslatePipe } from '@app/shared/pipes/translate.pipe';

// Constants
import { MY_CONSTANTS } from '../constants/my.constants';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './my-component.component.html',
  styleUrl: './my-component.component.scss'
})
export class MyComponent {
  // Services
  private myService = inject(MyService);
  private translate = inject(TranslationService);
  
  // State
  data = signal<MyModel[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);
  
  // Computed
  hasData = computed(() => this.data().length > 0);
  dataCount = computed(() => this.data().length);
  
  // Constants
  readonly constants = MY_CONSTANTS;
  
  // Lifecycle
  ngOnInit() {
    this.loadData();
  }
  
  // Methods
  loadData() {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.myService.getData().subscribe({
      next: (data) => {
        this.data.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.errorMessage || 'errors.generic');
        this.isLoading.set(false);
      }
    });
  }
}
```

### 3. Template HTML

```html
<div class="my-component">
  <!-- Loading state -->
  @if (isLoading()) {
    <div class="my-component__loader">
      <div class="spinner"></div>
      <p>{{ 'common.loading' | translate }}</p>
    </div>
  }
  
  <!-- Error state -->
  @else if (error()) {
    <div class="my-component__error">
      <p>{{ error() | translate }}</p>
      <button (click)="loadData()" class="btn btn--primary">
        {{ 'common.retry' | translate }}
      </button>
    </div>
  }
  
  <!-- Data state -->
  @else if (hasData()) {
    <div class="my-component__content">
      @for (item of data(); track item.id) {
        <div class="my-component__item">
          {{ item.name }}
        </div>
      }
    </div>
  }
  
  <!-- Empty state -->
  @else {
    <div class="my-component__empty">
      <p>{{ 'common.noData' | translate }}</p>
    </div>
  }
</div>
```

### 4. Stylowanie SCSS

```scss
@import 'src/styles/variables';
@import 'src/styles/mixins';

.my-component {
  padding: $spacing-md;
  
  &__loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-xl;
  }
  
  &__error {
    @include card;
    padding: $spacing-md;
    background-color: $color-danger-light;
    
    button {
      @include button-primary;
      @include touch-button;
      margin-top: $spacing-sm;
    }
  }
  
  &__content {
    display: grid;
    gap: $spacing-md;
    
    @include respond-to('md') {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @include respond-to('lg') {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  
  &__item {
    @include card;
    @include card-hover;
    padding: $spacing-md;
  }
  
  &__empty {
    text-align: center;
    padding: $spacing-xl;
    color: $color-text-muted;
  }
}
```

---

## 🎨 Stylowanie

### Mobile-First Approach

**✅ Zawsze zaczynaj od mobile:**
```scss
.component {
  // Mobile styles (default)
  padding: $spacing-sm;
  font-size: $font-size-sm;
  
  // Tablet and up
  @include respond-to('md') {
    padding: $spacing-md;
    font-size: $font-size-base;
  }
  
  // Desktop and up
  @include respond-to('lg') {
    padding: $spacing-lg;
    font-size: $font-size-lg;
  }
}
```

### Touch-Friendly UI

**Wszystkie interaktywne elementy min 48x48px:**
```scss
.button {
  @include touch-button; // Automatycznie min-height: 48px
  padding: $spacing-sm $spacing-md;
}
```

### BEM Methodology

```scss
// Block
.card { }

// Element
.card__header { }
.card__body { }
.card__footer { }

// Modifier
.card--highlighted { }
.card--compact { }

// Element with modifier
.card__header--sticky { }
```

---

## 🔄 State Management

### Signals (Preferowane)

```typescript
// Simple state
const count = signal(0);
count.set(5);
count.update(n => n + 1);

// Complex state
const user = signal<User | null>(null);
user.set({ id: 1, name: 'John' });

// Computed values
const fullName = computed(() => {
  const u = user();
  return u ? `${u.firstName} ${u.lastName}` : '';
});
```

### Services dla Shared State

```typescript
@Injectable({ providedIn: 'root' })
export class StateService {
  private _users = signal<User[]>([]);
  
  // Read-only access
  users = this._users.asReadonly();
  
  // Computed
  userCount = computed(() => this._users().length);
  
  // Methods
  addUser(user: User) {
    this._users.update(users => [...users, user]);
  }
  
  removeUser(id: string) {
    this._users.update(users => users.filter(u => u.id !== id));
  }
}
```

---

## 🛣️ Routing

### Dodawanie Nowej Trasy

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'my-feature',
    component: MyFeatureComponent,
    canActivate: [authGuard], // Optional guard
    data: { showTopbar: true }, // Optional data
    children: [
      { path: '', component: MyFeatureHomeComponent },
      { path: ':id', component: MyFeatureDetailsComponent }
    ]
  }
];
```

### Nawigacja

```typescript
// W komponencie
private router = inject(Router);

// Programmatic navigation
navigateToDetails(id: string) {
  this.router.navigate(['/my-feature', id]);
}

// W template
<a [routerLink]="['/my-feature', item.id]">Details</a>
```

---

## 🌍 Internationalization

### Dodawanie Tłumaczeń

```json
// src/assets/i18n/pl.json
{
  "myFeature": {
    "title": "Moja Funkcja",
    "description": "Opis funkcji",
    "actions": {
      "save": "Zapisz",
      "cancel": "Anuluj"
    }
  }
}

// src/assets/i18n/en.json
{
  "myFeature": {
    "title": "My Feature",
    "description": "Feature description",
    "actions": {
      "save": "Save",
      "cancel": "Cancel"
    }
  }
}
```

### Użycie w Komponencie

```typescript
// Przez pipe
<h1>{{ 'myFeature.title' | translate }}</h1>

// Przez service
private translate = inject(TranslationService);

const title = this.translate.translate('myFeature.title');
```

---

## 🧪 Testing

### Unit Tests (TODO)

```typescript
describe('MyComponent', () => {
  it('should create', () => {
    // Test implementation
  });
  
  it('should load data on init', () => {
    // Test implementation
  });
});
```

---

## 🔀 Git Workflow

### Branch Naming

```
feature/feature-name      # Nowa funkcjonalność
bugfix/bug-description    # Naprawa błędu
refactor/refactor-name    # Refaktoryzacja
docs/documentation-update # Dokumentacja
```

### Commit Messages

```
feat: Add user profile component
fix: Resolve navigation issue on mobile
refactor: Extract constants from auth component
docs: Update contributing guidelines
style: Format code according to style guide
test: Add unit tests for wallet service
```

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Refactoring
- [ ] Documentation

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] Build successful
- [ ] Tested on mobile
```

---

## 📚 Dodatkowe Zasoby

### Dokumentacja
- [Angular Documentation](https://angular.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [SCSS Documentation](https://sass-lang.com/documentation)

### Narzędzia
- [Angular DevTools](https://angular.dev/tools/devtools)
- [VS Code Angular Extension Pack](https://marketplace.visualstudio.com/items?itemName=loiane.angular-extension-pack)

---

## 🤝 Wsparcie

Pytania? Problemy? Skontaktuj się z zespołem:
- GitHub Issues: [Link do repo]
- Slack: #wastefree-frontend
- Email: dev@wastefree.com

---

**Ostatnia aktualizacja:** 30 maja 2026  
**Wersja:** 1.0  
**Maintainer:** Bob (AI Code Assistant)