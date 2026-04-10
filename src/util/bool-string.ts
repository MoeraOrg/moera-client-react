export type BooleanString = "false" | "true";
export type BooleanOrNullString = "null" | BooleanString;

export const toBooleanString = (value: boolean): BooleanString => value ? "true" : "false";

export const toBooleanOrNullString = (value: boolean | null): BooleanOrNullString =>
    value == null ? "null" : toBooleanString(value);

export const toBoolean = (value: string): boolean => value === "true";

export const toBooleanOrNull = (value: string): boolean | null =>
    value === "null" ? null : toBoolean(value);
