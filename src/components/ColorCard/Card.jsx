import React, { useMemo } from 'react';
import './Card.css';
import { getContrastRatio, getApcaContrast, getVisualTensionScore } from '../../utils/color';
import { CheckIcon, XIcon, WarningIcon } from '../Common/Icons';

const Sparkle = ({ style }) => (
  <svg className="sparkle" viewBox="0 0 24 24" fill="currentColor" style={style}>
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

const Card = ({
  bg, fg, mode, font, headingFont, tensionLimit,
  showBorder, fontTestMode, testText, testFontSize,
  testFontWeight, headingEnabled, headingText,
  headingSize, headingWeight, baseW, visualStyle
}) => {
  const ratio = useMemo(() => getContrastRatio(bg, fg), [bg, fg]);
  const apca = useMemo(() => getApcaContrast(fg, bg), [bg, fg]);
  const tension = useMemo(() => getVisualTensionScore(bg, fg), [bg, fg]);

  const isPass3 = mode === 'apca' ? Math.abs(apca) >= 30 : ratio >= 3;
  const isPass45 = mode === 'apca' ? Math.abs(apca) >= 45 : ratio >= 4.5;
  const isPass7 = mode === 'apca' ? Math.abs(apca) >= 75 : ratio >= 7;

  const val = mode === 'apca' ? apca : ratio;
  const suffix = mode === 'apca' ? '' : ':1';

  const isCute = visualStyle === 'cute';

  const sparkles = useMemo(() => {
    if (!isCute) return [];
    return Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      style: {
        top: `${Math.random() * 70 + 15}%`,
        left: `${Math.random() * 40 + 55}%`,
        width: `${Math.random() * 10 + 6}px`,
        opacity: Math.random() * 0.4 + 0.2,
        animationDelay: `${Math.random() * 2}s`
      }
    }));
  }, [isCute]);

  const renderStatus = (pass) => {
    if (pass) return <CheckIcon size={12} color="var(--color-success)" />;
    return <XIcon size={12} color="var(--color-error)" />;
  };

  return (
    <div className={`color-card ${showBorder ? 'with-border' : ''}`}
         style={{
           width: `${baseW}px`,
           height: `var(--card-h)`,
           borderRadius: `var(--radius-card)`,
           borderColor: fg,
           borderWidth: showBorder ? '2px' : '0px'
         }}>

      {/* Top part - Dynamic Background */}
      <div className="card-top"
           style={{
             background: bg,
             color: fg,
             padding: `1.5rem`,
             justifyContent: fontTestMode ? 'center' : 'flex-start'
           }}>

        <div className="sparkles-container">
           {isCute && sparkles.map(s => <Sparkle key={s.id} style={s.style} />)}
        </div>

        {tension >= tensionLimit && (
          <div className="tension-warning" title={`Vibration Score: ${tension}`}>
            <WarningIcon size={20} />
          </div>
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
                <div className="contrast-value" style={{ fontSize: `32px`, fontWeight: 'var(--fw-contrast-val)' }}>
                  {val}{suffix}
                </div>

                <div className="pass-indicators" style={{ fontSize: `14px` }}>
                  <div className="indicator-row">
                    {renderStatus(isPass3)}
                    <span className="indicator-label">{mode === 'apca' ? 'Lc 30' : '3:1'}</span>
                  </div>
                  <div className="indicator-row">
                    {renderStatus(isPass45)}
                    <span className="indicator-label">{mode === 'apca' ? 'Lc 45' : '4.5:1'}</span>
                  </div>
                  <div className="indicator-row">
                    {renderStatus(isPass7)}
                    <span className="indicator-label">{mode === 'apca' ? 'Lc 75' : '7:1'}</span>
                  </div>
                </div>

                <div className="hex-labels" style={{ fontSize: `10px` }}>
                  <div className="hex-line"><span>BG</span> <span className="mono">{bg}</span></div>
                  <div className="hex-line"><span>FG</span> <span className="mono">{fg}</span></div>
                </div>
            </div>
        )}
      </div>

      {/* Bottom part - Persistent Background */}
      <div className="card-bottom" style={{
           padding: `1rem 1.5rem`,
           fontSize: `11px`,
           height: `var(--card-bottom-h)`,
           borderRadius: `0 0 var(--radius-card) var(--radius-card)`
      }}>
        <div className="bottom-info">
          <div className="pair-label">{bg} ⇆ {fg}</div>
          <div className="pair-value">{val}{suffix}</div>
        </div>

        <div className="bottom-status">
          <span className="status-item">{renderStatus(isPass3)} <span className="status-text">Icons</span></span>
          <span className="status-item">{renderStatus(isPass45)} <span className="status-text">AA</span></span>
          <span className="status-item">{renderStatus(isPass7)} <span className="status-text">AAA</span></span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Card);
