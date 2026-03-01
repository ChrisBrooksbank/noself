export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    options: { maxRetries?: number; baseDelay?: number; maxDelay?: number } = {},
): Promise<T> {
    const { maxRetries = 3, baseDelay = 1000, maxDelay = 10000 } = options;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === maxRetries) throw error;
            const delay = Math.min(baseDelay * 2 ** attempt, maxDelay);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }

    throw new Error('Unreachable');
}

export function debounce<T extends (...args: Parameters<T>) => void>(
    fn: T,
    delay: number,
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    return (...args: Parameters<T>) => {
        if (timeoutId !== undefined) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

export function throttle<T extends (...args: Parameters<T>) => void>(
    fn: T,
    interval: number,
): (...args: Parameters<T>) => void {
    let lastCall = 0;

    return (...args: Parameters<T>) => {
        const now = Date.now();
        if (now - lastCall >= interval) {
            lastCall = now;
            fn(...args);
        }
    };
}

export class IntervalManager {
    private intervals: ReturnType<typeof setInterval>[] = [];

    add(callback: () => void, ms: number): ReturnType<typeof setInterval> {
        const id = setInterval(callback, ms);
        this.intervals.push(id);
        return id;
    }

    remove(id: ReturnType<typeof setInterval>): void {
        clearInterval(id);
        this.intervals = this.intervals.filter((i) => i !== id);
    }

    clearAll(): void {
        this.intervals.forEach((id) => clearInterval(id));
        this.intervals = [];
    }
}
