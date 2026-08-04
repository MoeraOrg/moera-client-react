import { PrivateMediaFileInfo } from "api";

export const UI_EVENT_COMMENT_QUOTE = "commentQuote";

export interface UiEventCommentQuoteDetail {
    html?: string;
    ownerName?: string;
    ownerFullName?: string | null;
}

export type UiEventCommentQuote = CustomEvent<UiEventCommentQuoteDetail>;

export const uiEventCommentQuote = (
    html?: string, ownerName?: string, ownerFullName?: string | null
): UiEventCommentQuote =>
    new CustomEvent(UI_EVENT_COMMENT_QUOTE, {
        detail: {html, ownerName, ownerFullName}
    });

export const UI_EVENT_OPEN_MENTION = "openMention";

export type UiEventOpenMention = CustomEvent<undefined>;

export const uiEventOpenMention = (): UiEventOpenMention =>
    new CustomEvent(UI_EVENT_OPEN_MENTION);

export const UI_EVENT_MEDIA_COMPRESSED = "mediaCompressed";

export interface UiEventMediaCompressedDetail {
    originalMediaId: string;
    originalMediaHash: string;
    media: PrivateMediaFileInfo;
}

export type UiEventMediaCompressed = CustomEvent<UiEventMediaCompressedDetail>;

export const uiEventMediaCompressed = (
    originalMediaId: string, originalMediaHash: string, media: PrivateMediaFileInfo
): UiEventMediaCompressed =>
    new CustomEvent(UI_EVENT_MEDIA_COMPRESSED, {
        detail: {originalMediaId, originalMediaHash, media}
    });
