import React, { useState, useMemo, useEffect, useCallback } from 'react';
import './App.css';
import './styles/variables.css';
import Sidebar from './components/Sidebar/Sidebar';
import MatrixGrid from './components/MatrixGrid/MatrixGrid';
import { useDraggable, useResizable } from './hooks/usePanel';
import {
  getContrastRatio,
  getVisualTensionScore,
  getHsl,
  luminance,
  hexToRgb,
  sortColors,
  getApcaContrast
} from './utils/color';

function App() {
  // --- State ---
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [visualStyle, setVisualStyle] = useState(() => localStorage.getItem('visualStyle') || 'cute');
  const [input, setInput] = useState(() => localStorage.getItem('colors') || "#000000, #ffffff, #2563eb, #db2777, #f59e0b, #10b981");
  const [minContrast, setMinContrast] = useState(0);
  const [maxContrast, setMaxContrast] = useState(Infinity);
  const [maxTension, setMaxTension] = useState(10);
  const [calcMode, setCalcMode] = useState('wcag');
  const [uniqueMode, setUniqueMode] = useState('all');
  const [darknessFilter, setDarknessFilter] = useState('all');
  const [hideEmpty, setHideEmpty] = useState(false);
  const [showBorder, setShowBorder] = useState(false);
  const [fontTestMode, setFontTestMode] = useState(false);
  const [gridScale, setGridScale] = useState(100);
  const [stickToScreen, setStickToScreen] = useState(false);
  const [cardBaseWidth, setCardBaseWidth] = useState(220);
  const [panelPos, setPanelPos] = useState(() => localStorage.getItem('panelPos') || 'right');
  const [search, setSearch] = useState('');

  const [rowFilters, setRowFilters] = useState({});
  const [colFilters, setColFilters] = useState({});
  const [rowSortBy, setRowSortBy] = useState('hue-lum');
  const [rowSortOrder, setRowSortOrder] = useState('asc');
  const [colSortBy, setColSortBy] = useState('hue-lum');
  const [colSortOrder, setColSortOrder] = useState('asc');

  const [font, setFont] = useState('Inter');
  const [headingFont, setHeadingFont] = useState('Inter');
  const [headingEnabled, setHeadingEnabled] = useState(false);
  const [headingText, setHeadingText] = useState('Nagłówek');
  const [headingSize, setHeadingSize] = useState(32);
  const [headingWeight, setHeadingWeight] = useState(700);
  const [testText, setTestText] = useState('Przykładowy Tekst');
  const [testFontSize, setTestFontSize] = useState(16);
  const [testFontWeight, setTestFontWeight] = useState(400);

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('visualStyle', visualStyle);
    document.documentElement.setAttribute('data-style', visualStyle);
  }, [visualStyle]);

  useEffect(() => {
    localStorage.setItem('panelPos', panelPos);
  }, [panelPos]);

  useEffect(() => {
    localStorage.setItem('colors', input);
  }, [input]);

  // --- Derived State ---
  const rawColors = useMemo(() => Array.from(new Set(input.match(/#[0-9A-Fa-f]{6}/g) || [])), [input]);
  const filteredColors = useMemo(() => rawColors.filter(c => c.toLowerCase().includes(search.toLowerCase())), [rawColors, search]);

  const sortedRowColors = useMemo(() => sortColors(rawColors, rowSortBy, rowSortOrder), [rawColors, rowSortBy, rowSortOrder]);
  const sortedColColors = useMemo(() => sortColors(rawColors, colSortBy, colSortOrder), [rawColors, colSortBy, colSortOrder]);

  const isHidden = useCallback((bg, fg) => {
    const r = getContrastRatio(bg, fg);
    const apca = getApcaContrast(fg, bg);
    const val = calcMode === 'apca' ? Math.abs(apca) : r;
    const t = getVisualTensionScore(bg, fg);

    if (val < minContrast || (maxContrast !== Infinity && val > maxContrast) || t > maxTension) return true;

    const bgI = sortedRowColors.indexOf(bg);
    const fgI = sortedColColors.indexOf(fg);

    if (uniqueMode === "bg" && bgI > fgI) return true;
    if (uniqueMode === "fg" && bgI < fgI) return true;

    const lB = luminance(hexToRgb(bg));
    const lF = luminance(hexToRgb(fg));
    if (darknessFilter === "bg-darker" && lB >= lF) return true;
    if (darknessFilter === "fg-darker" && lF >= lB) return true;

    if (rowFilters[bg] === -1 || colFilters[fg] === -1) return true;
    const hIR = Object.values(rowFilters).some(v => v === 1);
    const hIC = Object.values(colFilters).some(v => v === 1);
    if (hIR && rowFilters[bg] !== 1) return true;
    if (hIC && colFilters[fg] !== 1) return true;

    return false;
  }, [sortedRowColors, sortedColColors, minContrast, maxContrast, maxTension, uniqueMode, darknessFilter, rowFilters, colFilters]);

  const activeCols = useMemo(() => {
    if (!hideEmpty) return sortedColColors;
    return sortedColColors.filter(fg => sortedRowColors.some(bg => !isHidden(bg, fg)));
  }, [sortedColColors, sortedRowColors, hideEmpty, isHidden]);

  const activeRows = useMemo(() => {
    if (!hideEmpty) return sortedRowColors;
    return sortedRowColors.filter(bg => sortedColColors.some(fg => !isHidden(bg, fg)));
  }, [sortedRowColors, sortedColColors, hideEmpty, isHidden]);

  const resetAll = useCallback(() => {
    setMinContrast(0); setMaxContrast(Infinity); setMaxTension(10);
    setCalcMode('wcag'); setUniqueMode('all'); setDarknessFilter('all');
    setHideEmpty(false); setShowBorder(false); setRowFilters({}); setColFilters({});
    setSearch(''); setGridScale(100); setCardBaseWidth(220); setStickToScreen(false);
  }, []);

  const { pos: floatPos, onMouseDown: onDrag, setPos: setFloatPos } = useDraggable({ x: 100, y: 100 }, panelPos === 'floating');
  const { size: panelSize, startResizing, setSize: setPanelSize } = useResizable({ w: 380, h: 600 }, panelPos);

  const copySVG = useCallback(() => {
    const scale = gridScale / 100;
    const baseW = cardBaseWidth;
    const CARD_W = baseW; // Using base size, scaling is handled by SVG transform/viewport
    const CARD_H_BOT = 100;
    const CARD_H_TOP = fontTestMode ? CARD_W : (baseW * 1.6 - CARD_H_BOT);
    const totalCardH = CARD_H_TOP + CARD_H_BOT;

    const GAP = 16;
    const HEADER_W = 120;
    const HEADER_H = 60;
    const cols = activeCols, rows = activeRows;
    const rowTotalH = totalCardH + GAP;

    const actualW = (HEADER_W + cols.length * (CARD_W + GAP)) * scale;
    const actualH = (HEADER_H + rows.length * rowTotalH) * scale;
    const viewBoxW = HEADER_W + cols.length * (CARD_W + GAP);
    const viewBoxH = HEADER_H + rows.length * rowTotalH;

    let svg = `<svg width="${actualW}" height="${actualH}" viewBox="0 0 ${viewBoxW} ${viewBoxH}" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<rect width="100%" height="100%" fill="${theme === 'dark' ? '#171717' : '#fafafa'}" />`;

    // Corner & Headers
    cols.forEach((c, i) => {
      const x = HEADER_W + i * (CARD_W + GAP) + CARD_W / 2;
      svg += `<text x="${x}" y="40" font-family="monospace" font-size="14" font-weight="500" text-anchor="middle" fill="#737373">${c}</text>`;
    });
    rows.forEach((r, i) => {
      const y = HEADER_H + i * rowTotalH + rowTotalH / 2;
      svg += `<text x="${HEADER_W - 20}" y="${y}" font-family="monospace" font-size="14" font-weight="500" text-anchor="end" fill="#737373">${r}</text>`;
    });

    // Style properties
    const isCute = visualStyle === 'cute';
    const borderRadius = isCute ? (3 * 16) : 0;
    const borderWidth = isCute ? 0 : 1;
    const fontName = isCute ? 'Quicksand' : 'Inter';

    // Matrix
    rows.forEach((bg, rowI) => {
      cols.forEach((fg, colI) => {
        const x = HEADER_W + colI * (CARD_W + GAP), y = HEADER_H + rowI * rowTotalH + (GAP / 2);
        if (isHidden(bg, fg)) return;

        const ratio = getContrastRatio(bg, fg);
        const apca = getApcaContrast(fg, bg);
        const val = calcMode === 'apca' ? apca : ratio;
        const suffix = calcMode === 'apca' ? '' : ':1';

        const pass3 = calcMode === 'apca' ? Math.abs(apca) >= 30 : ratio >= 3;
        const pass45 = calcMode === 'apca' ? Math.abs(apca) >= 45 : ratio >= 4.5;
        const pass7 = calcMode === 'apca' ? Math.abs(apca) >= 75 : ratio >= 7;

        // Card Body
        const cardBg = theme === 'dark' ? '#262626' : '#ffffff';
        svg += `<rect x="${x}" y="${y}" width="${CARD_W}" height="${totalCardH}" rx="${borderRadius}" fill="${cardBg}" ${borderWidth > 0 ? `stroke="${fg}" stroke-width="${borderWidth}"` : ''} />`;

        // Color Section (Top)
        svg += `<clipPath id="clip-${rowI}-${colI}"><rect x="${x}" y="${y}" width="${CARD_W}" height="${totalCardH}" rx="${borderRadius}"/></clipPath>`;
        svg += `<g clip-path="url(#clip-${rowI}-${colI})">`;
        svg += `<rect x="${x}" y="${y}" width="${CARD_W}" height="${CARD_H_TOP}" fill="${bg}" />`;

        if (isCute) {
           svg += `<circle cx="${x + 10}" cy="${y + 10}" r="4" fill="${fg}" opacity="0.4" />`;
           svg += `<circle cx="${x + CARD_W - 10}" cy="${y + 10}" r="3" fill="${fg}" opacity="0.3" />`;
           svg += `<circle cx="${x + 10}" cy="${y + CARD_H_TOP - 10}" r="3" fill="${fg}" opacity="0.3" />`;
           svg += `<circle cx="${x + CARD_W - 10}" cy="${y + CARD_H_TOP - 10}" r="4" fill="${fg}" opacity="0.4" />`;
        }

        if (fontTestMode) {
            const padding = 20;
            let currentY = y + (CARD_H_TOP / 2);
            if (headingEnabled) {
                const hFont = headingFont.replace(/'/g, "").split(',')[0];
                svg += `<text x="${x + padding}" y="${currentY}" font-family="${hFont}, ${fontName}, sans-serif" font-size="${headingSize}" font-weight="${headingWeight}" fill="${fg}">${headingText || "Heading"}</text>`;
                currentY += headingSize * 1.2;
            }
            const pFont = font.replace(/'/g, "").split(',')[0];
            svg += `<text x="${x + padding}" y="${currentY}" font-family="${pFont}, ${fontName}, sans-serif" font-size="${testFontSize}" font-weight="${testFontWeight}" fill="${fg}">${testText || "Sample"}</text>`;
        } else {
            svg += `<text x="${x + 20}" y="${y + 22 + 32}" font-family="${fontName}, sans-serif" font-size="32" font-weight="${isCute ? 700 : 400}" fill="${fg}">${val}${suffix}</text>`;

            const passLabelsY = y + 75;
            svg += `<text x="${x + 20}" y="${passLabelsY + 14}" font-family="${fontName}, sans-serif" font-size="14" fill="${fg}">${pass3 ? (isCute ? '✨' : '✅') : '❌'} ${calcMode === 'apca' ? 'Lc 30' : '3:1'}</text>`;
            svg += `<text x="${x + 20}" y="${passLabelsY + 32}" font-family="${fontName}, sans-serif" font-size="14" fill="${fg}">${pass45 ? (isCute ? '🌸' : '✅') : '❌'} ${calcMode === 'apca' ? 'Lc 45' : '4.5:1'}</text>`;
            svg += `<text x="${x + 20}" y="${passLabelsY + 50}" font-family="${fontName}, sans-serif" font-size="14" fill="${fg}">${pass7 ? (isCute ? '👑' : '✅') : '❌'} ${calcMode === 'apca' ? 'Lc 75' : '7:1'}</text>`;
        }

        // Bottom Section
        const textCol = theme === 'dark' ? '#fafafa' : '#171717';
        const bY = y + CARD_H_TOP + 20;
        svg += `<text x="${x + 20}" y="${bY + 12}" font-family="monospace" font-size="12" fill="${textCol}">${bg} ⇆ ${fg}</text>`;
        svg += `<text x="${x + CARD_W - 20}" y="${bY + 12}" font-family="${fontName}, sans-serif" font-size="12" font-weight="700" text-anchor="end" fill="${textCol}">${val}${suffix}</text>`;

        const statusY = bY + 12 + 20;
        svg += `<text x="${x + 20}" y="${statusY + 12}" font-family="${fontName}, sans-serif" font-size="11" fill="${textCol}">${pass3 ? (isCute ? '✨' : '✅') : '❌'} Icons</text>`;
        svg += `<text x="${x + CARD_W/2}" y="${statusY + 12}" font-family="${fontName}, sans-serif" font-size="11" text-anchor="middle" fill="${textCol}">${pass45 ? (isCute ? '🌸' : '✅') : '❌'} AA</text>`;
        svg += `<text x="${x + CARD_W - 20}" y="${statusY + 12}" font-family="${fontName}, sans-serif" font-size="11" text-anchor="end" fill="${textCol}">${pass7 ? (isCute ? '👑' : '✅') : '❌'} AAA</text>`;

        svg += `</g>`;
      });
    });

    svg += `</svg>`;
    navigator.clipboard.writeText(svg).then(() => alert('SVG Exported to clipboard!'));
  }, [activeCols, activeRows, gridScale, cardBaseWidth, fontTestMode, theme, visualStyle, isHidden, calcMode, headingEnabled, headingFont, headingSize, headingWeight, font, testFontSize, testFontWeight, testText]);

  return (
    <div className={`app-layout theme-${theme} theme-${panelPos}`}>
      <main className="content-area">
        <MatrixGrid
          activeRows={activeRows}
          activeCols={activeCols}
          isHidden={isHidden}
          calcMode={calcMode}
          font={font}
          headingFont={headingFont}
          maxTension={maxTension}
          showBorder={showBorder}
          fontTestMode={fontTestMode}
          testText={testText}
          testFontSize={testFontSize}
          testFontWeight={testFontWeight}
          headingEnabled={headingEnabled}
          headingText={headingText}
          headingSize={headingSize}
          headingWeight={headingWeight}
          gridScale={gridScale}
          cardBaseWidth={cardBaseWidth}
          stickToScreen={stickToScreen}
          visualStyle={visualStyle}
        />
      </main>

      <Sidebar
        input={input} setInput={setInput}
        floatPos={floatPos} onDrag={onDrag}
        panelSize={panelSize} startResizing={startResizing}
        minContrast={minContrast} setMinContrast={setMinContrast}
        maxContrast={maxContrast} setMaxContrast={setMaxContrast}
        maxTension={maxTension} setMaxTension={setMaxTension}
        calcMode={calcMode} setCalcMode={setCalcMode}
        uniqueMode={uniqueMode} setUniqueMode={setUniqueMode}
        darknessFilter={darknessFilter} setDarknessFilter={setDarknessFilter}
        hideEmpty={hideEmpty} setHideEmpty={setHideEmpty}
        showBorder={showBorder} setShowBorder={setShowBorder}
        fontTestMode={fontTestMode} setFontTestMode={setFontTestMode}
        gridScale={gridScale} setGridScale={setGridScale}
        stickToScreen={stickToScreen} setStickToScreen={setStickToScreen}
        cardBaseWidth={cardBaseWidth} setCardBaseWidth={setCardBaseWidth}
        search={search} setSearch={setSearch}
        filteredColors={filteredColors}
        rowFilters={rowFilters} setRowFilters={setRowFilters}
        colFilters={colFilters} setColFilters={setColFilters}
        rowSortBy={rowSortBy} setRowSortBy={setRowSortBy}
        rowSortOrder={rowSortOrder} setRowSortOrder={setRowSortOrder}
        colSortBy={colSortBy} setColSortBy={setColSortBy}
        colSortOrder={colSortOrder} setColSortOrder={setColSortOrder}
        font={font} setFont={setFont}
        headingFont={headingFont} setHeadingFont={setHeadingFont}
        headingEnabled={headingEnabled} setHeadingEnabled={setHeadingEnabled}
        headingText={headingText} setHeadingText={setHeadingText}
        headingSize={headingSize} setHeadingSize={setHeadingSize}
        headingWeight={headingWeight} setHeadingWeight={setHeadingWeight}
        testText={testText} setTestText={setTestText}
        testFontSize={testFontSize} setTestFontSize={setTestFontSize}
        testFontWeight={testFontWeight} setTestFontWeight={setTestFontWeight}
        resetAll={resetAll}
        copySVG={copySVG}
        panelPos={panelPos} setPanelPos={setPanelPos}
        theme={theme} setTheme={setTheme}
        visualStyle={visualStyle} setVisualStyle={setVisualStyle}
      />
    </div>
  );
}

export default App;
