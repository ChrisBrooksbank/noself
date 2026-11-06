// Regenerates the animated GIFs in docs/images.
// Needs the preview server on :4173 and ffmpeg on PATH.
// Usage: npm run build && npm run preview, then: node docs/make-gifs.mjs
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';

const BASE = 'http://localhost:4173/';
const TMP = 'test-results/gif-frames';

const browser = await chromium.launch();

async function record(name, scenario) {
    const dir = `${TMP}/${name}`;
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });

    const context = await browser.newContext({
        viewport: { width: 390, height: 760 },
        deviceScaleFactor: 1,
        colorScheme: 'light',
    });
    const page = await context.newPage();
    await page.addInitScript(() => {
        localStorage.setItem('noself:expertiseLevel', '3');
        localStorage.setItem('noself:theme', 'light');
    });
    await page.clock.install();

    const frames = [];
    const shot = async (seconds) => {
        const file = `f${String(frames.length).padStart(3, '0')}.png`;
        await page.screenshot({ path: `${dir}/${file}` });
        frames.push({ file, seconds });
    };

    await scenario(page, shot);
    await context.close();

    const list =
        frames.map((f) => `file '${f.file}'\nduration ${f.seconds}`).join('\n') +
        `\nfile '${frames.at(-1).file}'\n`;
    writeFileSync(`${dir}/list.txt`, list);
    execFileSync(
        'ffmpeg',
        [
            '-y',
            '-loglevel',
            'error',
            '-f',
            'concat',
            '-safe',
            '0',
            '-i',
            `${dir}/list.txt`,
            '-vf',
            'scale=320:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer:bayer_scale=4',
            `docs/images/${name}.gif`,
        ],
        { stdio: 'inherit' },
    );
    console.log(`wrote docs/images/${name}.gif from ${frames.length} frames`);
}

// A guided Mettā meditation: the instruction changes as the sit unfolds.
await record('meditation', async (page, shot) => {
    await page.goto(`${BASE}#/practice/meditate`);
    await page.waitForTimeout(900);
    await shot(2.5);
    await page.goto(`${BASE}#/practice/meditate/metta?duration=10`);
    await page.waitForTimeout(900);
    await shot(2);
    await page.getByRole('button', { name: 'Begin' }).click();
    await page.clock.runFor(1500);
    await page.waitForTimeout(300);
    await shot(3);
    // Jump through the session; each pause lands on a different step.
    for (let i = 0; i < 6; i++) {
        await page.clock.runFor(90_000);
        await shot(3);
    }
    await page.clock.runFor(60_000);
    await shot(2);
});

// The 108-bead mala counter, with a quarter-mala bell and the closing line.
await record('mala', async (page, shot) => {
    await page.goto(`${BASE}#/practice/mantra/avalokiteshvara`);
    await page.waitForTimeout(900);
    await shot(3);
    await page.goto(`${BASE}#/practice/mantra/avalokiteshvara/chant`);
    await page.waitForTimeout(900);
    await shot(1.5);
    const tap = page.getByRole('button', { name: 'Count one repetition' });
    for (let i = 1; i <= 108; i++) {
        await tap.click();
        if (i <= 6 || i % 9 === 0 || i === 27 || i === 108)
            await shot(i === 108 ? 3 : 0.18);
    }
});

await browser.close();
