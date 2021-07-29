export type NameDisplayMode = "name" | "full-name" | "both";

export interface MinimalStoryInfo {
    id: string;
    publishedAt: number;
    pinned?: boolean | null;
    viewed?: boolean | null;
    moment: number;
    operations?: {
        edit?: string[] | null;
        delete?: string[] | null;
    } | null;
}
