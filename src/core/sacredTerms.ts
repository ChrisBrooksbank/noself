import type { SacredTerm } from '../types/sacred-terms.js';

interface SacredTermSpanOptions {
    /** Optional counterpart term in the other language (Pali ↔ Sanskrit) */
    counterpart?: SacredTerm;
}

/**
 * Returns an HTML string for an interactive sacred-term span.
 * Data attributes carry all metadata so the popover handler stays pure.
 */
export function renderSacredTermSpan(
    term: SacredTerm,
    opts: SacredTermSpanOptions = {},
): string {
    const attrs: string[] = [
        `class="sacred-term"`,
        `tabindex="0"`,
        `role="button"`,
        `aria-haspopup="true"`,
        `data-phonetic="${escAttr(term.phonetic)}"`,
        `data-literal="${escAttr(term.literal)}"`,
        `data-language="${escAttr(term.language)}"`,
    ];

    if (term.etymology) {
        attrs.push(`data-etymology="${escAttr(term.etymology)}"`);
    }
    if (opts.counterpart) {
        attrs.push(`data-counterpart-text="${escAttr(opts.counterpart.text)}"`);
        attrs.push(`data-counterpart-language="${escAttr(opts.counterpart.language)}"`);
        attrs.push(`data-counterpart-phonetic="${escAttr(opts.counterpart.phonetic)}"`);
        attrs.push(`data-counterpart-literal="${escAttr(opts.counterpart.literal)}"`);
    }

    return `<span ${attrs.join(' ')}>${escHtml(term.text)}</span>`;
}

/**
 * Attaches a singleton delegated click/keyboard listener to `root`.
 * One popover element is shared and repositioned on each activation.
 * Returns a cleanup function that removes listeners and the popover.
 */
export function initSacredTermTooltips(root: HTMLElement): () => void {
    const popover = document.createElement('div');
    popover.className = 'sacred-term-popover';
    popover.setAttribute('role', 'tooltip');
    popover.setAttribute('aria-live', 'polite');
    popover.hidden = true;
    document.body.appendChild(popover);

    let activeTerm: HTMLElement | null = null;

    function showPopover(target: HTMLElement): void {
        activeTerm = target;

        const phonetic = target.dataset['phonetic'] ?? '';
        const literal = target.dataset['literal'] ?? '';
        const etymology = target.dataset['etymology'] ?? '';
        const language = target.dataset['language'] ?? '';
        const counterpartText = target.dataset['counterpartText'] ?? '';
        const counterpartLanguage = target.dataset['counterpartLanguage'] ?? '';
        const counterpartPhonetic = target.dataset['counterpartPhonetic'] ?? '';
        const counterpartLiteral = target.dataset['counterpartLiteral'] ?? '';

        const langLabel =
            language === 'pali'
                ? 'Pāli'
                : language === 'sanskrit'
                  ? 'Sanskrit'
                  : 'Hybrid';

        let html = `<div class="sacred-term-popover__header">
            <span class="sacred-term-popover__lang">${langLabel}</span>
        </div>`;

        if (phonetic) {
            html += `<div class="sacred-term-popover__row">
                <span class="sacred-term-popover__label">Pronunciation</span>
                <span class="sacred-term-popover__value">${escHtml(phonetic)}</span>
            </div>`;
        }

        if (literal) {
            html += `<div class="sacred-term-popover__row">
                <span class="sacred-term-popover__label">Meaning</span>
                <span class="sacred-term-popover__value">${escHtml(literal)}</span>
            </div>`;
        }

        if (etymology) {
            html += `<div class="sacred-term-popover__row">
                <span class="sacred-term-popover__label">Etymology</span>
                <span class="sacred-term-popover__value">${escHtml(etymology)}</span>
            </div>`;
        }

        if (counterpartText) {
            const cpLang =
                counterpartLanguage === 'pali'
                    ? 'Pāli'
                    : counterpartLanguage === 'sanskrit'
                      ? 'Sanskrit'
                      : counterpartLanguage;
            html += `<div class="sacred-term-popover__row sacred-term-popover__counterpart">
                <span class="sacred-term-popover__label">${cpLang}</span>
                <span class="sacred-term-popover__value">
                    ${escHtml(counterpartText)}
                    ${counterpartPhonetic ? `<span class="sacred-term-popover__phonetic">${escHtml(counterpartPhonetic)}</span>` : ''}
                    ${counterpartLiteral ? `<span class="sacred-term-popover__literal">${escHtml(counterpartLiteral)}</span>` : ''}
                </span>
            </div>`;
        }

        popover.innerHTML = html;
        popover.hidden = false;
        target.setAttribute('aria-expanded', 'true');
        positionPopover(target);
    }

    function hidePopover(): void {
        popover.hidden = true;
        if (activeTerm) {
            activeTerm.setAttribute('aria-expanded', 'false');
            activeTerm = null;
        }
    }

    function positionPopover(target: HTMLElement): void {
        const rect = target.getBoundingClientRect();
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;

        const top = rect.bottom + scrollY + 6;
        let left = rect.left + scrollX;

        // Keep popover within viewport
        const popoverWidth = 260;
        const viewportWidth = window.innerWidth;
        if (left + popoverWidth > viewportWidth - 8) {
            left = viewportWidth - popoverWidth - 8;
        }
        if (left < 8) left = 8;

        popover.style.top = `${top}px`;
        popover.style.left = `${left}px`;
    }

    function onRootClick(e: Event): void {
        const target = (e.target as HTMLElement).closest(
            '.sacred-term',
        ) as HTMLElement | null;
        if (target) {
            e.stopPropagation();
            if (activeTerm === target) {
                hidePopover();
            } else {
                showPopover(target);
            }
            return;
        }
        // Click outside a term — close if open
        if (!popover.hidden && !popover.contains(e.target as Node)) {
            hidePopover();
        }
    }

    function onRootKeydown(e: KeyboardEvent): void {
        const target = (e.target as HTMLElement).closest(
            '.sacred-term',
        ) as HTMLElement | null;
        if (target && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            if (activeTerm === target) {
                hidePopover();
            } else {
                showPopover(target);
            }
        }
    }

    function onDocKeydown(e: KeyboardEvent): void {
        if (e.key === 'Escape' && !popover.hidden) {
            hidePopover();
        }
    }

    function onDocClick(e: Event): void {
        if (!popover.hidden && !popover.contains(e.target as Node)) {
            hidePopover();
        }
    }

    root.addEventListener('click', onRootClick);
    root.addEventListener('keydown', onRootKeydown);
    document.addEventListener('keydown', onDocKeydown);
    document.addEventListener('click', onDocClick);

    return () => {
        root.removeEventListener('click', onRootClick);
        root.removeEventListener('keydown', onRootKeydown);
        document.removeEventListener('keydown', onDocKeydown);
        document.removeEventListener('click', onDocClick);
        popover.remove();
    };
}

function escAttr(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function escHtml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
