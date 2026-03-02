export type Theme = 'dark' | 'light' | 'auto';
export type FontSize = 'small' | 'medium' | 'large' | 'xl';
export type ExpertiseLevel = 1 | 2 | 3;

const THEME_KEY = 'noself:theme';
const FONT_SIZE_KEY = 'noself:fontSize';
const EXPERTISE_KEY = 'noself:expertiseLevel';
const SHOW_VIDEO_LINKS_KEY = 'noself:showVideoLinks';

const THEMES: Theme[] = ['dark', 'light', 'auto'];
const FONT_SIZES: FontSize[] = ['small', 'medium', 'large', 'xl'];
const EXPERTISE_LEVELS: ExpertiseLevel[] = [1, 2, 3];

function isTheme(value: unknown): value is Theme {
    return THEMES.includes(value as Theme);
}

function isFontSize(value: unknown): value is FontSize {
    return FONT_SIZES.includes(value as FontSize);
}

function isExpertiseLevel(value: unknown): value is ExpertiseLevel {
    return EXPERTISE_LEVELS.includes(value as ExpertiseLevel);
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

export function getExpertiseLevel(): ExpertiseLevel {
    const stored = Number(localStorage.getItem(EXPERTISE_KEY));
    return isExpertiseLevel(stored) ? stored : 1;
}

export function setExpertiseLevel(level: ExpertiseLevel): void {
    localStorage.setItem(EXPERTISE_KEY, String(level));
    applyExpertiseLevel(level);
}

export function getShowVideoLinks(): boolean {
    const stored = localStorage.getItem(SHOW_VIDEO_LINKS_KEY);
    return stored === null ? true : stored === 'true';
}

export function setShowVideoLinks(show: boolean): void {
    localStorage.setItem(SHOW_VIDEO_LINKS_KEY, String(show));
    applyShowVideoLinks(show);
}

function applyShowVideoLinks(show: boolean): void {
    document.documentElement.setAttribute('data-show-videos', String(show));
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

function applyExpertiseLevel(level: ExpertiseLevel): void {
    document.documentElement.setAttribute('data-level', String(level));
}

export function initPreferences(): void {
    applyTheme(getTheme());
    applyFontSize(getFontSize());
    applyExpertiseLevel(getExpertiseLevel());
    applyShowVideoLinks(getShowVideoLinks());
}
