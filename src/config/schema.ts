import { z } from 'zod';

export const appConfigSchema = z.object({
    appTitle: z.string().default('noself'),
    debug: z.boolean().default(false),
    logLevel: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
    apiBaseUrl: z.string().url().optional(),
});

export type AppConfig = z.infer<typeof appConfigSchema>;
