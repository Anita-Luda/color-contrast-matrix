import React, { useCallback, useMemo } from 'react';
import './Sidebar.css';
import {
  Collapsible,
  RangeSlider,
  SegmentedControl,
  Toggle
} from '../Common';
import {
    SunIcon, MoonIcon, BriefcaseIcon, SparklesIcon, LayoutIcon,
    CheckIcon, XIcon
} from '../Common/Icons';
import TriStateFilter from '../TriStateFilter/TriStateFilter';
import { FontSelector } from '../TypographyTester/FontSelector';

const Sidebar = ({
  input, setInput,
  minContrast, setMinContrast,
  maxContrast, setMaxContrast,
  maxTension, setMaxTension,
  calcMode, setCalcMode,
  uniqueMode, setUniqueMode,
  darknessFilter, setDarknessFilter,
  hideEmpty, setHideEmpty,
  showBorder, setShowBorder,
  fontTestMode, setFontTestMode,
  gridScale, setGridScale,
  stickToScreen, setStickToScreen,
  cardBaseWidth, setCardBaseWidth,
  search, setSearch,
  filteredColors,
  rowFilters, setRowFilters,
  colFilters, setColFilters,
  rowSortBy, setRowSortBy,
  rowSortOrder, setRowSortOrder,
  colSortBy, setColSortBy,
  colSortOrder, setColSortOrder,
  font, setFont,
  headingFont, setHeadingFont,
  headingEnabled, setHeadingEnabled,
  headingText, setHeadingText,
  headingSize, setHeadingSize,
  headingWeight, setHeadingWeight,
  testText, setTestText,
  testFontSize, setTestFontSize,
  testFontWeight, setTestFontWeight,
  resetAll,
  copySVG,
  panelPos, setPanelPos,
  theme, setTheme,
  visualStyle, setVisualStyle,
  floatPos, onDrag, panelSize, startResizing
}) => {

  const addColor = useCallback((hex) => {
    const raw = input.match(/#[0-9A-Fa-f]{6}/g) || [];
    if (!raw.includes(hex)) {
      const t = input.trim();
      const newVal = !t ? hex : (t.endsWith(',') || t.endsWith(' ') ? input + hex : input + ", " + hex);
      setInput(newVal);
    }
  }, [input, setInput]);

  const rowFilterItems = useMemo(() => filteredColors.map(c => (
    <TriStateFilter
      key={c}
      color={c}
      state={rowFilters[c] || 0}
      onChange={v => setRowFilters(prev => ({...prev, [c]: v}))}
    />
  )), [filteredColors, rowFilters, setRowFilters]);

  const colFilterItems = useMemo(() => filteredColors.map(c => (
    <TriStateFilter
      key={c}
      color={c}
      state={colFilters[c] || 0}
      onChange={v => setColFilters(prev => ({...prev, [c]: v}))}
    />
  )), [filteredColors, colFilters, setColFilters]);

  const isFloating = panelPos === 'floating';
  const isHorizontal = panelPos === 'top' || panelPos === 'bottom';

  return (
    <aside
      className={`sidebar panel-${panelPos}`}
      style={{
        width: isHorizontal ? '100%' : `${panelSize.w}px`,
        height: isHorizontal ? `${panelSize.h}px` : (isFloating ? `${panelSize.h}px` : '100vh'),
        ...(isFloating ? {
            position: 'absolute',
            left: floatPos.x,
            top: floatPos.y,
            borderRadius: 'var(--radius-xl)'
        } : {})
      }}
    >
      {/* Resize Handles */}
      {!isFloating && panelPos === 'right' && <div className="resize-handle left" onMouseDown={(e) => startResizing(e, 'w')}></div>}
      {!isFloating && panelPos === 'left' && <div className="resize-handle right" onMouseDown={(e) => startResizing(e, 'e')}></div>}
      {!isFloating && panelPos === 'top' && <div className="resize-handle bottom" onMouseDown={(e) => startResizing(e, 's')}></div>}
      {!isFloating && panelPos === 'bottom' && <div className="resize-handle top" onMouseDown={(e) => startResizing(e, 'n')}></div>}

      {isFloating && (
          <>
              <div className="resize-handle top" onMouseDown={(e) => startResizing(e, 'n')}></div>
              <div className="resize-handle bottom" onMouseDown={(e) => startResizing(e, 's')}></div>
              <div className="resize-handle left" onMouseDown={(e) => startResizing(e, 'w')}></div>
              <div className="resize-handle right" onMouseDown={(e) => startResizing(e, 'e')}></div>
              <div className="resize-handle corner-se" onMouseDown={(e) => startResizing(e, 'se')}></div>
          </>
      )}

      <header className="sidebar-header" onMouseDown={onDrag} style={{ cursor: isFloating ? 'grab' : 'default' }}>
        <div className="header-title">
          <h2>Settings</h2>
          <span className="version">PRO V8.2 SPA</span>
        </div>
        <div className="header-actions">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="icon-btn"
            title="Toggle Dark Mode"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            onClick={() => setVisualStyle(visualStyle === 'professional' ? 'cute' : 'professional')}
            className="icon-btn"
            title="Toggle Style"
          >
            {visualStyle === 'professional' ? <SparklesIcon /> : <BriefcaseIcon />}
          </button>

          <div className="layout-switcher">
             {['left', 'right', 'top', 'bottom', 'floating'].map(pos => (
               <button
                key={pos}
                onClick={() => setPanelPos(pos)}
                className={`icon-btn sm ${panelPos === pos ? 'active' : ''}`}
                title={`Dock ${pos}`}
               >
                 <LayoutIcon pos={pos} size={12} />
               </button>
             ))}
          </div>
        </div>
      </header>

      <div className={`sidebar-content custom-scrollbar ${isHorizontal ? 'horizontal-layout' : ''}`}>
        <Collapsible title="Colors Input">
          <div className="section-stack">
            <div className="input-header">
              <label>HEX List</label>
              <div className="quick-adds">
                <button onClick={() => addColor("#000000")}>+ Black</button>
                <button onClick={() => addColor("#ffffff")}>+ White</button>
              </div>
            </div>
            <textarea
              rows="5"
              className="hex-textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        </Collapsible>

        <Collapsible title="Thresholds">
          <div className="section-stack gap-5">
            <RangeSlider
                label="Contrast Min" value={minContrast} min={0} max={21} step={0.1}
                onChange={setMinContrast} thresholds={[0, 3, 4.5, 7, 21]}
                icon={CheckIcon}
            />
            <RangeSlider
                label="Contrast Max" value={maxContrast} min={0} max={21} step={0.1}
                onChange={setMaxContrast} thresholds={[0, 3, 4.5, 7, 21]}
                icon={XIcon}
            />
            <RangeSlider
                label="Vibration Limit" value={maxTension} min={0} max={10} step={0.5}
                onChange={setMaxTension} thresholds={[2, 5, 8, 10]} unit="/10"
                icon={SparklesIcon}
            />
          </div>
        </Collapsible>

        <Collapsible title="Global Modes">
          <div className="section-stack gap-4">
            <SegmentedControl label="Visual Style" value={visualStyle} onChange={setVisualStyle} options={[{ label: 'Professional', value: 'professional' }, { label: 'Cute Kawaii', value: 'cute' }]} />
            <SegmentedControl label="Calc Mode" value={calcMode} onChange={setCalcMode} options={[{ label: 'WCAG 2.1', value: 'wcag' }, { label: 'APCA', value: 'apca' }]} />
            <SegmentedControl label="Uniqueness" value={uniqueMode} onChange={setUniqueMode} options={[{ label: 'All', value: 'all' }, { label: 'Half (BG)', value: 'bg' }, { label: 'Half (FG)', value: 'fg' }]} />
            <SegmentedControl label="Contrast Rel" value={darknessFilter} onChange={setDarknessFilter} options={[{ label: 'All', value: 'all' }, { label: 'Dark BG', value: 'bg-darker' }, { label: 'Dark FG', value: 'fg-darker' }]} />
            <div className="toggle-grid">
              <Toggle label="Hide Empty" active={hideEmpty} onChange={setHideEmpty} icon={SparklesIcon} />
              <Toggle label="Borders" active={showBorder} onChange={setShowBorder} icon={BriefcaseIcon} />
            </div>
          </div>
        </Collapsible>

        <Collapsible title="Typography">
          <div className="section-stack gap-4">
            <Toggle label="Font Test Mode" active={fontTestMode} onChange={setFontTestMode} />

            {fontTestMode && (
              <div className="typography-subpanel animate-fade">
                <RangeSlider label="Card Size (1:1)" value={cardBaseWidth} min={100} max={600} step={10} onChange={setCardBaseWidth} thresholds={[220, 300, 400, 600]} unit="px" />

                <div className="sub-section">
                  <div className="sub-header">
                    <label>Heading</label>
                    <button
                      onClick={() => setHeadingEnabled(!headingEnabled)}
                      className={`mini-toggle ${headingEnabled ? 'active' : ''}`}
                    >
                      {headingEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  {headingEnabled && (
                    <div className="sub-fields">
                      <input type="text" placeholder="Heading Text" value={headingText} onChange={e => setHeadingText(e.target.value)} />
                      <FontSelector currentFont={headingFont} onSelect={setHeadingFont} />
                      <RangeSlider label="Size" value={headingSize} min={8} max={120} step={1} onChange={setHeadingSize} thresholds={[24, 32, 48, 64]} unit="px" />
                      <RangeSlider label="Weight" value={headingWeight} min={100} max={900} step={100} onChange={setHeadingWeight} thresholds={[100, 400, 700, 900]} />
                    </div>
                  )}
                </div>

                <div className="sub-section">
                  <label className="sub-label">Body Text</label>
                  <div className="sub-fields">
                    <textarea rows="2" value={testText} onChange={e => setTestText(e.target.value)} />
                    <FontSelector currentFont={font} onSelect={setFont} />
                    <RangeSlider label="Size" value={testFontSize} min={8} max={72} step={1} onChange={setTestFontSize} thresholds={[12, 16, 24, 32, 48]} unit="px" />
                    <RangeSlider label="Weight" value={testFontWeight} min={100} max={900} step={100} onChange={setTestFontWeight} thresholds={[100, 400, 700, 900]} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </Collapsible>

        <Collapsible title="Visual Matrix">
          <div className="section-stack gap-5">
            <RangeSlider label="Grid Scale (1:1)" value={gridScale} min={20} max={200} step={1} onChange={setGridScale} thresholds={[20, 50, 100, 150, 200]} unit="%" />
            <Toggle label="Stick Rows to Screen" active={stickToScreen} onChange={setStickToScreen} />

            <div className="sorting-panel">
              <label>Sorting</label>
              <div className="sort-controls">
                <div className="sort-group">
                  <span>Rows</span>
                  <div className="btn-group">
                    <button onClick={() => setRowSortBy('hue-lum')} className={rowSortBy === 'hue-lum' ? 'active' : ''}>H-L</button>
                    <button onClick={() => setRowSortBy('lum-hue')} className={rowSortBy === 'lum-hue' ? 'active' : ''}>L-H</button>
                    <button onClick={() => setRowSortOrder(o => o === 'asc' ? 'desc' : 'asc')} className="order-btn">{rowSortOrder === 'asc' ? '↑' : '↓'}</button>
                  </div>
                </div>
                <div className="sort-group">
                  <span>Cols</span>
                  <div className="btn-group">
                    <button onClick={() => setColSortBy('hue-lum')} className={colSortBy === 'hue-lum' ? 'active' : ''}>H-L</button>
                    <button onClick={() => setColSortBy('lum-hue')} className={colSortBy === 'lum-hue' ? 'active' : ''}>L-H</button>
                    <button onClick={() => setColSortOrder(o => o === 'asc' ? 'desc' : 'asc')} className="order-btn">{colSortOrder === 'asc' ? '↑' : '↓'}</button>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={copySVG} className="primary-btn">Copy SVG (Figma)</button>

            <div className="filters-panel">
              <div className="filters-header">
              <label>Global Filters</label>
                <button onClick={resetAll} className="reset-btn">Reset All</button>
              </div>
              <input type="text" placeholder="Search colors..." value={search} onChange={e => setSearch(e.target.value)} className="search-input" />
              <div className="filters-grid">
                <div className="filter-column">
                <div className="filter-column-header">
                  <span className="col-label">Rows</span>
                  <button onClick={() => setRowFilters({})} className="mini-reset-btn">Reset</button>
                </div>
                  <div className="filter-list custom-scrollbar">
                    {rowFilterItems}
                  </div>
                </div>
                <div className="filter-column">
                <div className="filter-column-header">
                  <span className="col-label">Cols</span>
                  <button onClick={() => setColFilters({})} className="mini-reset-btn">Reset</button>
                </div>
                  <div className="filter-list custom-scrollbar">
                    {colFilterItems}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Collapsible>
      </div>
    </aside>
  );
};

export default React.memo(Sidebar);
