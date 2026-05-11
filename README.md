# WCAG Matrix Professional v8.1

Zaawansowane narzędzie do analizy kontrastu kolorystycznego zgodnie ze standardami WCAG 2.1 oraz APCA. Zaprojektowane z myślą o profesjonalnych designerach potrzebujących precyzyjnego narzędzia o neutralnej estetyce.

## Kluczowe Funkcje

- **Dwa tryby obliczeń**: Standardowy WCAG 2.1 oraz nowoczesny APCA (Advanced Perceptual Contrast Algorithm).
- **Tryb Typografii**: Podgląd par kolorystycznych na konkretnych krojach pisma (Sans, Serif, Mono, Display) z możliwością ładowania fontów Google.
- **Filtrowanie Tri-state**: Możliwość włączania, wykluczania lub ignorowania konkretnych kolorów w macierzy (osobno dla wierszy i kolumn).
- **Analiza Wibracji**: Wykrywanie par kolorów o wysokim nasyceniu, które mogą powodować dyskomfort wizualny (chromostereopsis).
- **Relacje Jasności**: Filtrowanie par na podstawie tego, czy tło jest ciemniejsze od tekstu (lub odwrotnie).
- **Inteligentne Skalowanie**: Skalowanie 1:1 całego interfejsu macierzy (od 20% do 200%).
- **Eksport do Figmy**: Funkcja "Copy SVG" generuje kod gotowy do wklejenia bezpośrednio do Figmy z zachowaniem wszystkich stylów i warstw.
- **Sticky Headers**: Nagłówki wierszy i kolumn pozostają widoczne przy scrollowaniu. Dodatkowa opcja "Stick Rows to Screen" pozwala na przypięcie etykiet wierszy do krawędzi ekranu nawet przy wycentrowanej macierzy.

## Obsługa

1. **Wprowadzanie kolorów**: Wklej kody HEX oddzielone przecinkami lub spacjami w polu "HEX List".
2. **Dodawanie czystych kolorów**: Użyj przycisków "+ Black" i "+ White", aby szybko dodać czyste odcienie.
3. **Filtrowanie**: Użyj sliderów kontrastu, aby zawęzić wyniki. Klikaj próbki kolorów w sekcji filtrów (1 klik: tylko ten kolor, 2 kliki: wyklucz ten kolor, 3 kliki: reset).
4. **Typografia**: Włącz "Font Test Mode", aby zobaczyć kolory na żywym tekście. Możesz wybrać fonty z kategorii lub wpisać nazwę dowolnego Google Font.
5. **Eksport**: Użyj przycisku "Copy SVG" i wklej wynik (Ctrl+V) bezpośrednio w Figmie.

## Filozofia Projektowa (v8)

Interfejs został zaprojektowany w skali neutralnych szarości (`neutral` z Tailwind), aby zminimalizować wpływ otoczenia na percepcję kolorów (zjawisko kontrastu równoczesnego). Miękkie zaokrąglenia (2.5rem), wysoka czytelność typografii i przemyślany UX sprawiają, że narzędzie nadaje się do codziennej pracy w profesjonalnych studiach projektowych.
