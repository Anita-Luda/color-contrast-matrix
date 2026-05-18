/**
 * Color Utilities for WCAG and APCA calculations
 */

export const hexToRgb = (hex) => {
  let clean = hex.replace("#", "");
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
};

export const parseToRgb = (color) => {
  if (typeof color !== 'string') return { r: 0, g: 0, b: 0 };
  const str = color.trim().toLowerCase();

  // Hex
  if (str.startsWith('#')) {
    return hexToRgb(str);
  }

  // RGB / RGBA
  const rgbMatch = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10)
    };
  }

  // HSL / HSLA
  const hslMatch = str.match(/hsla?\((\d+),\s*([\d.]+)%,\s*([\d.]+)%(?:,\s*[\d.]+)?\)/);
  if (hslMatch) {
    const h = parseInt(hslMatch[1], 10) / 360;
    const s = parseFloat(hslMatch[2]) / 100;
    const l = parseFloat(hslMatch[3]) / 100;

    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  return { r: 0, g: 0, b: 0 };
};

export const rgbToHex = ({ r, g, b }) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

export const luminance = (rgb) => {
  const t = (c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * t(rgb.r) + 0.7152 * t(rgb.g) + 0.0722 * t(rgb.b);
};

export const getContrastRatio = (c1, c2) => {
  const L1 = luminance(parseToRgb(c1));
  const L2 = luminance(parseToRgb(c2));
  return +((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)).toFixed(2);
};

export const getApcaContrast = (txtCol, bgCol) => {
  const txt = parseToRgb(txtCol);
  const bg = parseToRgb(bgCol);

  const sRGBtoLin = (c) => Math.pow(c / 255, 2.218);

  const Ytxt = (0.2126 * sRGBtoLin(txt.r) + 0.7152 * sRGBtoLin(txt.g) + 0.0722 * sRGBtoLin(txt.b));
  const Ybg = (0.2126 * sRGBtoLin(bg.r) + 0.7152 * sRGBtoLin(bg.g) + 0.0722 * sRGBtoLin(bg.b));

  let Lc;
  if (Ybg > Ytxt) {
    Lc = (Math.pow(Ybg, 0.56) - Math.pow(Ytxt, 0.57)) * 1.14;
  } else {
    Lc = (Math.pow(Ybg, 0.65) - Math.pow(Ytxt, 0.62)) * 1.14;
  }

  const res = Math.round(Lc * 100);
  return Math.abs(res) < 8 ? 0 : res;
};

export const getHsl = (color) => {
  let { r, g, b } = parseToRgb(color);
  r /= 255; g /= 255; b /= 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

export const getVisualTensionScore = (c1, c2) => {
  const h1 = getHsl(c1);
  const h2 = getHsl(c2);

  const lumDiff = Math.abs(h1.l - h2.l);
  const hueDiff = Math.min(Math.abs(h1.h - h2.h), 360 - Math.abs(h1.h - h2.h));
  const avgSat = (h1.s + h2.s) / 2;

  let score = 0;
  if (avgSat > 20 && lumDiff < 50) {
    score += (avgSat / 100) * (hueDiff / 180) * (1 - lumDiff / 50) * 15;
  }
  if (avgSat > 40 && hueDiff > 100) {
    score += (avgSat / 100) * (hueDiff / 180) * 5;
  }

  return Math.min(10, Math.round(score * 10) / 10);
};

export const sortColors = (colors, sortBy = 'hue', order = 'asc') => {
  return [...colors].sort((a, b) => {
    const hA = getHsl(a);
    const hB = getHsl(b);

    let comparison = 0;
    if (sortBy === 'hue') {
      comparison = hA.h !== hB.h ? hA.h - hB.h : hA.l - hB.l;
    } else if (sortBy === 'lightness') {
      comparison = hA.l !== hB.l ? hA.l - hB.l : hA.h - hB.h;
    } else if (sortBy === 'hue-lum') {
      const hueGroupA = Math.floor(hA.h / 30);
      const hueGroupB = Math.floor(hB.h / 30);
      comparison = hueGroupA !== hueGroupB ? hueGroupA - hueGroupB : hA.l - hB.l;
    } else if (sortBy === 'lum-hue') {
      const lumGroupA = Math.floor(hA.l / 10);
      const lumGroupB = Math.floor(hB.l / 10);
      comparison = lumGroupA !== lumGroupB ? lumGroupA - lumGroupB : hA.h - hB.h;
    }

    return order === 'asc' ? comparison : -comparison;
  });
};
