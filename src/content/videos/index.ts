export interface Video {
    id: string;
    title: string;
    teacher: string;
    channel: string;
    channelUrl: string;
    videoUrl: string;
    duration: string;
    description: string;
    level: 1 | 2 | 3;
    tradition: string;
    topics: string[];
    relatedConcepts: string[];
}

export { loadVideos } from './loader.js';
