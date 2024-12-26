import { SelectFieldChoiceBase } from "ui/control/field";

export type RichTextImageStandardSize = "full" | "large" | "medium" | "small" | "tiny" | "custom";

export const STANDARD_SIZES: SelectFieldChoiceBase<RichTextImageStandardSize>[] = [
    {title: "image-size.full", value: "full"},
    {title: "image-size.large", value: "large"},
    {title: "image-size.medium", value: "medium"},
    {title: "image-size.small", value: "small"},
    {title: "image-size.tiny", value: "tiny"},
    {title: "image-size.custom", value: "custom"}
];

export function getImageDimensions(
    standardSize: RichTextImageStandardSize,
    customWidth: number | null | undefined,
    customHeight: number | null | undefined
): {
    width: number | null;
    height: number | null
} {
    switch (standardSize) {
        case "full":
            return {width: null, height: null};
        case "large":
            return {width: 770, height: 600};
        case "medium":
            return {width: 600, height: 465};
        case "small":
            return {width: 400, height: 310};
        case "tiny":
            return {width: 250, height: 195};
        case "custom":
            return {width: customWidth ?? null, height: customHeight ?? null};
    }
}

export function findStandardSize(
    width: number | null | undefined, height: number | null | undefined
): RichTextImageStandardSize {
    if (!width && !height) {
        return "full";
    }
    for (const size of STANDARD_SIZES) {
        if (size.value === "custom") {
            continue;
        }
        const {width: stdWidth, height: stdHeight} = getImageDimensions(size.value, null, null);
        if (stdWidth === width && stdHeight === height) {
            return size.value;
        }
    }
    return "custom";
}
