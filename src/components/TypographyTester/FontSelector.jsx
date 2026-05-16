import React from 'react';
import './TypographyTester.css';

const FONT_CATEGORIES = {
  Sans: ['Inter', 'Montserrat', 'Roboto Condensed', 'Open Sans', 'Lato'],
  Serif: ['Playfair Display', 'Lora', 'Merriweather', 'Crimson Text', 'PT Serif'],
  Mono: ['JetBrains Mono', 'Roboto Mono', 'Source Code Pro', 'Fira Code', 'Space Mono'],
  Display: ['Oswald', 'Bebas Neue', 'Abril Fatface', 'Righteous', 'Cinzel']
};

export const FontSelector = ({ currentFont, onSelect }) => {
  const [activeCat, setActiveCat] = React.useState(null);

  const handleSelect = (f) => {
    onSelect(`'${f}', sans-serif`);
    // Preload font if not already loaded (simplified)
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${f.replace(/ /g, '+')}:wght@100..900&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  };

  return (
    <div className="font-selector">
      <div className="category-tabs">
        {Object.keys(FONT_CATEGORIES).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCat(activeCat === cat ? null : cat)}
            className={`category-btn ${activeCat === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>
      {activeCat && (
        <div className="font-grid">
          {FONT_CATEGORIES[activeCat].map(f => (
            <button
              key={f}
              onClick={() => handleSelect(f)}
              className={`font-item-btn ${currentFont.includes(f) ? 'active' : ''}`}
            >
              {f}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
