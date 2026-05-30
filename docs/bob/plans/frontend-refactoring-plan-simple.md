# Plan Refaktoryzacji Frontendu WasteFree - Wersja Uproszczona

## 🎯 Cel
Uporządkować frontend, poprawić responsywność i ujednolicić kod bez nadmiernego komplikowania architektury.

---

## 📋 Zidentyfikowane Problemy (Priorytet)

### 🔴 Krytyczne
1. **Chaos w stylach CSS** - 480 linii w `home.component.css`, duplikaty, brak spójności
2. **Słaba responsywność** - aplikacja źle wygląda na telefonach
3. **Niespójne nazewnictwo** - `_models/`, `garbageGroups.ts` vs `garbage-orders.ts`
4. **Wszystko w `shared/`** - auth, wallet, portal w jednym miejscu

### 🟡 Ważne
5. **Duplikacja kodu** - loading states, error handling powtarzane wszędzie
6. **Brak organizacji** - trudno znaleźć pliki, brak logicznej struktury

---

## 🚀 Plan Działania (2-3 tygodnie)

### Tydzień 1: Porządki i Fundament

#### 1. Uporządkowanie Struktury Katalogów (2 dni)
**Cel**: Prosta, logiczna organizacja

```
UI/src/app/
├── core/                    # Serwisy singleton (auth, http)
│   ├── services/
│   ├── guards/
│   └── interceptors/
├── shared/                  # Komponenty wielokrotnego użytku
│   ├── components/         # Przyciski, karty, inputy
│   └── pipes/
├── features/               # Moduły funkcjonalne
│   ├── auth/
│   ├── groups/
│   ├── orders/
│   └── wallet/
└── styles/                 # Style globalne
    ├── _variables.scss
    └── _mixins.scss
```

**Zadania**:
- [ ] Przenieść `_models/` → `shared/models/` (usunąć underscore)
- [ ] Przenieść `components/shared/auth/` → `features/auth/`
- [ ] Przenieść `components/shared/wallet/` → `features/wallet/`
- [ ] Przenieść `components/user/groups/` → `features/groups/`
- [ ] Przenieść `components/user/my-pickups/` → `features/orders/`
- [ ] Ujednolicić nazewnictwo plików (wszystko kebab-case)

#### 2. Design System - Minimum (1 dzień)
**Cel**: Podstawowe zmienne CSS dla spójności

Stworzyć `UI/src/styles/_variables.scss`:
```scss
// Kolory
$primary: #2bb673;
$primary-dark: #1f8b56;
$success: #4caf50;
$error: #f44336;
$warning: #ff9800;

// Spacing (8px grid)
$spacing-xs: 0.5rem;   // 8px
$spacing-sm: 1rem;     // 16px
$spacing-md: 1.5rem;   // 24px
$spacing-lg: 2rem;     // 32px
$spacing-xl: 3rem;     // 48px

// Shadows
$shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
$shadow-md: 0 4px 8px rgba(0,0,0,0.1);
$shadow-lg: 0 8px 16px rgba(0,0,0,0.15);

// Border radius
$radius-sm: 8px;
$radius-md: 12px;
$radius-lg: 16px;

// Breakpoints
$mobile: 576px;
$tablet: 768px;
$desktop: 992px;
```

**Zadania**:
- [ ] Stworzyć `_variables.scss`
- [ ] Stworzyć `_mixins.scss` (responsive mixins)
- [ ] Zaimportować w `styles.css`
- [ ] Zastąpić hardcoded wartości zmiennymi w 3-4 głównych komponentach

#### 3. Cleanup CSS (2 dni)
**Cel**: Usunąć duplikaty, uporządkować style

**Zadania**:
- [ ] Wyciągnąć wspólne style z `home.component.css` do globalnych
- [ ] Usunąć nieużywane style
- [ ] Ujednolicić nazewnictwo klas (BEM lub prosta konwencja)
- [ ] Przenieść inline styles do plików CSS

### Tydzień 2: Responsywność i Komponenty

#### 4. Mobile-First Layout (3 dni)
**Cel**: Aplikacja działa dobrze na telefonach

**Priorytet**:
1. **Navigation** - Bottom nav na mobile, sidebar na desktop
2. **Forms** - Większe inputy, touch-friendly
3. **Cards/Lists** - Stack na mobile, grid na desktop
4. **Topbar** - Hamburger menu na mobile

**Zadania**:
- [ ] Poprawić `portal.component.scss` - responsive sidebar
- [ ] Dodać bottom navigation dla mobile
- [ ] Poprawić formularze (auth, orders) - większe touch targets
- [ ] Poprawić listy grup i zamówień - responsive grid
- [ ] Testować na telefonie (Chrome DevTools)

#### 5. Podstawowe Shared Components (2 dni)
**Cel**: 3-4 komponenty wielokrotnego użytku

**Do stworzenia**:
- [ ] `LoaderComponent` - spinner używany wszędzie
- [ ] `EmptyStateComponent` - "brak danych" używany w listach
- [ ] `ErrorMessageComponent` - wyświetlanie błędów

