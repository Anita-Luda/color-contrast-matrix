import React from 'react';
import './Card.css';
import { getContrastRatio, getApcaContrast, getVisualTensionScore } from '../../utils/color';

const Sparkle = ({ style }) => (
  <svg className="sparkle" viewBox="0 0 24 24" fill="currentColor" style={style}>
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

const Card = ({
  bg, fg, mode, font, headingFont, tensionLimit,
  showBorder, fontTestMode, testText, testFontSize,
  testFontWeight, headingEnabled, headingText,
  headingSize, headingWeight, cardScale, baseW,
  visualStyle
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
  const cardW = baseW * scale;
  const cardH = fontTestMode ? cardW : (baseW * 1.6 * scale);

  return (
    <div className={`color-card ${showBorder ? 'with-border' : ''}`}
         style={{
           width: `${cardW}px`,
           height: `${cardH}px`,
           borderRadius: `var(--radius-card)`,
           borderColor: fg,
           borderWidth: `var(--border-width)`
         }}>

      {/* Top part - Dynamic Background */}
      <div className="card-top"
           style={{
             background: bg,
             color: fg,
             padding: `${1.25 * scale}rem`,
             justifyContent: fontTestMode ? 'center' : 'flex-start'
           }}>

        {/* Cute Sparkles - only visible in cute style via CSS */}
        <div className="sparkles-container">
           <Sparkle style={{ top: '10%', left: '10%', width: '12px' }} />
           <Sparkle style={{ top: '20%', right: '15%', width: '8px' }} />
           <Sparkle style={{ bottom: '20%', left: '15%', width: '10px' }} />
        </div>

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
                  <div>{isPass3 ? (visualStyle === 'cute' ? "✨" : "✅") : "❌"} {mode === 'apca' ? 'Lc 30' : '3:1'}</div>
                  <div>{isPass45 ? (visualStyle === 'cute' ? "🌸" : "✅") : "❌"} {mode === 'apca' ? 'Lc 45' : '4.5:1'}</div>
                  <div>{isPass7 ? (visualStyle === 'cute' ? "👑" : "✅") : "❌"} {mode === 'apca' ? 'Lc 75' : '7:1'}</div>
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
           height: `${100 * scale}px`,
           borderRadius: `0 0 var(--radius-card) var(--radius-card)`
      }}>
        <div className="bottom-info">
          <div className="pair-label">{bg} ⇆ {fg}</div>
          <div className="pair-value">{val}{suffix}</div>
        </div>

        <div className="bottom-status">
          <span className="status-item">{isPass3 ? (visualStyle === 'cute' ? "✨" : "✅") : "❌"} Icons</span>
          <span className="status-item">{isPass45 ? (visualStyle === 'cute' ? "🌸" : "✅") : "❌"} AA</span>
          <span className="status-item">{isPass7 ? (visualStyle === 'cute' ? "👑" : "✅") : "❌"} AAA</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Card);
