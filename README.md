# WCAG & APCA Color Matrix Professional

Zaawansowane narzędzie do analizy kontrastu kolorów zgodnie ze standardami WCAG 2.1 oraz APCA (WCAG 3.0). Zaprojektowane dla profesjonalnych designerów i deweloperów dbających o dostępność cyfrową.

## Główne Funkcje

- **Dwa tryby obliczeń:**
    - **WCAG 2.1:** Standardowy współczynnik (np. 4.5:1).
    - **APCA (WCAG 3.0):** Nowoczesny algorytm uwzględniający percepcję ludzkiego oka i kontekst (wielkość fontu).
- **Analiza napięcia wizualnego (Vibration/Tension):** Wykrywa pary kolorów, które "wibrują" i męczą wzrok, nawet jeśli spełniają normy kontrastu.
- **Dwa style wizualne:**
    - **Professional:** Maksymalna gęstość informacji, czysty i surowy interfejs.
    - **Cute Kawaii:** Przyjazny, zaokrąglony interfejs z efektami wizualnymi (sparkles).
- **Zaawansowane filtrowanie:**
    - Tri-state filtry dla wierszy i kolumn (Uwzględnij / Wyklucz / Neutralny).
    - Filtrowanie po relacji jasności (np. tylko Ciemne Tło / Jasny Tekst).
    - Suwaki progowe dla kontrastu i napięcia.
- **Typography Tester:** Możliwość testowania konkretnych rodzin fontów (Heading & Body) bezpośrednio na próbkach kolorów.
- **Export do Figmy:** Kopiowanie całej matrycy jako wysokiej jakości plik SVG, gotowy do wklejenia w narzędziach projektowych.
- **Docking System:** Panel ustawień można przypiąć do dowolnej krawędzi ekranu lub używać jako pływającego okna.

## Szybki Start

1. Wklej listę kolorów HEX w polu "Colors Input".
2. Skorzystaj z przycisków "+ Black" / "+ White", aby szybko dopełnić paletę.
3. Użyj suwaków "Thresholds", aby odsiać pary o zbyt niskim kontraście.
4. Przełączaj tryby wizualne w nagłówku panelu (ikona teczki / gwiazdek).

## Wymagania Techniczne

- Node.js 18+
- Przeglądarka wspierająca nowoczesne CSS (Flexbox, Grid, Variables).

## Instalacja i Uruchomienie

```bash
npm install
npm run dev
```
