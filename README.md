# WCAG Matrix Pro & Cute SPA (v8.3)

Zaawansowana aplikacja SPA do analizy kontrastu, oferująca dwa unikalne style wizualne przy zachowaniu pełnej neutralności kolorystycznej (skala szarości).

## Style Wizualne

### 1. Professional (Profesjonalny)
- **Estetyka**: Minimalistyczna, surowa, z ostrymi narożnikami.
- **Typografia**: Font 'Inter' w lekkich odmianach.
- **Interfejs**: Bardzo dyskretny, skupiony na danych.
- **Eksport**: Czyste, techniczne pliki SVG gotowe do dokumentacji systemów projektowych.

### 2. Cute Kawaii (Uroczy)
- **Estetyka**: Miękka, z bardzo dużymi zaokrągleniami (radius-card: 3rem).
- **Typografia**: Font 'Quicksand' o przyjaznym charakterze.
- **Dekoracje**: Subtelne "sparkles" i urocze ikony statusu (✨, 🌸, 👑) w skali szarości.
- **Eksport**: Przyjazne wizualnie SVG zachowujące "miękki" charakter interfejsu.

## Nowości w v8.3
- **Przełącznik Stylów**: Możliwość błyskawicznej zmiany charakteru narzędzia bez utraty danych.
- **Dark Mode dla obu stylów**: Pełna obsługa motywu ciemnego, niezależnie od wybranej estetyki.
- **SVG Engine v2**: Silnik generujący SVG odzwierciedla teraz wybrany styl wizualny.
- **Vanilla CSS Tokens**: Całe stylowanie oparte na dynamicznych tokenach CSS, co zapewnia wysoką wydajność i łatwość modyfikacji.

## Architektura
Projekt zbudowany w oparciu o **React 18** i **Vite**. Logika biznesowa jest odizolowana od warstwy prezentacji, co pozwala na bezpieczne wprowadzanie zmian wizualnych przy użyciu atrybutów `data-style` i `data-theme`.
