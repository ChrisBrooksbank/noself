/**
 * Converts plain-text YAML content into HTML.
 *
 * Rules:
 * - Paragraphs separated by blank lines become `<p>` elements.
 * - Paragraphs starting with `> ` become `<blockquote>` elements.
 */
export function formatText(text: string): string {
    const paragraphs = text
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

    return paragraphs
        .map((p) => {
            if (p.startsWith('> ')) {
                const content = p
                    .split('\n')
                    .map((line) => (line.startsWith('> ') ? line.slice(2) : line))
                    .join('\n')
                    .trim();
                return `<blockquote>${content}</blockquote>`;
            }
            return `<p>${p.replace(/\n/g, ' ')}</p>`;
        })
        .join('');
}
