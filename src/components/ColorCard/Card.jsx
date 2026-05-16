import React from 'react';
import './Card.css';
import { getContrastRatio, getApcaContrast, getVisualTensionScore } from '../../utils/color';
import { CheckIcon, XIcon } from '../Common/Icons';

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
  const cardW = baseW; // Scale is now handled by container transform
  const cardH = fontTestMode ? cardW : (baseW * 1.6);

  const isCute = visualStyle === 'cute';

  const renderStatus = (pass, label) => {
    if (isCute) {
      if (pass) {
        if (label === 'Icons') return "✨";
        if (label === 'AA') return "🌸";
        if (label === 'AAA') return "👑";
      }
      return "❌";
    }
    return pass ? <CheckIcon /> : <XIcon />;
  };

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
             padding: `1.25rem`,
             justifyContent: fontTestMode ? 'center' : 'flex-start'
           }}>

        {/* Cute Sparkles - moved to edges to not obscure text */}
        <div className="sparkles-container">
           <Sparkle style={{ top: '5%', left: '5%', width: '14px' }} />
           <Sparkle style={{ top: '5%', right: '5%', width: '10px' }} />
           <Sparkle style={{ bottom: '5%', left: '5%', width: '12px' }} />
           <Sparkle style={{ bottom: '5%', right: '5%', width: '16px' }} />
        </div>

        {tension >= tensionLimit && (
          <div className="tension-warning" style={{ fontSize: `1rem` }} title={`Vibration Score: ${tension}`}>⚠️</div>
        )}

        {fontTestMode ? (
            <div className="font-test-container">
                {headingEnabled && (
                  <div style={{ fontFamily: headingFont, fontSize: `${headingSize}px`, fontWeight: headingWeight, lineHeight: 1.1 }}>
                    {headingText || "Heading"}
                  </div>
                )}
                <div style={{ fontFamily: font, fontSize: `${testFontSize}px`, fontWeight: testFontWeight, lineHeight: 1.2 }}>
                    {testText || "Sample Text"}
                </div>
            </div>
        ) : (
            <div className="indicator-group">
                <div className="contrast-value" style={{ fontSize: `32px` }}>
                  {val}{suffix}
                </div>

                <div className="pass-indicators" style={{ fontSize: `14px` }}>
                  <div className="indicator-row">
                    {renderStatus(isPass3, 'Icons')}
                    <span>{mode === 'apca' ? 'Lc 30' : '3:1'}</span>
                  </div>
                  <div className="indicator-row">
                    {renderStatus(isPass45, 'AA')}
                    <span>{mode === 'apca' ? 'Lc 45' : '4.5:1'}</span>
                  </div>
                  <div className="indicator-row">
                    {renderStatus(isPass7, 'AAA')}
                    <span>{mode === 'apca' ? 'Lc 75' : '7:1'}</span>
                  </div>
                </div>

                <div className="hex-labels" style={{ fontSize: `10px` }}>
                  <div>{bg} - BG</div>
                  <div>{fg} - FG</div>
                </div>
            </div>
        )}
      </div>

      {/* Bottom part - Persistent Background */}
      <div className="card-bottom" style={{
           padding: `1.25rem`,
           fontSize: `11px`,
           height: `100px`,
           borderRadius: `0 0 var(--radius-card) var(--radius-card)`
      }}>
        <div className="bottom-info">
          <div className="pair-label">{bg} ⇆ {fg}</div>
          <div className="pair-value">{val}{suffix}</div>
        </div>

        <div className="bottom-status">
          <span className="status-item">{renderStatus(isPass3, 'Icons')} <span className="status-label">Icons</span></span>
          <span className="status-item">{renderStatus(isPass45, 'AA')} <span className="status-label">AA</span></span>
          <span className="status-item">{renderStatus(isPass7, 'AAA')} <span className="status-label">AAA</span></span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Card);
