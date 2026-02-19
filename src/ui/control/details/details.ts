import "./details.css";

export type DetailsSummaryStyle = "normal" | "bold" | "h1" | "h2" | "h3" | "h4" | "h5";

export const detailsSummaryStyleToClassName = (style: DetailsSummaryStyle): string | undefined =>
    style === "normal" ? undefined : (style === "bold" ? "fw-bold" : style.replace("h", "fs-"));

export const detailsSummaryClassNameToStyle = (className: string | null | undefined): DetailsSummaryStyle =>
    className == null
        ? "normal"
        : className === "fw-bold"
            ? "bold"
            : className.startsWith("fs-") ? `h${className.slice(3)}` as DetailsSummaryStyle : "normal";
