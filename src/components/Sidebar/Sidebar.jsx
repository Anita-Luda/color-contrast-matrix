import React, { useCallback, useMemo, useState } from 'react';
import './Sidebar.css';
import {
  Collapsible,
  RangeSlider,
  SegmentedControl,
  Toggle
} from '../Common';
import {
  SunIcon, MoonIcon, BriefcaseIcon, SparklesIcon, LayoutIcon,
  CheckIcon, XIcon, WarningIcon
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
  colorBlindness, setColorBlindness,
  showBorder, setShowBorder,
  fontTestMode, setFontTestMode,
  gridScale, setGridScale,
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
  copyShareLink,
  panelPos, setPanelPos,
  theme, setTheme,
  visualStyle, setVisualStyle,
  floatPos, onDrag, panelSize, startResizing
}) => {

  const [showCalcInfo, setShowCalcInfo] = useState(false);

  const addColor = useCallback((hex) => {
    const hexMatch = input.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/g) || [];
    const rgbMatch = input.match(/rgba?\([^)]+\)/gi) || [];
    const hslMatch = input.match(/hsla?\([^)]+\)/gi) || [];
    const raw = [...hexMatch, ...rgbMatch, ...hslMatch];

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
      onChange={v => setRowFilters(prev => ({ ...prev, [c]: v }))}
    />
  )), [filteredColors, rowFilters, setRowFilters]);

  const colFilterItems = useMemo(() => filteredColors.map(c => (
    <TriStateFilter
      key={c}
      color={c}
      state={colFilters[c] || 0}
      onChange={v => setColFilters(prev => ({ ...prev, [c]: v }))}
    />
  )), [filteredColors, colFilters, setColFilters]);

  const isHorizontal = panelPos === 'top' || panelPos === 'bottom';
  const isCute = visualStyle === 'cute';

  return (
    <aside
      className={`sidebar panel-${panelPos}`}
      style={{
        width: isHorizontal ? '100%' : `${panelSize.w}px`,
        height: isHorizontal ? `${panelSize.h}px` : (panelPos === 'floating' ? `${panelSize.h}px` : '100vh'),
        ...(panelPos === 'floating' ? {
          position: 'absolute',
          left: floatPos.x,
          top: floatPos.y,
          borderRadius: 'var(--radius-panel)'
        } : {})
      }}
    >
      {/* Resize Handles */}
      {!isHorizontal && panelPos !== 'floating' && (
        <div className={`resize-handle ${panelPos === 'right' ? 'left' : 'right'}`} onMouseDown={(e) => startResizing(e, panelPos === 'right' ? 'w' : 'e')}></div>
      )}
      {isHorizontal && (
        <div className={`resize-handle ${panelPos === 'top' ? 'bottom' : 'top'}`} onMouseDown={(e) => startResizing(e, panelPos === 'top' ? 's' : 'n')}></div>
      )}

      {panelPos === 'floating' && (
        <>
          <div className="resize-handle top" onMouseDown={(e) => startResizing(e, 'n')}></div>
          <div className="resize-handle bottom" onMouseDown={(e) => startResizing(e, 's')}></div>
          <div className="resize-handle left" onMouseDown={(e) => startResizing(e, 'w')}></div>
          <div className="resize-handle right" onMouseDown={(e) => startResizing(e, 'e')}></div>
          <div className="resize-handle corner-se" onMouseDown={(e) => startResizing(e, 'se')}></div>
        </>
      )}

      <header className="sidebar-header" onMouseDown={onDrag} style={{ cursor: panelPos === 'floating' ? 'grab' : 'default' }}>
        <div className="header-title">
          <h2>Settings</h2>
          <span className="version">PRO V9.0 SPA</span>
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
        <Collapsible title="Colors Input" defaultOpen={!isHorizontal}>
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

        <Collapsible title="Thresholds" defaultOpen={true}>
          <div className="section-stack">
            <div className={isHorizontal ? 'horizontal-control-stack' : 'vertical-control-stack'}>
              <RangeSlider
                label="Contrast Min"
                value={minContrast}
                min={calcMode === 'apca' ? 0 : 1}
                max={calcMode === 'apca' ? 120 : 21}
                step={calcMode === 'apca' ? 1 : 0.1}
                onChange={setMinContrast}
                thresholds={calcMode === 'apca' ? [0, 15, 30, 45, 60, 75, 90, 120] : [1, 3, 4.5, 7, 21]}
                icon={CheckIcon}
              />
              <RangeSlider
                label="Contrast Max"
                value={maxContrast === Infinity ? (calcMode === 'apca' ? 120 : 21) : maxContrast}
                min={calcMode === 'apca' ? 0 : 1}
                max={calcMode === 'apca' ? 120 : 21}
                step={calcMode === 'apca' ? 1 : 0.1}
                onChange={setMaxContrast}
                thresholds={calcMode === 'apca' ? [0, 15, 30, 45, 60, 75, 90, 120] : [1, 3, 4.5, 7, 21]}
                icon={XIcon}
              />
            </div>
            <RangeSlider
              label="Vibration Limit" value={maxTension} min={0} max={10} step={0.5}
              onChange={setMaxTension} thresholds={[2, 5, 8, 10]} unit="/10"
              icon={WarningIcon}
            />
          </div>
        </Collapsible>

        <Collapsible title="Global Modes" defaultOpen={!isHorizontal}>
          <div className="section-stack">
            <SegmentedControl label={<span
              className="label-inline-info"
              onClick={() => setShowCalcInfo(true)}
              title="About contrast calculation"
            >
              Calc Mode <span className="info-icon">(?)</span>
            </span>
            }
              value={calcMode} onChange={setCalcMode} options={[{ label: 'WCAG 2.1', value: 'wcag' }, { label: 'APCA', value: 'apca' }]} />
            <div className="toggle-grid">
              <Toggle label="Hide Empty" active={hideEmpty} onChange={setHideEmpty} icon={isCute ? SparklesIcon : null} />
              <Toggle label="Borders" active={showBorder} onChange={setShowBorder} icon={isCute ? BriefcaseIcon : null} />
            </div>
            <SegmentedControl
              label="Color Blindness"
              value={colorBlindness}
              onChange={setColorBlindness}
              options={[
                { label: 'None', value: 'none' },
                { label: 'Protan', value: 'protanopia' },
                { label: 'Deutan', value: 'deuteranopia' },
                { label: 'Tritan', value: 'tritanopia' },
                { label: 'Gray', value: 'achromatopsia' }
              ]}
            />
            <SegmentedControl label="Uniqueness" value={uniqueMode} onChange={setUniqueMode} options={[{ label: 'All', value: 'all' }, { label: 'Half (BG)', value: 'bg' }, { label: 'Half (FG)', value: 'fg' }]} />
            <SegmentedControl label="Contrast Rel" value={darknessFilter} onChange={setDarknessFilter} options={[{ label: 'All', value: 'all' }, { label: 'Dark BG', value: 'bg-darker' }, { label: 'Dark FG', value: 'fg-darker' }]} />
          </div>
        </Collapsible>

        <Collapsible title="Typography" defaultOpen={!isHorizontal}>
          <div className="section-stack">
            <Toggle label="Font Test Mode" active={fontTestMode} onChange={setFontTestMode} icon={isCute ? SparklesIcon : null} />

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

        <Collapsible title="Visual Matrix" defaultOpen={true}>
          <div className="section-stack">
            <RangeSlider label="Grid Scale (1:1)" value={gridScale} min={20} max={200} step={1} onChange={setGridScale} thresholds={[20, 50, 100, 150, 200]} unit="%" icon={isCute ? SparklesIcon : null} />

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

            <div className="action-row">
              <button onClick={copySVG} className="primary-btn">Copy SVG</button>
              <button onClick={copyShareLink} className="secondary-btn">Share Link</button>
            </div>

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
      {showCalcInfo && (
        <div className="modal-overlay" onClick={() => setShowCalcInfo(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Contrast calculation modes</h3>

            <p><strong>WCAG 2.1</strong></p>
            <ul>
              <li>Klasyczny model oparty o luminancję (1–21)</li>
              <li>Oficjalne progi dostępności</li>
              <li>Słabszy dla jasnych / dark UI</li>
            </ul>

            <p><strong>APCA</strong></p>
            <ul>
              <li>Model percepcyjny (0–120)</li>
              <li>Lepiej oddaje czytelność tekstu</li>
              <li>Rekomendowany do nowoczesnych interfejsów</li>
            </ul>

            <h3>APCA – Enhanced Contrast Requirements</h3>

            <section>
              <h4>AA, Enhanced</h4>

              <p><strong>SHOULD</strong></p>
              <ul>
                <li>Lc 15 (≈ WCAG 1.3:1) – Disabled elements (not hidden)</li>
                <li>Lc 30 (≈ WCAG 1.8:1) – Incidental text (placeholders, hints)</li>
                <li>Lc 45 (≈ WCAG 2:1) – Logotypes</li>
              </ul>

              <p><strong>SHALL</strong></p>
              <ul>
                <li>Lc 60 (≈ WCAG 3:1) – Large text only, no body text (non‑text OK)</li>
                <li>Lc 75 (≈ WCAG 4.5:1) – Body text ≥16px, otherwise ≥12px</li>
                <li>Lc 90 (≈ WCAG 7:1) – Body text ≥14px, otherwise ≥10px</li>
              </ul>

              <p><strong>MAY</strong></p>
              <p className="modal-note">
                If the lightest color is darker than ~#d8d8d8, the minimum Lc value may be
                reduced by 10 (but not below Lc 45). Does not apply to thin fonts.
              </p>
            </section>

            <hr />

            <section>
              <h4>AAA, Enhanced</h4>

              <p><strong>SHOULD</strong></p>
              <ul>
                <li>Lc 30 (≈ WCAG 1.8:1) – Disabled elements</li>
                <li>Lc 45 (≈ WCAG 2:1) – Incidental text</li>
              </ul>

              <p><strong>SHALL</strong></p>
              <ul>
                <li>Lc 60 (≈ WCAG 3:1) – Logotypes & essential non‑text</li>
                <li>Lc 75 (≈ WCAG 4.5:1) – Large text only</li>
                <li>Lc 90 (≈ WCAG 7:1) – Body text ≥16px, otherwise ≥12px</li>
              </ul>

              <p><strong>MAY</strong></p>
              <ul>
                <li>Lc 90 (≈ WCAG 7:1) – Suggested maximum for very large / bold text</li>
              </ul>
            </section>

            <hr />

            <section>
              <h4>Font Use (Enhanced)</h4>

              <p><strong>SHOULD</strong></p>
              <ul>
                <li>Prefer x‑height ratio ≈ <strong>0.56</strong></li>
                <li>Increase font size for fonts with smaller x‑height</li>
                <li>Recommended x‑heights:
                  <ul>
                    <li>13.5px normal (≈24px body)</li>
                    <li>10.5px bold (≈18.7px body)</li>
                  </ul>
                </li>
                <li>Font weight between <strong>300–700</strong></li>
              </ul>
            </section>

            <button className="primary-btn" onClick={() => setShowCalcInfo(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default React.memo(Sidebar);
