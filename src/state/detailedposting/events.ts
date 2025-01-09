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
