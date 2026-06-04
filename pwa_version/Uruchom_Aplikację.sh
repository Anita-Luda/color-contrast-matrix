#!/bin/bash

# Skrypt uruchamiający aplikację Color Matrix lokalnie (macOS / Linux)
PORT=8080
URL="http://localhost:$PORT"

# Przejdź do katalogu ze skryptem
cd "$(dirname "$0")"

echo "Uruchamianie lokalnego serwera na $URL..."

# Spróbuj użyć Pythona (najbardziej powszechny)
if command -v python3 >/dev/null 2>&1; then
    (sleep 1 && (open "$URL" || xdg-open "$URL" || sensible-browser "$URL")) &
    python3 -m http.server $PORT
elif command -v python >/dev/null 2>&1; then
    (sleep 1 && (open "$URL" || xdg-open "$URL" || sensible-browser "$URL")) &
    python -m SimpleHTTPServer $PORT
elif command -v npx >/dev/null 2>&1; then
    npx serve . -l $PORT
else
    echo "Błąd: Nie znaleziono Pythona ani npx. Zainstaluj Pythona, aby uruchomić aplikację lokalnie."
    read -p "Naciśnij Enter, aby zamknąć..."
fi
