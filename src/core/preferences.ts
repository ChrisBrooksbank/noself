export type Theme = 'dark' | 'light' | 'auto';
export type FontSize = 'small' | 'medium' | 'large' | 'xl';

const THEME_KEY = 'noself:theme';
const FONT_SIZE_KEY = 'noself:fontSize';

const THEMES: Theme[] = ['dark', 'light', 'auto'];
const FONT_SIZES: FontSize[] = ['small', 'medium', 'large', 'xl'];

function isTheme(value: unknown): value is Theme {
    return THEMES.includes(value as Theme);
}

function isFontSize(value: unknown): value is FontSize {
    return FONT_SIZES.includes(value as FontSize);
}

export function getTheme(): Theme {
    const stored = localStorage.getItem(THEME_KEY);
    return isTheme(stored) ? stored : 'dark';
}

export function setTheme(theme: Theme): void {
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
}

export function getFontSize(): FontSize {
    const stored = localStorage.getItem(FONT_SIZE_KEY);
    return isFontSize(stored) ? stored : 'medium';
}

export function setFontSize(size: FontSize): void {
    localStorage.setItem(FONT_SIZE_KEY, size);
    applyFontSize(size);
}

function applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);

    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) {
        if (theme === 'light') {
            meta.content = '#faf8f5';
        } else if (theme === 'auto') {
            meta.content = window.matchMedia('(prefers-color-scheme: light)').matches
                ? '#faf8f5'
                : '#1a1a2e';
        } else {
            meta.content = '#1a1a2e';
        }
    }
}

function applyFontSize(size: FontSize): void {
    document.documentElement.setAttribute('data-font-size', size);
}

export function initPreferences(): void {
    applyTheme(getTheme());
    applyFontSize(getFontSize());
}
