# WCAG Matrix Professional

Zaawansowane, minimalistyczne narzędzie do analizy kontrastu kolorystycznego oraz napięcia wizualnego (visual tension) w interfejsach użytkownika.

## Główne Funkcje

- **Macierz Kontrastu:** Generuje pełne zestawienie par kolorów tło/tekst.
- **Detekcja Napięcia Wizualnego (Vibration):** Oznacza pary kolorów (⚠️), które mimo zachowania norm WCAG, mogą "wibrować" lub męczyć wzrok (np. wysokie nasycenie przy zbliżonej jasności).
- **Filtrowanie Dynamiczne:**
  - Suwaki dla kontrastu minimalnego i maksymalnego.
  - Trójstanowe filtry kolorów (Włącz/Wyklucz/Neutralny) dla wierszy i kolumn.
  - Filtry relacji jasności (np. tylko tła ciemniejsze od tekstu).
  - Tryby unikalności (półmacierze).
- **Eksport do Figmy:** Możliwość skopiowania wygenerowanej macierzy jako SVG bezpośrednio do schowka.
- **Interfejs "Elf Vibe":** Lekka, minimalistyczna stylistyka oparta na skali szarości, aby nie zakłócać percepcji badanych kolorów.

## Jak używać

1. Wprowadź listę kolorów w formacie HEX (oddzielone przecinkami lub spacjami).
2. Użyj przycisków szybkich akcji (+ Black / + White), aby dodać bazowe kolory.
3. Dostosuj progi kontrastu za pomocą suwaków lub klikając w konkretne wartości (3, 4.5, 7).
4. Klikaj w próbki kolorów w sekcjach "Tło" i "Tekst", aby filtrować widok.
5. Kliknij "Copy SVG", aby przenieść wyniki do narzędzia projektowego.

## Technologia

- React (v18)
- Tailwind CSS
- Algorytm Luminancji Względnej (WCAG 2.1)
- Detekcja napięcia wizualnego oparta na analizie HSL (Hue, Saturation, Lightness).
