# WCAG Matrix Professional SPA v8.2

Nowoczesna aplikacja jednostronicowa (SPA) zbudowana w React, służąca do zaawansowanej analizy kontrastu kolorystycznego.

## Architektura
- **Framework**: React 18 + Vite
- **Stylizacja**: Vanilla CSS z wykorzystaniem Design Tokens (zmienne CSS)
- **Persystencja**: localStorage dla kolorów i ustawień
- **Optymalizacja**: Memoizacja komponentów i obliczeń dla płynnego działania dużych macierzy

## Główne Funkcje
- **Design Tokens**: Pełna tokenizacja stylów umożliwiająca łatwe dostosowanie UI.
- **Dark Mode**: Wbudowany tryb ciemny przełączany jednym przyciskiem.
- **Modułowość**: Każdy komponent (Sidebar, Matrix, Card) jest odizolowany i posiada własne style.
- **Filtrowanie Tri-state**: Zaawansowane zarządzanie widocznością kolorów.
- **Tryb Typograficzny**: Testowanie par kolorystycznych na realnych krojach pisma.

## Rozwój
Aplikacja została przepisana z monolitycznego pliku HTML na nowoczesną strukturę projektową, co pozwala na łatwą rozbudowę o nowe funkcje, takie jak symulator ślepoty barw czy integrację z zewnętrznymi API.
