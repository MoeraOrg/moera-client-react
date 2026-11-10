import { PrincipalValue } from "api";

export type NameDisplayMode = "name" | "full-name" | "both";

export interface MinimalStoryInfo {
    id: string;
    publishedAt: number;
    pinned?: boolean | null;
    viewed?: boolean | null;
    moment: number;
    operations?: {
        view?: PrincipalValue | null;
        edit?: PrincipalValue | null;
        delete?: PrincipalValue | null;
    } | null;
}
