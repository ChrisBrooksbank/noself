export function readStorage(key: string): string | null {
    try {
        return window.localStorage.getItem(key);
    } catch {
        return null;
    }
}

export function writeStorage(key: string, value: string): void {
    try {
        window.localStorage.setItem(key, value);
    } catch {
        // Storage can be unavailable in private browsing or strict privacy modes.
    }
}

export function removeStorage(key: string): void {
    try {
        window.localStorage.removeItem(key);
    } catch {
        // Storage can be unavailable in private browsing or strict privacy modes.
    }
}
