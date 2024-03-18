import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { RelNodeName } from "util/rel-node-name";

export type ShareDialogPrepareAction = ActionWithPayload<"SHARE_DIALOG_PREPARE", {
    nodeName: RelNodeName | string;
    href: string;
}>;
export const shareDialogPrepare = (nodeName: RelNodeName | string, href: string): ShareDialogPrepareAction =>
    actionWithPayload("SHARE_DIALOG_PREPARE", {nodeName, href});

export type OpenShareDialogAction = ActionWithPayload<"OPEN_SHARE_DIALOG", {
    title: string;
    url: string;
}>;
export const openShareDialog = (title: string, url: string): OpenShareDialogAction =>
    actionWithPayload("OPEN_SHARE_DIALOG", {title, url});

export type CloseShareDialogAction = ActionWithoutPayload<"CLOSE_SHARE_DIALOG">;
export const closeShareDialog = (): CloseShareDialogAction =>
    actionWithoutPayload("CLOSE_SHARE_DIALOG");

export type ShareDialogCopyLinkAction = ActionWithPayload<"SHARE_DIALOG_COPY_LINK", {
    url: string;
}>;
export const shareDialogCopyLink = (url: string): ShareDialogCopyLinkAction =>
    actionWithPayload("SHARE_DIALOG_COPY_LINK", {url});

export type SharePageCopyLinkAction = ActionWithPayload<"SHARE_PAGE_COPY_LINK", {
    nodeName: RelNodeName | string;
    href: string;
}>;
export const sharePageCopyLink = (nodeName: RelNodeName | string, href: string): SharePageCopyLinkAction =>
    actionWithPayload("SHARE_PAGE_COPY_LINK", {nodeName, href});

export type ShareDialogAnyAction =
    ShareDialogPrepareAction
    | OpenShareDialogAction
    | CloseShareDialogAction
    | ShareDialogCopyLinkAction
    | SharePageCopyLinkAction;
