import React, { useState, useMemo, useEffect, useCallback } from 'react';
import './App.css';
import './styles/variables.css';
import Sidebar from './components/Sidebar/Sidebar';
import MatrixGrid from './components/MatrixGrid/MatrixGrid';
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
  const [panelPos, setPanelPos] = useState('right');
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
    localStorage.setItem('colors', input);
  }, [input]);

  // --- Derived State ---
  const rawColors = useMemo(() => Array.from(new Set(input.match(/#[0-9A-Fa-f]{6}/g) || [])), [input]);
  const filteredColors = useMemo(() => rawColors.filter(c => c.toLowerCase().includes(search.toLowerCase())), [rawColors, search]);

  const sortedRowColors = useMemo(() => sortColors(rawColors, rowSortBy, rowSortOrder), [rawColors, rowSortBy, rowSortOrder]);
  const sortedColColors = useMemo(() => sortColors(rawColors, colSortBy, colSortOrder), [rawColors, colSortBy, colSortOrder]);

  const isHidden = useCallback((bg, fg) => {
    const r = getContrastRatio(bg, fg);
    const t = getVisualTensionScore(bg, fg);

    if (r < minContrast || (maxContrast !== Infinity && r > maxContrast) || t > maxTension) return true;

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
    setSearch(''); setGridScale(100);
  }, []);

  const copySVG = useCallback(() => {
    // legacy export
    alert('SVG Export functionality to be updated for SPA architecture');
  }, []);

  return (
    <div className={`app-layout theme-${theme}`}>
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
        />
      </main>

      <Sidebar
        input={input} setInput={setInput}
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
      />
    </div>
  );
}

export default App;
