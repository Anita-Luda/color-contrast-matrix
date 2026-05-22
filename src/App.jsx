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
  const [visualStyle, setVisualStyle] = useState(() => localStorage.getItem('visualStyle') || 'professional');
  const [input, setInput] = useState(() => localStorage.getItem('colors') || "#000000, #ffffff, #2563eb, #db2777, #f59e0b, #10b981");
  const [minContrast, setMinContrast] = useState(0);
  const [maxContrast, setMaxContrast] = useState(Infinity);
  const [maxTension, setMaxTension] = useState(10);
  const [calcMode, setCalcMode] = useState('wcag');
  const [uniqueMode, setUniqueMode] = useState('all');
  const [darknessFilter, setDarknessFilter] = useState('all');
  const [hideEmpty, setHideEmpty] = useState(false);
  const [colorBlindness, setColorBlindness] = useState('none');
  const [showBorder, setShowBorder] = useState(() => visualStyle === 'professional');

  // When visualStyle changes, we update the border default
  useEffect(() => {
    setShowBorder(visualStyle === 'professional');
  }, [visualStyle]);
  const [fontTestMode, setFontTestMode] = useState(false);
  const [gridScale, setGridScale] = useState(100);
  const [cardBaseWidth, setCardBaseWidth] = useState(220);
  const [panelPos, setPanelPos] = useState(() => localStorage.getItem('panelPos') || 'right');

  // Handle panel size reset on position change
  useEffect(() => {
    if (panelPos === 'top' || panelPos === 'bottom') {
        setPanelSize({ w: window.innerWidth, h: 180 });
    } else if (panelPos === 'floating') {
        setPanelSize({ w: 400, h: 500 });
    } else {
        setPanelSize({ w: 340, h: window.innerHeight });
    }
  }, [panelPos]);
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
  const rawColors = useMemo(() => {
    const hexMatch = input.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/g) || [];
    const rgbMatch = input.match(/rgba?\([^)]+\)/gi) || [];
    const hslMatch = input.match(/hsla?\([^)]+\)/gi) || [];
    const all = [...hexMatch, ...rgbMatch, ...hslMatch].map(c => c.toLowerCase());
    return Array.from(new Set(all));
  }, [input]);
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
    setSearch(''); setGridScale(100); setCardBaseWidth(220);
  }, []);

  const { pos: floatPos, onMouseDown: onDrag, setPos: setFloatPos } = useDraggable({ x: 100, y: 100 }, panelPos === 'floating');
  const { size: panelSize, startResizing, setSize: setPanelSize } = useResizable(
    panelPos === 'top' || panelPos === 'bottom' ? { w: 100, h: 180 } : { w: 380, h: 600 },
    panelPos,
    setFloatPos
  );

  const copyShareLink = useCallback(() => {
    const params = new URLSearchParams();
    params.set('colors', input);
    params.set('mode', calcMode);
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(url).then(() => alert('Share link copied to clipboard!'));
  }, [input, calcMode]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const colors = params.get('colors');
    const mode = params.get('mode');
    if (colors) setInput(colors);
    if (mode) setCalcMode(mode);
  }, []);

  const copySVG = useCallback(() => {
    const scale = gridScale / 100;
    const baseW = cardBaseWidth;
    const CARD_W = baseW;
    const CARD_H = 310;
    const CARD_H_BOT = 90;
    const CARD_H_TOP = CARD_H - CARD_H_BOT;

    const GAP = 16;
    const HEADER_W = 150;
    const HEADER_H = 80;
    const cols = activeCols, rows = activeRows;
    const rowTotalH = CARD_H + GAP;

    const actualW = (HEADER_W + cols.length * (CARD_W + GAP)) * scale;
    const actualH = (HEADER_H + rows.length * rowTotalH) * scale;
    const viewBoxW = HEADER_W + cols.length * (CARD_W + GAP);
    const viewBoxH = HEADER_H + rows.length * rowTotalH;

    const isCute = visualStyle === 'cute';
    const borderRadius = isCute ? 40 : 0;
    const fontName = isCute ? 'Quicksand' : 'Inter';
    const fwBold = isCute ? 700 : 500;

    let svg = `<svg width="${actualW}" height="${actualH}" viewBox="0 0 ${viewBoxW} ${viewBoxH}" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<rect width="100%" height="100%" fill="${theme === 'dark' ? '#171717' : '#fafafa'}" />`;

    // Headers
    cols.forEach((c, i) => {
      const x = HEADER_W + i * (CARD_W + GAP) + CARD_W / 2;
      svg += `<text x="${x}" y="50" font-family="monospace" font-size="14" font-weight="700" text-anchor="middle" fill="#737373">${c}</text>`;
    });
    rows.forEach((r, i) => {
      const y = HEADER_H + i * rowTotalH + rowTotalH / 2;
      svg += `<text x="${HEADER_W - 20}" y="${y}" font-family="monospace" font-size="14" font-weight="700" text-anchor="end" fill="#737373">${r}</text>`;
    });

    const checkPath = "M20 6 L9 17 L4 12";
    const xPath = "M18 6 L6 18 M6 6 L18 18";

    const succCol = "#22c55e", errCol = "#ef4444";
    const drawIcon = (x, y, pass) => {
      // Scale down by 0.6 to match the UI visual size (around 12-14px)
      // and adjust stroke-width to look consistent
      return `<g transform="translate(${x}, ${y + 2}) scale(0.55)">
        <path d="${pass ? checkPath : xPath}" fill="none" stroke="${pass ? succCol : errCol}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      </g>`;
    };

    // Matrix
    rows.forEach((bg, rowI) => {
      cols.forEach((fg, colI) => {
        const x = HEADER_W + colI * (CARD_W + GAP), y = HEADER_H + rowI * rowTotalH + (GAP / 2);
        if (isHidden(bg, fg)) return;

        const ratio = getContrastRatio(bg, fg);
        const apca = getApcaContrast(fg, bg);
        const val = calcMode === 'apca' ? apca : ratio;
        const suffix = calcMode === 'apca' ? '' : ':1';

        const isPass13 = calcMode === 'apca' ? Math.abs(apca) >= 15 : ratio >= 1.3;
        const isPass18 = calcMode === 'apca' ? Math.abs(apca) >= 30 : ratio >= 1.8;
        const isPass2 = calcMode === 'apca' ? Math.abs(apca) >= 45 : ratio >= 2;
        const isPass3 = calcMode === 'apca' ? Math.abs(apca) >= 60 : ratio >= 3;
        const isPass45 = calcMode === 'apca' ? Math.abs(apca) >= 75 : ratio >= 4.5;
        const isPass7 = calcMode === 'apca' ? Math.abs(apca) >= 90 : ratio >= 7;

        // Card Body
        const cardBg = theme === 'dark' ? '#262626' : '#ffffff';
        const shadow = isCute ? "filter=\"drop-shadow(0 10px 20px rgba(0,0,0,0.05))\"" : "";
        svg += `<rect x="${x}" y="${y}" width="${CARD_W}" height="${CARD_H}" rx="${borderRadius}" fill="${cardBg}" ${shadow} />`;

        // Clip path for rounded corners
        svg += `<clipPath id="clip-${rowI}-${colI}"><rect x="${x}" y="${y}" width="${CARD_W}" height="${CARD_H}" rx="${borderRadius}"/></clipPath>`;
        svg += `<g clip-path="url(#clip-${rowI}-${colI})">`;

        // Color Section (Top)
        svg += `<rect x="${x}" y="${y}" width="${CARD_W}" height="${CARD_H_TOP}" fill="${bg}" />`;

        if (showBorder) {
            svg += `<rect x="${x+1.5}" y="${y+1.5}" width="${CARD_W-3}" height="${CARD_H-3}" rx="${borderRadius}" fill="none" stroke="${fg}" stroke-width="3" />`;
        }

        if (fontTestMode) {
            const padding = 24;
            let currentY = y + (CARD_H_TOP / 2) - 10;
            if (headingEnabled) {
                const hFont = headingFont.replace(/'/g, "").split(',')[0];
                svg += `<text x="${x + padding}" y="${currentY}" font-family="${hFont}, ${fontName}, sans-serif" font-size="${headingSize}" font-weight="${headingWeight}" fill="${fg}">${headingText || "Heading"}</text>`;
                currentY += headingSize * 1.2;
            }
            const pFont = font.replace(/'/g, "").split(',')[0];
            svg += `<text x="${x + padding}" y="${currentY}" font-family="${pFont}, ${fontName}, sans-serif" font-size="${testFontSize}" font-weight="${testFontWeight}" fill="${fg}">${testText || "Sample"}</text>`;
        } else {
            const padding = 24;
            svg += `<text x="${x + padding}" y="${y + padding + 32}" font-family="${fontName}, sans-serif" font-size="32" font-weight="${isCute ? 600 : 300}" fill="${fg}">${val}${suffix}</text>`;

            const indicatorsY = y + padding + 32 + 24;

            // Col 1
            svg += drawIcon(x + padding, indicatorsY, isPass3);
            svg += `<text x="${x + padding + 22}" y="${indicatorsY + 11}" font-family="${fontName}, sans-serif" font-size="14" font-weight="${fwBold}" fill="${fg}">${calcMode === 'apca' ? 'Lc 60' : '3:1'}</text>`;

            svg += drawIcon(x + padding, indicatorsY + 22, isPass45);
            svg += `<text x="${x + padding + 22}" y="${indicatorsY + 22 + 11}" font-family="${fontName}, sans-serif" font-size="14" font-weight="${fwBold}" fill="${fg}">${calcMode === 'apca' ? 'Lc 75' : '4.5:1'}</text>`;

            svg += drawIcon(x + padding, indicatorsY + 44, isPass7);
            svg += `<text x="${x + padding + 22}" y="${indicatorsY + 44 + 11}" font-family="${fontName}, sans-serif" font-size="14" font-weight="${fwBold}" fill="${fg}">${calcMode === 'apca' ? 'Lc 90' : '7:1'}</text>`;

            // Col 2
            const col2X = x + padding + 100;
            svg += `<g opacity="0.75">`;
            svg += drawIcon(col2X, indicatorsY, isPass13);
            svg += `<text x="${col2X + 22}" y="${indicatorsY + 11}" font-family="${fontName}, sans-serif" font-size="14" font-weight="${fwBold}" fill="${fg}">${calcMode === 'apca' ? 'Lc 15' : '1.3:1'}</text>`;

            svg += drawIcon(col2X, indicatorsY + 22, isPass18);
            svg += `<text x="${col2X + 22}" y="${indicatorsY + 22 + 11}" font-family="${fontName}, sans-serif" font-size="14" font-weight="${fwBold}" fill="${fg}">${calcMode === 'apca' ? 'Lc 30' : '1.8:1'}</text>`;

            svg += drawIcon(col2X, indicatorsY + 44, isPass2);
            svg += `<text x="${col2X + 22}" y="${indicatorsY + 44 + 11}" font-family="${fontName}, sans-serif" font-size="14" font-weight="${fwBold}" fill="${fg}">${calcMode === 'apca' ? 'Lc 45' : '2:1'}</text>`;
            svg += `</g>`;

            // HEX labels
            const hexY = y + CARD_H_TOP - 24;
            svg += `<text x="${x + padding}" y="${hexY - 14}" font-family="${fontName}, sans-serif" font-size="10" opacity="0.8" fill="${fg}"><tspan font-weight="700">BG</tspan>  ${bg.toUpperCase()}</text>`;
            svg += `<text x="${x + padding}" y="${hexY}" font-family="${fontName}, sans-serif" font-size="10" opacity="0.8" fill="${fg}"><tspan font-weight="700">FG</tspan>  ${fg.toUpperCase()}</text>`;
        }

        // Bottom Section
        let botBg = theme === 'dark' ? (isCute ? '#2d2d30' : '#1e1e1e') : (isCute ? '#ffffff' : '#fafafa');
        let textCol = theme === 'dark' ? '#f0f0f5' : '#171717';
        const bY = y + CARD_H_TOP;

        svg += `<rect x="${x}" y="${bY}" width="${CARD_W}" height="${CARD_H_BOT}" fill="${botBg}" />`;
        if (!isCute) {
            svg += `<line x1="${x}" y1="${bY}" x2="${x + CARD_W}" y2="${bY}" stroke="${theme === 'dark' ? '#404040' : '#e5e5e5'}" stroke-width="1" />`;
        }

        const bPaddingX = 24;
        const bPaddingY = 16;

        svg += `<text x="${x + bPaddingX}" y="${bY + bPaddingY + 12}" font-family="${fontName}, sans-serif" font-size="11" font-weight="700" fill="${textCol}">${bg.toUpperCase()} ⇆ ${fg.toUpperCase()}</text>`;
        svg += `<text x="${x + CARD_W - bPaddingX}" y="${bY + bPaddingY + 12}" font-family="${fontName}, sans-serif" font-size="11" font-weight="800" text-anchor="end" fill="${textCol}">${val}${suffix}</text>`;

        const sepY = bY + bPaddingY + 28;
        svg += `<line x1="${x + bPaddingX}" y1="${sepY}" x2="${x + CARD_W - bPaddingX}" y2="${sepY}" stroke="${theme === 'dark' ? '#404040' : '#f5f5f5'}" stroke-width="1" />`;

        const statusY = sepY + 20;

        // Icons
        svg += drawIcon(x + bPaddingX, statusY - 10, isPass3);
        svg += `<text x="${x + bPaddingX + 18}" y="${statusY}" font-family="${fontName}, sans-serif" font-size="11" font-weight="${fwBold}" opacity="0.8" fill="${textCol}">ICONS</text>`;

        // AA
        const aaX = x + CARD_W / 2 - 10;
        svg += drawIcon(aaX, statusY - 10, isPass45);
        svg += `<text x="${aaX + 18}" y="${statusY}" font-family="${fontName}, sans-serif" font-size="11" font-weight="${fwBold}" opacity="0.8" fill="${textCol}">AA</text>`;

        // AAA
        const aaaX = x + CARD_W - bPaddingX - 45;
        svg += drawIcon(aaaX, statusY - 10, isPass7);
        svg += `<text x="${aaaX + 18}" y="${statusY}" font-family="${fontName}, sans-serif" font-size="11" font-weight="${fwBold}" opacity="0.8" fill="${textCol}">AAA</text>`;

        svg += `</g>`;
      });
    });

    svg += `</svg>`;
    navigator.clipboard.writeText(svg).then(() => alert('SVG Exported to clipboard!'));
  }, [activeCols, activeRows, gridScale, cardBaseWidth, fontTestMode, theme, visualStyle, isHidden, calcMode, headingEnabled, headingFont, headingSize, headingWeight, font, testFontSize, testFontWeight, testText, showBorder]);

  return (
    <div className={`app-layout theme-${theme} theme-${panelPos}`}>
      <svg style={{ display: 'none' }}>
        <filter id="protanopia">
          <feColorMatrix
            type="matrix"
            values="0.567, 0.433, 0, 0, 0
                    0.558, 0.442, 0, 0, 0
                    0, 0.242, 0.758, 0, 0
                    0, 0, 0, 1, 0"
          />
        </filter>
        <filter id="deuteranopia">
          <feColorMatrix
            type="matrix"
            values="0.625, 0.375, 0, 0, 0
                    0.7, 0.3, 0, 0, 0
                    0, 0.3, 0.7, 0, 0
                    0, 0, 0, 1, 0"
          />
        </filter>
        <filter id="tritanopia">
          <feColorMatrix
            type="matrix"
            values="0.95, 0.05, 0, 0, 0
                    0, 0.433, 0.567, 0, 0
                    0, 0.475, 0.525, 0, 0
                    0, 0, 0, 1, 0"
          />
        </filter>
        <filter id="achromatopsia">
          <feColorMatrix
            type="matrix"
            values="0.299, 0.587, 0.114, 0, 0
                    0.299, 0.587, 0.114, 0, 0
                    0.299, 0.587, 0.114, 0, 0
                    0, 0, 0, 1, 0"
          />
        </filter>
      </svg>
      <main className="content-area" style={{ filter: colorBlindness !== 'none' ? `url(#${colorBlindness})` : 'none' }}>
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
          visualStyle={visualStyle}
        />
      </main>

      <Sidebar
        input={input} setInput={setInput}
        colorBlindness={colorBlindness} setColorBlindness={setColorBlindness}
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
        copyShareLink={copyShareLink}
        panelPos={panelPos} setPanelPos={setPanelPos}
        theme={theme} setTheme={setTheme}
        visualStyle={visualStyle} setVisualStyle={setVisualStyle}
      />
    </div>
  );
}

export default App;
