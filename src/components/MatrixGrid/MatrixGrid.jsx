import React, { useCallback } from 'react';
import './MatrixGrid.css';
import Card from '../ColorCard/Card';

const MatrixGrid = ({
  activeRows, activeCols, isHidden, calcMode, font, headingFont, maxTension,
  showBorder, fontTestMode, testText, testFontSize, testFontWeight,
  headingEnabled, headingText, headingSize, headingWeight,
  gridScale, cardBaseWidth, stickToScreen
}) => {

  // Memoized hidden check to avoid re-calculating inside the map if not needed
  const checkHidden = useCallback((bg, fg) => isHidden(bg, fg), [isHidden]);

  return (
    <main className="grid-area">
      <div className="grid-wrapper">
        <div
          className="matrix-grid"
          style={{
            gridTemplateColumns: `minmax(0, 1fr) 120px repeat(${activeCols.length}, var(--card-w)) minmax(0, 1fr)`,
            '--card-w': `calc(${cardBaseWidth}px * ${gridScale/100})`,
            '--card-gap': `calc(16px * ${gridScale/100})`,
            gap: 'var(--card-gap)'
          }}
        >
          {/* Corner Header */}
          <div
            className="sticky-header corner"
            style={{
                gridColumn: '2',
                left: stickToScreen ? '0' : 'auto',
                zIndex: stickToScreen ? '110' : '100'
            }}
          >
            <div className="header-label">BG / FG</div>
          </div>

          {/* Column Headers */}
          {activeCols.map((c, idx) => (
            <div
              key={c}
              className="sticky-header col"
              style={{ gridColumn: `${idx + 3}` }}
            >
              <div className="swatch-indicator" style={{ backgroundColor: c }}></div>
              <div className="header-color-code">{c}</div>
            </div>
          ))}

          {/* Rows */}
          {activeRows.map(bg => (
            <React.Fragment key={bg}>
              {/* Row Header */}
              <div
                className="sticky-header row"
                style={{
                    gridColumn: '2',
                    left: stickToScreen ? '0' : 'auto'
                }}
              >
                <div className="row-color-code">{bg}</div>
                <div className="row-swatch" style={{ backgroundColor: bg }}></div>
              </div>

              {/* Cards */}
              {activeCols.map((fg, idx) => {
                const hidden = checkHidden(bg, fg);
                return (
                  <div
                    key={`${bg}-${fg}`}
                    className={`cell ${hidden ? 'hidden' : ''}`}
                    style={{ gridColumn: `${idx + 3}` }}
                  >
                    {!hidden && (
                      <Card
                        bg={bg} fg={fg} mode={calcMode} font={font} headingFont={headingFont}
                        tensionLimit={maxTension} showBorder={showBorder} fontTestMode={fontTestMode}
                        testText={testText} testFontSize={testFontSize} testFontWeight={testFontWeight}
                        headingEnabled={headingEnabled} headingText={headingText}
                        headingSize={headingSize} headingWeight={headingWeight}
                        cardScale={gridScale} baseW={cardBaseWidth}
                      />
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </main>
  );
};

export default React.memo(MatrixGrid);
