import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

// Types
export interface Pattern {
  type: string;
  name: string;
  description: string;
}

export interface Palette {
  id: number;
  name: string;
  colors: string[];
  description: string;
  is_preset: boolean;
  created_at: string;
  updated_at: string;
}

// API Functions
export const api = {
  // Health check
  health: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },

  // Patterns
  getPatterns: async () => {
    const response = await apiClient.get('/api/patterns');
    return response.data.patterns as Pattern[];
  },

  // Palettes
  getPalettes: async () => {
    const response = await apiClient.get('/api/palettes');
    return response.data as Palette[];
  },

  // Generate wallpaper (metadata)
  generateWallpaper: async (
    patternType: string,
    paletteIndex: number,
    seed: number,
    inverted: boolean
  ) => {
    const response = await apiClient.post('/api/wallpapers/generate', {
      pattern_type: patternType,
      palette_index: paletteIndex,
      seed,
      inverted,
    });
    return response.data;
  },

  // Get preview image
  getPreviewUrl: (
    patternType: string,
    paletteIndex: number,
    seed: number,
    inverted: boolean,
    width = 800,
    height = 600,
    patternType2?: string,
    blendRatio = 0.5
  ) => {
    let url = `${API_BASE_URL}/api/wallpapers/preview?pattern_type=${patternType}&palette_index=${paletteIndex}&seed=${seed}&inverted=${inverted}&width=${width}&height=${height}`;
    if (patternType2) url += `&pattern_type_2=${patternType2}&blend_ratio=${blendRatio}`;
    return url;
  },

  // Download desktop wallpaper
  downloadDesktop: async (
    patternType: string,
    paletteIndex: number,
    seed: number,
    inverted: boolean,
    patternType2?: string,
    blendRatio = 0.5
  ) => {
    let url = `${API_BASE_URL}/api/wallpapers/download/desktop?pattern_type=${patternType}&palette_index=${paletteIndex}&seed=${seed}&inverted=${inverted}`;
    if (patternType2) url += `&pattern_type_2=${patternType2}&blend_ratio=${blendRatio}`;
    const response = await apiClient.get(url, { responseType: 'blob' });
    return response.data;
  },

  // Download mobile wallpaper
  downloadMobile: async (
    patternType: string,
    paletteIndex: number,
    seed: number,
    inverted: boolean,
    patternType2?: string,
    blendRatio = 0.5
  ) => {
    let url = `${API_BASE_URL}/api/wallpapers/download/mobile?pattern_type=${patternType}&palette_index=${paletteIndex}&seed=${seed}&inverted=${inverted}`;
    if (patternType2) url += `&pattern_type_2=${patternType2}&blend_ratio=${blendRatio}`;
    const response = await apiClient.get(url, { responseType: 'blob' });
    return response.data;
  },
};
