# WCAG Color Contrast Matrix Professional v3

Profesjonalne narzędzie do analizy kontrastu kolorów w standardach WCAG 2.1 oraz APCA. Umożliwia masowe sprawdzanie dostępności całych palet kolorystycznych w czytelnej formie macierzy.

## Główne Funkcje

- **Macierz Kontrastu**: Generuje zestawienie wszystkich kombinacji kolorów z listy wejściowej.
- **Tryby Obliczeń**: Wspiera standardowy WCAG 2.1 (ratio) oraz nowoczesny algorytm APCA (Lc).
- **Zaawansowane Filtrowanie**:
  - Filtrowanie trójstanowe dla wierszy i kolumn (Włącz / Wyklucz / Neutralny).
  - Filtry jasności (Luminance) osobno dla tła i tekstu.
  - Szybkie przełączniki: "Tło ciemniejsze od tekstu" i odwrotnie.
  - Ukrywanie pustych wierszy/kolumn.
- **Tryb Testu Typografii**: Podgląd tekstów (nagłówki H1, paragrafy) bezpośrednio na kartach kolorów z możliwością zmiany fontów, rozmiarów i wag.
- **Eksport do SVG**: Generowanie wysokiej jakości grafiki wektorowej z zachowaniem wszystkich ustawień podglądu.
- **Analiza Napięcia Wizualnego (Vibration)**: Ostrzeżenia przed kombinacjami kolorów, które mogą powodować męczliwość wzroku.

## Jak używać

1. Wprowadź listę kodów HEX w polu "Colors Input". Możesz szybko dodać czysty czarny (#000000) i biały (#ffffff) przyciskami pomocniczymi.
2. Dostosuj progi kontrastu w sekcji "Thresholds", aby odfiltrować kombinacje niespełniające Twoich wymagań.
3. Skorzystaj z filtrów trójstanowych przy próbkach kolorów, aby skupić się na konkretnych barwach.
4. Włącz "Font Test Mode", aby sprawdzić jak kolory zachowują się przy różnych wielkościach pisma.
5. Użyj przycisku "Copy SVG", aby skopiować gotową grafikę do schowka (idealne do Figmy lub Adobe XD).

## Architektura

Narzędzie jest zbudowane jako jednostronicowa aplikacja (SPA) oparta na:
- React (UI logic)
- Tailwind CSS (stylizacja)
- Babel (kompilacja in-browser)

Całość zawarta jest w jednym pliku HTML, co ułatwia przenoszenie i korzystanie offline.
