# WCAG Color Contrast Matrix Professional

Profesjonalne narzędzie do masowej weryfikacji kontrastu kolorów zgodnie z wytycznymi WCAG 2.1. Idealne dla projektantów systemów projektowych (Design Systems) oraz specjalistów od dostępności (Accessibility).

## Funkcje

- **Macierz kontrastu**: Automatyczne generowanie zestawień "każdy z każdym" dla podanej listy kolorów.
- **Weryfikacja WCAG**: Raportowanie zgodności z normami 3:1 (grafiki/duży tekst), 4.5:1 (AA) oraz 7:1 (AAA).
- **Zaawansowane filtrowanie**:
  - Filtrowanie według minimalnego poziomu kontrastu.
  - **Filtry trójstanowe**: Możliwość wyboru (uwzględnienia) lub wykluczenia konkretnych kolorów osobno dla tła (wiersze) i tekstu (kolumny).
  - **Relacja jasności**: Filtrowanie par na zasadzie "tło ciemniejsze od tekstu" lub odwrotnie.
  - **Tryb unikalności**: Wyświetlanie pełnej macierzy lub tylko unikalnych par (półmacierz).
- **Eksport do Figmy**: Kopiowanie wygenerowanej macierzy jako gotowy plik SVG do wklejenia bezpośrednio w narzędziach projektowych.
- **Profesjonalny interfejs**: Neutralna skala szarości UI zapobiegająca przekłamaniom percepcji kolorów.

## Instrukcja obsługi

1. Wklej listę kolorów w formacie HEX (np. `#ffffff, #000000`) w polu tekstowym.
2. Użyj przycisków "+ PURE BLACK" lub "+ PURE WHITE", aby szybko dodać podstawowe kolory, jeśli ich brakuje.
3. Korzystaj z filtrów po prawej stronie, aby zawęzić wyniki.
4. Klikaj na próbki kolorów w sekcjach filtrów:
   - **Pierwsze kliknięcie (✅)**: Pokaż tylko ten kolor.
   - **Drugie kliknięcie (❌)**: Wyklucz ten kolor z widoku.
   - **Trzecie kliknięcie (⚪)**: Powrót do stanu neutralnego.
5. Użyj "Kopiuj SVG do Figmy", aby przenieść wyniki do swojego projektu.

## Wymagania

Narzędzie działa jako pojedynczy plik HTML. Wymaga połączenia z internetem do załadowania bibliotek Tailwind CSS i React (CDN).
