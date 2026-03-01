import { describe, it, expect } from 'vitest';
import { formatText } from './formatText.js';

describe('formatText', () => {
    it('wraps a single paragraph in <p> tags', () => {
        expect(formatText('Hello world')).toBe('<p>Hello world</p>');
    });

    it('splits double newlines into separate <p> elements', () => {
        const result = formatText('First paragraph\n\nSecond paragraph');
        expect(result).toBe('<p>First paragraph</p><p>Second paragraph</p>');
    });

    it('handles multiple consecutive blank lines as one paragraph break', () => {
        const result = formatText('First\n\n\n\nSecond');
        expect(result).toBe('<p>First</p><p>Second</p>');
    });

    it('wraps block-quote paragraphs in <blockquote> tags', () => {
        const result = formatText('> This is a quote');
        expect(result).toBe('<blockquote>This is a quote</blockquote>');
    });

    it('strips the > prefix from each line in a blockquote', () => {
        const result = formatText('> Line one\n> Line two');
        expect(result).toBe('<blockquote>Line one\nLine two</blockquote>');
    });

    it('mixes regular paragraphs and blockquotes', () => {
        const input =
            'Intro text\n\n> A quoted passage\n> continues here\n\nFollowing paragraph';
        const result = formatText(input);
        expect(result).toBe(
            '<p>Intro text</p><blockquote>A quoted passage\ncontinues here</blockquote><p>Following paragraph</p>',
        );
    });

    it('collapses single newlines within a paragraph into spaces', () => {
        const result = formatText('Line one\nLine two');
        expect(result).toBe('<p>Line one Line two</p>');
    });

    it('returns empty string for empty input', () => {
        expect(formatText('')).toBe('');
    });

    it('returns empty string for whitespace-only input', () => {
        expect(formatText('   \n\n  ')).toBe('');
    });

    it('trims leading and trailing whitespace from paragraphs', () => {
        expect(formatText('  Hello  ')).toBe('<p>Hello</p>');
    });
});
