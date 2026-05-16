import React from 'react';
import './Common.css';

export const RangeSlider = ({ label, value, min, max, step, onChange, thresholds, unit = "", icon: Icon, style }) => (
  <div className="slider-group" style={style}>
    <div className="slider-header">
      <div className="label-with-icon">
        {Icon && <span className="slider-icon"><Icon size={12} /></span>}
        <label className="slider-label">{label}</label>
      </div>
      <span className="slider-value">{value === Infinity ? '∞' : value}{unit}</span>
    </div>
    <div className="slider-track-container">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value === Infinity ? max : value}
          onChange={(e) => onChange(Number(e.target.value) === max && max === 21 ? Infinity : Number(e.target.value))}
        />
        <div className="slider-thresholds">
          {thresholds.map(t => {
            const val = t === Infinity ? max : t;
            const percent = (val - min) / (max - min) * 100;
            return (
              <button
                key={t}
                onClick={() => onChange(t)}
                className={`threshold-btn ${value === t ? 'active' : ''}`}
                style={{ left: `${percent}%` }}
              >
                {t}
              </button>
            );
          })}
        </div>
    </div>
  </div>
);

export const SegmentedControl = ({ options, value, onChange, label }) => (
  <div className="segmented-group">
    <label className="segmented-label">{label}</label>
    <div className="segmented-control">
      {options.map(opt => (
        <div
          key={opt.value}
          className={`segmented-item ${value === opt.value ? 'active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </div>
      ))}
    </div>
  </div>
);

export const Collapsible = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  return (
    <div className="collapsible-container">
      <div className="collapsible-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span>{title}</span>
        <span className="chevron" style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}>▼</span>
      </div>
      {isOpen && <div className="collapsible-content">{children}</div>}
    </div>
  );
};

export const Toggle = ({ label, active, onChange, icon: Icon }) => (
  <div className="toggle-container">
    <div className="label-with-icon">
        {Icon && <span className="slider-icon"><Icon size={12} /></span>}
        <label className="toggle-label">{label}</label>
    </div>
    <button onClick={() => onChange(!active)} className={`toggle-switch ${active ? 'active' : ''}`}>
        <div className="toggle-handle">
            <div className={`toggle-status-dot ${active ? 'active' : ''}`}></div>
        </div>
    </button>
  </div>
);
