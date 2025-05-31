export type BooleanString = "false" | "true";

export const toBooleanString = (value: boolean): BooleanString => value ? "true" : "false";

export const toBoolean = (value: string): boolean => value === "true";
