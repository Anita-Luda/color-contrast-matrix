import React, { useCallback } from 'react';
import './MatrixGrid.css';
import Card from '../ColorCard/Card';

const MatrixGrid = ({
  activeRows, activeCols, isHidden, calcMode, font, headingFont, maxTension,
  showBorder, fontTestMode, testText, testFontSize, testFontWeight,
  headingEnabled, headingText, headingSize, headingWeight,
  gridScale, cardBaseWidth, stickToScreen, visualStyle
}) => {

  const checkHidden = useCallback((bg, fg) => isHidden(bg, fg), [isHidden]);

  const cardScale = gridScale / 100;
  const cardHeight = 310; // Match --card-h in variables.css

  return (
    <main className="grid-area">
      <div className="grid-wrapper">
        <div
          className="matrix-grid"
          style={{
            gridTemplateColumns: `var(--header-row-w) repeat(${activeCols.length}, ${cardBaseWidth * cardScale}px)`,
            gridTemplateRows: `var(--header-col-h) repeat(${activeRows.length}, ${cardHeight * cardScale}px)`,
            gap: `${16 * cardScale}px`
          }}
        >
          {/* BACKGROUND STRIPS - Layered below headers */}
          <div className="col-header-strip" style={{ gridColumn: `2 / span ${activeCols.length}`, gridRow: '1' }}></div>
          <div className={`row-header-strip ${stickToScreen ? 'sticky' : ''}`} style={{ gridColumn: '1', gridRow: `2 / span ${activeRows.length}` }}></div>

          {/* Corner Header */}
          <div
            className={`sticky-header corner ${stickToScreen ? 'stick-screen' : ''}`}
            style={{ gridColumn: '1', gridRow: '1' }}
          >
            <div className="header-label">BG / FG</div>
          </div>

          {/* Column Headers */}
          {activeCols.map((c, idx) => (
            <div
              key={c}
              className="sticky-header col"
              style={{ gridColumn: `${idx + 2}`, gridRow: '1' }}
            >
              <div className="swatch-indicator" style={{ backgroundColor: c }}></div>
              <div className="header-color-code">{c}</div>
            </div>
          ))}

          {/* Rows */}
          {activeRows.map((bg, rowIdx) => (
            <React.Fragment key={bg}>
              {/* Row Header */}
              <div
                className={`sticky-header row ${stickToScreen ? 'stick-screen' : ''}`}
                style={{ gridColumn: '1', gridRow: `${rowIdx + 2}` }}
              >
                <div className="row-color-code">{bg}</div>
                <div className="row-swatch" style={{ backgroundColor: bg }}></div>
              </div>

              {/* Cards */}
              {activeCols.map((fg, colIdx) => {
                const hidden = checkHidden(bg, fg);
                return (
                  <div
                    key={`${bg}-${fg}`}
                    className={`cell ${hidden ? 'hidden' : ''}`}
                    style={{
                        gridColumn: `${colIdx + 2}`,
                        gridRow: `${rowIdx + 2}`,
                        width: `${cardBaseWidth * cardScale}px`,
                        height: `${cardHeight * cardScale}px`,
                        overflow: 'visible'
                    }}
                  >
                    <div style={{
                        transform: `scale(${cardScale})`,
                        transformOrigin: 'top left',
                        width: `${cardBaseWidth}px`,
                        height: `${cardHeight}px`
                    }}>
                        {!hidden && (
                        <Card
                            bg={bg} fg={fg} mode={calcMode} font={font} headingFont={headingFont}
                            tensionLimit={maxTension} showBorder={showBorder} fontTestMode={fontTestMode}
                            testText={testText} testFontSize={testFontSize} testFontWeight={testFontWeight}
                            headingEnabled={headingEnabled} headingText={headingText}
                            headingSize={headingSize} headingWeight={headingWeight}
                            baseW={cardBaseWidth}
                            visualStyle={visualStyle}
                        />
                        )}
                    </div>
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
