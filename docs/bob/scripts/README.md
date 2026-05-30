# PowerShell Scripts Documentation

Dokumentacja skryptów automatyzacji używanych w projekcie WasteFree Frontend Refactoring.

**Lokalizacja skryptów:** `UI/BOB/scripts/`

---

## 📋 Spis Skryptów

1. [convert-css-to-scss.ps1](#convert-css-to-scssps1)
2. [fix-imports.ps1](#fix-importsps1)
3. [fix-services-imports.ps1](#fix-services-importsps1)
4. [fix-style-urls.ps1](#fix-style-urlsps1)
5. [restore-style-urls.ps1](#restore-style-urlsps1)
6. [fix-all-scss-vars.ps1](#fix-all-scss-varsps1)
7. [fix-white5f5.ps1](#fix-white5f5ps1)
8. [rename-garbage-groups-model.ps1](#rename-garbage-groups-modelps1)
9. [fix-auth-scss-vars.ps1](#fix-auth-scss-varsps1)
10. [fix-scss-variables.ps1](#fix-scss-variablesps1)

---

## Skrypty

### convert-css-to-scss.ps1

**Cel:** Automatyczna konwersja plików CSS na SCSS

**Funkcjonalność:**
- Znajduje wszystkie pliki `.css` w katalogu `UI/src/app/`
- Zmienia rozszerzenie na `.scss`
- Zachowuje zawartość plików bez zmian

**Użycie:**
```powershell
cd UI/BOB/scripts
.\convert-css-to-scss.ps1
```

**Wynik:**
- 23 pliki CSS przekonwertowane na SCSS
- Oryginalne pliki CSS zostają usunięte

**Status:** ✅ Wykonany (Tydzień 1)

---

### fix-imports.ps1

**Cel:** Naprawa ścieżek importów komponentów po reorganizacji struktury

**Funkcjonalność:**
- Skanuje pliki TypeScript w `UI/src/app/`
- Znajduje importy z nieprawidłowymi ścieżkami
- Aktualizuje ścieżki zgodnie z nową strukturą (core/shared/features)

**Przykłady napraw:**
```typescript
// Przed
import { Component } from '../components/component';

// Po
import { Component } from '@shared/components/component';
```

**Użycie:**
```powershell
cd UI/BOB/scripts
.\fix-imports.ps1
```

**Wynik:**
- 32 importy komponentów naprawione

**Status:** ✅ Wykonany (Tydzień 1)

---

### fix-services-imports.ps1

**Cel:** Naprawa ścieżek importów serwisów

**Funkcjonalność:**
- Aktualizuje importy serwisów do nowej struktury
- Używa TypeScript path mappings (@core, @shared)

**Przykłady napraw:**
```typescript
// Przed
import { AuthService } from '../../services/auth.service';

// Po
import { AuthService } from '@core/services/auth.service';
```

**Użycie:**
```powershell
cd UI/BOB/scripts
.\fix-services-imports.ps1
```

**Wynik:**
- 7 importów serwisów naprawionych

**Status:** ✅ Wykonany (Tydzień 1)

---

### fix-style-urls.ps1

**Cel:** Naprawa referencji do plików stylów w komponentach

**Funkcjonalność:**
- Znajduje dekoratory `@Component` w plikach TypeScript
- Aktualizuje `styleUrls` z `.css` na `.scss`
- Naprawia nieprawidłowe ścieżki

**Przykłady napraw:**
```typescript
// Przed
@Component({
  styleUrls: ['./component.css']
})

// Po
@Component({
  styleUrls: ['./component.scss']
})
```

**Użycie:**
```powershell
cd UI/BOB/scripts
.\fix-style-urls.ps1
```

**Status:** ✅ Wykonany (Tydzień 1)

---

### restore-style-urls.ps1

**Cel:** Naprawa błędnie zmodyfikowanych ścieżek styleUrls

**Funkcjonalność:**
- Koryguje błędy powstałe podczas automatycznej konwersji
- Przywraca prawidłowe nazwy plików
- Dodaje brakujące slashe w ścieżkach

**Przykłady napraw:**
```typescript
// Przed (błąd)
styleUrls: ['component.scss']

// Po
styleUrls: ['./component.scss']
```

**Użycie:**
```powershell
cd UI/BOB/scripts
.\restore-style-urls.ps1
```

**Status:** ✅ Wykonany (Tydzień 1)

---

### fix-all-scss-vars.ps1

**Cel:** Naprawa błędnych nazw zmiennych SCSS

**Funkcjonalność:**
- Znajduje zmienne SCSS z błędnymi nazwami
- Naprawia typowe błędy (np. `$whitefff` → `$white`)
- Aktualizuje wszystkie pliki SCSS w projekcie

**Przykłady napraw:**
```scss
// Przed
color: $whitefff;
background: $primary500;

// Po
color: $white;
background: $primary;
```

**Użycie:**
```powershell
cd UI/BOB/scripts
.\fix-all-scss-vars.ps1
```

**Status:** ✅ Wykonany (Tydzień 1)

---

### fix-white5f5.ps1

**Cel:** Naprawa specyficznego błędu zmiennej `$white5f5`

**Funkcjonalność:**
- Znajduje i naprawia zmienną `$white5f5` na `$white`
- Dedykowany skrypt dla konkretnego problemu

**Przykłady napraw:**
```scss
// Przed
background-color: $white5f5;

// Po
background-color: $white;
```

**Użycie:**
```powershell
cd UI/BOB/scripts
.\fix-white5f5.ps1
```

**Status:** ✅ Wykonany (Tydzień 1)

---

### rename-garbage-groups-model.ps1

**Cel:** Zmiana nazwy pliku modelu na kebab-case

**Funkcjonalność:**
- Zmienia nazwę `garbageGroups.ts` na `garbage-groups.ts`
- Aktualizuje wszystkie importy w projekcie (6 plików)

**Przykłady napraw:**
```typescript
// Przed
import { GarbageGroup } from '@shared/models/garbageGroups';

// Po
import { GarbageGroup } from '@shared/models/garbage-groups';
```

**Użycie:**
```powershell
cd UI/BOB/scripts
.\rename-garbage-groups-model.ps1
```

**Wynik:**
- Plik zmieniony: `garbageGroups.ts` → `garbage-groups.ts`
- 6 importów zaktualizowanych

**Status:** ✅ Wykonany (Tydzień 1)

---

### fix-auth-scss-vars.ps1

**Cel:** Naprawa błędnych wzorców zmiennych SCSS w module auth

**Funkcjonalność:**
- Naprawia wzorce typu `1$spacing-xs`, `2$spacing-xs`, etc.
- Konwertuje na prawidłowe zmienne z design system
- Dedykowany dla pliku `auth.component.scss`

**Przykłady napraw:**
```scss
// Przed
padding: 1$spacing-xs;
margin: 2$spacing-xs;
gap: 3$spacing-xs;

// Po
padding: $spacing-sm;
margin: $spacing-md;
gap: $spacing-lg;
```

**Mapowanie:**
- `1$spacing-xs` → `$spacing-sm`
- `2$spacing-xs` → `$spacing-md`
- `3$spacing-xs` → `$spacing-lg`
- `4$spacing-xs` → `$spacing-xl`

**Użycie:**
```powershell
cd UI/BOB/scripts
.\fix-auth-scss-vars.ps1
```

**Wynik:**
- Naprawiono `auth.component.scss` (667 linii)

**Status:** ✅ Wykonany (Tydzień 3)

---

### fix-scss-variables.ps1

**Cel:** Ogólny skrypt do naprawy zmiennych SCSS

**Funkcjonalność:**
- Uniwersalny skrypt do naprawy różnych błędów w zmiennych
- Może być dostosowany do konkretnych potrzeb

**Status:** ⚠️ Pomocniczy (używany w razie potrzeby)

---

## 🔧 Jak Używać Skryptów

### Wymagania:
- Windows PowerShell 5.1 lub nowszy
- Uprawnienia do wykonywania skryptów

### Włączenie wykonywania skryptów (jeśli potrzebne):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Uruchamianie skryptu:
```powershell
# Przejdź do katalogu ze skryptami
cd c:/wastefree/WasteFree/UI/BOB/scripts

# Uruchom skrypt
.\nazwa-skryptu.ps1
```

### Testowanie przed wykonaniem:
Większość skryptów ma tryb "dry-run" - możesz dodać parametr `-WhatIf`:
```powershell
.\fix-imports.ps1 -WhatIf
```

---

## 📊 Statystyki Użycia

### Tydzień 1 - Fundament:
- **convert-css-to-scss.ps1**: 23 pliki przekonwertowane
- **fix-imports.ps1**: 32 importy naprawione
- **fix-services-imports.ps1**: 7 importów naprawionych
- **fix-style-urls.ps1**: ~40 referencji zaktualizowanych
- **restore-style-urls.ps1**: ~15 ścieżek naprawionych
- **fix-all-scss-vars.ps1**: ~50 zmiennych naprawionych
- **fix-white5f5.ps1**: ~10 wystąpień naprawionych
- **rename-garbage-groups-model.ps1**: 1 plik + 6 importów

### Tydzień 3 - Refaktoryzacja:
- **fix-auth-scss-vars.ps1**: 1 plik (667 linii) naprawiony

**Łącznie:** ~180+ automatycznych napraw

---

## 🎯 Best Practices

### Przed uruchomieniem skryptu:
1. ✅ Zrób commit zmian w Git
2. ✅ Sprawdź czy jesteś w odpowiednim katalogu
3. ✅ Przeczytaj dokumentację skryptu
4. ✅ Użyj `-WhatIf` jeśli dostępne

### Po uruchomieniu skryptu:
1. ✅ Sprawdź logi w konsoli
2. ✅ Zweryfikuj zmiany w plikach
3. ✅ Uruchom build: `npm run build`
4. ✅ Przetestuj aplikację
5. ✅ Zrób commit z opisem zmian

### W razie problemów:
1. ❌ Nie panikuj
2. ✅ Sprawdź Git diff
3. ✅ Użyj `git checkout` dla pojedynczych plików
4. ✅ Lub `git reset --hard` dla pełnego cofnięcia
5. ✅ Zgłoś problem w dokumentacji

---

## 📝 Tworzenie Nowych Skryptów

### Szablon skryptu:
```powershell
# Nazwa: nazwa-skryptu.ps1
# Cel: Krótki opis celu skryptu
# Autor: Imię
# Data: YYYY-MM-DD

# Parametry
param(
    [switch]$WhatIf
)

# Konfiguracja
$rootPath = "c:/wastefree/WasteFree/UI/src/app"

# Funkcja główna
function Main {
    Write-Host "Starting script..." -ForegroundColor Green
    
    # Twoja logika tutaj
    
    Write-Host "Script completed!" -ForegroundColor Green
}

# Uruchomienie
Main
```

### Konwencje:
- Używaj kebab-case dla nazw plików
- Dodaj komentarze wyjaśniające
- Używaj `Write-Host` z kolorami dla czytelności
- Implementuj `-WhatIf` dla bezpieczeństwa
- Testuj na małym zbiorze plików najpierw

---

## 🔗 Powiązane Dokumenty

- [PROGRESS.md](../PROGRESS.md) - Postęp prac
- [frontend-refactoring-plan.md](../plans/frontend-refactoring-plan.md) - Szczegółowy plan
- [README.md](../README.md) - Główna dokumentacja

---

**Ostatnia aktualizacja:** 30 maja 2026, 17:04  
**Autor:** Bob (AI Assistant)