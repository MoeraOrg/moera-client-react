import { SheriffMark } from "api/node/api-types";

interface SheriffControlled {
    sheriffs?: string[] | null;
    sheriffMarks?: SheriffMark[] | null;
}

export function isSheriffGoverned(object: SheriffControlled | null | undefined,
                                  sheriffName: string | null | undefined): boolean {
    return sheriffName != null && (object?.sheriffs?.includes(sheriffName) ?? false);
}

export function isSheriffMarked(object: SheriffControlled | null | undefined,
                                sheriffName: string | null | undefined): boolean {
    return sheriffName != null && object?.sheriffMarks?.find(sm => sm.sheriffName === sheriffName) != null;
}
