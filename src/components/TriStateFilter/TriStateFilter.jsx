import React from 'react';
import './TriStateFilter.css';

const TriStateFilter = ({ color, state, onChange }) => {
  // state: 0 (neutral), 1 (include), -1 (exclude)

  const handleClick = () => {
    let nextState;
    if (state === 0) nextState = 1;
    else if (state === 1) nextState = -1;
    else nextState = 0;
    onChange(nextState);
  };

  const getClassName = () => {
    if (state === 1) return 'tri-state-filter included';
    if (state === -1) return 'tri-state-filter excluded';
    return 'tri-state-filter';
  };

  return (
    <div className={getClassName()} onClick={handleClick}>
      <div className="color-swatch" style={{ backgroundColor: color }}></div>
      <span className="color-code">{color}</span>
      <div className="status-dot-container">
        <div className={`status-dot ${state !== 0 ? 'active' : ''}`}
             style={{ backgroundColor: state === 1 ? 'var(--color-success)' : state === -1 ? 'var(--color-error)' : 'var(--neutral-200)' }}>
        </div>
      </div>
    </div>
  );
};

export default TriStateFilter;
