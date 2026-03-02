import { parse } from 'yaml';
import { z } from 'zod';
import type { Video } from './index.js';

const videoSchema = z.object({
    id: z.string(),
    title: z.string(),
    teacher: z.string(),
    channel: z.string(),
    channelUrl: z.string().url(),
    videoUrl: z.string().url(),
    duration: z.string(),
    description: z.string(),
    level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    tradition: z.string(),
    topics: z.array(z.string()).default([]),
    relatedConcepts: z.array(z.string()).default([]),
});

const videosFileSchema = z.array(videoSchema);

const rawYaml = import.meta.glob('./*.yaml', {
    query: '?raw',
    import: 'default',
    eager: true,
});

let cachedVideos: Video[] | null = null;

export function loadVideos(): Video[] {
    if (cachedVideos) {
        return cachedVideos;
    }

    const videos: Video[] = [];

    for (const [path, raw] of Object.entries(rawYaml)) {
        if (typeof raw !== 'string') {
            throw new Error(`Expected string content for ${path}`);
        }

        const parsed = parse(raw) as unknown;
        const result = videosFileSchema.safeParse(parsed);

        if (!result.success) {
            throw new Error(`Invalid videos in ${path}: ${result.error.message}`);
        }

        videos.push(...(result.data as Video[]));
    }

    cachedVideos = videos;
    return videos;
}
