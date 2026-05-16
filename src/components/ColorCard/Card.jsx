import React from 'react';
import './Card.css';
import { getContrastRatio, getApcaContrast, getVisualTensionScore } from '../../utils/color';

const Card = ({
  bg, fg, mode, font, headingFont, tensionLimit,
  showBorder, fontTestMode, testText, testFontSize,
  testFontWeight, headingEnabled, headingText,
  headingSize, headingWeight, cardScale, baseW
}) => {
  const ratio = React.useMemo(() => getContrastRatio(bg, fg), [bg, fg]);
  const apca = React.useMemo(() => getApcaContrast(fg, bg), [bg, fg]);
  const tension = React.useMemo(() => getVisualTensionScore(bg, fg), [bg, fg]);

  const isPass3 = mode === 'apca' ? Math.abs(apca) >= 30 : ratio >= 3;
  const isPass45 = mode === 'apca' ? Math.abs(apca) >= 45 : ratio >= 4.5;
  const isPass7 = mode === 'apca' ? Math.abs(apca) >= 75 : ratio >= 7;

  const val = mode === 'apca' ? apca : ratio;
  const suffix = mode === 'apca' ? '' : ':1';

  const scale = cardScale / 100;
  const borderRadius = 2.5 * scale;
  const cardW = baseW * scale;
  const cardH = fontTestMode ? cardW : (baseW * 1.6 * scale);

  return (
    <div className={`color-card ${showBorder ? 'with-border' : ''}`}
         style={{
           width: `${cardW}px`,
           height: `${cardH}px`,
           borderRadius: `${borderRadius}rem`,
           borderColor: fg
         }}>

      {/* Top part - Dynamic Background */}
      <div className="card-top"
           style={{
             background: bg,
             color: fg,
             padding: `${1.25 * scale}rem`,
             justifyContent: fontTestMode ? 'center' : 'flex-start'
           }}>

        {tension >= tensionLimit && (
          <div className="tension-warning" style={{ fontSize: `${1 * scale}rem` }} title={`Vibration Score: ${tension}`}>⚠️</div>
        )}

        {fontTestMode ? (
            <div className="font-test-container">
                {headingEnabled && (
                  <div style={{ fontFamily: headingFont, fontSize: `${headingSize * scale}px`, fontWeight: headingWeight, lineHeight: 1.1 }}>
                    {headingText || "Heading"}
                  </div>
                )}
                <div style={{ fontFamily: font, fontSize: `${testFontSize * scale}px`, fontWeight: testFontWeight, lineHeight: 1.2 }}>
                    {testText || "Sample Text"}
                </div>
            </div>
        ) : (
            <>
                <div className="contrast-value" style={{ fontSize: `${32 * scale}px` }}>
                  {val}{suffix}
                </div>

                <div className="pass-indicators" style={{ fontSize: `${14 * scale}px` }}>
                  <div>{isPass3 ? "✅" : "❌"} {mode === 'apca' ? 'Lc 30' : '3:1'}</div>
                  <div>{isPass45 ? "✅" : "❌"} {mode === 'apca' ? 'Lc 45' : '4.5:1'}</div>
                  <div>{isPass7 ? "✅" : "❌"} {mode === 'apca' ? 'Lc 75' : '7:1'}</div>
                </div>

                <div className="hex-labels" style={{ fontSize: `${10 * scale}px` }}>
                  <div>{bg} - BG</div>
                  <div>{fg} - FG</div>
                </div>
            </>
        )}
      </div>

      {/* Bottom part - Persistent Background */}
      <div className="card-bottom" style={{
           padding: `${1.25 * scale}rem`,
           fontSize: `${11 * scale}px`,
           height: `${100 * scale}px`
      }}>
        <div className="bottom-info">
          <div className="pair-label">{bg} ⇆ {fg}</div>
          <div className="pair-value">{val}{suffix}</div>
        </div>

        <div className="bottom-status">
          <span className="status-item">{isPass3 ? "✅" : "❌"} Icons</span>
          <span className="status-item">{isPass45 ? "✅" : "❌"} AA</span>
          <span className="status-item">{isPass7 ? "✅" : "❌"} AAA</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Card);