**Przykład LoaderComponent**:
```typescript
@Component({
  selector: 'wf-loader',
  template: `
    <div class="loader">
      <div class="spinner"></div>
      <p *ngIf="message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .loader { 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      padding: 2rem; 
    }
    .spinner { 
      width: 40px; 
      height: 40px; 
      border: 4px solid #f3f3f3;
      border-top: 4px solid #2bb673;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class LoaderComponent {
  @Input() message?: string;
}
```

### Tydzień 3: Optymalizacja i Finalizacja

#### 6. Refaktoryzacja Kluczowych Komponentów (3 dni)
**Cel**: Uporządkować 3 najważniejsze moduły

**Auth Module**:
- [ ] Rozdzielić login i register na osobne komponenty
- [ ] Wyciągnąć wspólną logikę do serwisu
- [ ] Poprawić error handling

**Groups Module**:
- [ ] Uprościć `groups.component.ts`
- [ ] Poprawić wyświetlanie listy grup
- [ ] Poprawić chat (jeśli czas)

**Orders Module**:
- [ ] Ujednolicić nazewnictwo (orders vs pickups)
- [ ] Poprawić listę zamówień
- [ ] Dodać filtry (jeśli czas)

#### 7. Testing i Dokumentacja (2 dni)
**Zadania**:
- [ ] Przetestować na różnych urządzeniach (telefon, tablet, desktop)
- [ ] Naprawić znalezione bugi
- [ ] Stworzyć prosty README z konwencjami
- [ ] Dodać komentarze do skomplikowanych części kodu

---

## 📱 Responsywność - Praktyczne Podejście

### Breakpoints
```scss
// _mixins.scss
@mixin mobile {
  @media (max-width: 767px) { @content; }
}

@mixin tablet {
  @media (min-width: 768px) and (max-width: 991px) { @content; }
}

@mixin desktop {
  @media (min-width: 992px) { @content; }
}
```

### Przykład Użycia
```scss
.card-grid {
  display: grid;
  gap: 1rem;
  
  // Mobile: 1 kolumna
  grid-template-columns: 1fr;
  
  // Tablet: 2 kolumny
  @include tablet {
    grid-template-columns: repeat(2, 1fr);
  }
  
  // Desktop: 3 kolumny
  @include desktop {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## 📐 Konwencje Nazewnictwa (Proste)

### Pliki
```
feature-name.component.ts
feature-name.component.html
feature-name.component.scss
feature-name.service.ts
feature-name.model.ts
```

### Klasy TypeScript
```typescript
export class UserProfileComponent { }  // PascalCase
export class AuthService { }           // PascalCase
export interface User { }              // PascalCase
```

### Zmienne i Funkcje
```typescript
const userName = 'John';               // camelCase
function getUserProfile() { }          // camelCase
```

### CSS Klasy
```scss
.card { }                              // kebab-case
.card-header { }
.card-body { }
.card--highlighted { }                 // modifier
```

---

## ✅ Checklist Przed Rozpoczęciem

- [ ] Backup kodu (git commit)
- [ ] Przeczytać cały plan
- [ ] Przygotować środowisko (VS Code, Chrome DevTools)
- [ ] Mieć dostęp do telefonu do testowania

---

## 🎯 Metryki Sukcesu (Realistyczne)

### Must Have
- [ ] Aplikacja działa na telefonie (375px szerokości)
- [ ] Aplikacja działa na tablecie (768px)
- [ ] Aplikacja działa na desktopie (1920px)
- [ ] Brak duplikacji stylów w głównych komponentach
- [ ] Logiczna struktura katalogów
- [ ] Spójne nazewnictwo plików

### Nice to Have
- [ ] Lighthouse Performance > 80
- [ ] Brak console.log w kodzie
- [ ] Podstawowa dokumentacja
- [ ] 3-4 reusable komponenty

---

## 💡 Wskazówki

### Nie Komplikuj
- Nie twórz skomplikowanych abstrakcji
- Nie wprowadzaj nowych bibliotek bez potrzeby
- Nie refaktoryzuj wszystkiego naraz
- Zachowaj działającą funkcjonalność

### Priorytetyzuj
1. Najpierw responsywność (to widać od razu)
2. Potem porządki w kodzie (łatwiej pracować)
3. Na końcu optymalizacje (jeśli zostanie czas)

### Testuj Często
- Po każdej zmianie sprawdź czy działa
- Testuj na prawdziwym telefonie (nie tylko DevTools)
- Commituj często (małe commity)

---

## 📅 Harmonogram (Elastyczny)

| Dzień | Zadanie | Czas |
|-------|---------|------|
| 1-2 | Reorganizacja katalogów | 2 dni |
| 3 | Design system (zmienne CSS) | 1 dzień |
| 4-5 | Cleanup CSS | 2 dni |
| 6-8 | Responsywność (navigation, forms, lists) | 3 dni |
| 9-10 | Shared components | 2 dni |
| 11-13 | Refaktoryzacja modułów (auth, groups, orders) | 3 dni |
| 14-15 | Testing i dokumentacja | 2 dni |

**Total: ~15 dni roboczych (3 tygodnie)**

---

## 🚨 Co NIE Robimy (Żeby Nie Przesadzić)

- ❌ Nie piszemy testów jednostkowych (na razie)
- ❌ Nie wprowadzamy state management library (RxJS wystarczy)
- ❌ Nie tworzymy Storybook
- ❌ Nie migrujemy do nowszej wersji Angular
- ❌ Nie przepisujemy wszystkiego od zera
- ❌ Nie tworzymy skomplikowanych abstrakcji
- ❌ Nie optymalizujemy bundle size (chyba że jest problem)

---

**Ostatnia aktualizacja**: 2026-05-30
**Wersja**: 1.0 (Uproszczona)