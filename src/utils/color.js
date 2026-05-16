/**
 * Color Utilities for WCAG and APCA calculations
 */

export const hexToRgb = (hex) => {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
};

export const luminance = (rgb) => {
  const t = (c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * t(rgb.r) + 0.7152 * t(rgb.g) + 0.0722 * t(rgb.b);
};

export const getContrastRatio = (hex1, hex2) => {
  const L1 = luminance(hexToRgb(hex1));
  const L2 = luminance(hexToRgb(hex2));
  return +((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)).toFixed(2);
};

export const getApcaContrast = (txtHex, bgHex) => {
  const txt = hexToRgb(txtHex);
  const bg = hexToRgb(bgHex);

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

export const getHsl = (hex) => {
  let { r, g, b } = hexToRgb(hex);
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
