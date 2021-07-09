import { ActionBase } from "state/action-base";

export const SHARE_DIALOG_PREPARE = "SHARE_DIALOG_PREPARE";
type ShareDialogPrepareAction = ActionBase<typeof SHARE_DIALOG_PREPARE, {
    title: string;
    nodeName: string;
    href: string;
}>;
export const shareDialogPrepare = (title: string, nodeName: string, href: string): ShareDialogPrepareAction => ({
    type: SHARE_DIALOG_PREPARE,
    payload: {title, nodeName, href}
});

export const OPEN_SHARE_DIALOG = "OPEN_SHARE_DIALOG";
type OpenShareDialogAction = ActionBase<typeof OPEN_SHARE_DIALOG, {
    title: string;
    url: string;
}>;
export const openShareDialog = (title: string, url: string): OpenShareDialogAction => ({
    type: OPEN_SHARE_DIALOG,
    payload: {title, url}
});

export const CLOSE_SHARE_DIALOG = "CLOSE_SHARE_DIALOG";
type CloseShareDialogAction = ActionBase<typeof CLOSE_SHARE_DIALOG, never>;
export const closeShareDialog = (): CloseShareDialogAction => ({
    type: CLOSE_SHARE_DIALOG
});

export const SHARE_DIALOG_COPY_LINK = "SHARE_DIALOG_COPY_LINK";
type ShareDialogCopyLinkAction = ActionBase<typeof SHARE_DIALOG_COPY_LINK, {
    url: string;
}>;
export const shareDialogCopyLink = (url: string): ShareDialogCopyLinkAction => ({
    type: SHARE_DIALOG_COPY_LINK,
    payload: {url}
});

export type ShareDialogAnyAction =
    ShareDialogPrepareAction
    | OpenShareDialogAction
    | CloseShareDialogAction
    | ShareDialogCopyLinkAction;
