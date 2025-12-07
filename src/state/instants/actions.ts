import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";

export type OpenInstantsPopoverAction = ActionWithoutPayload<"OPEN_INSTANTS_POPOVER">;
export const openInstantsPopover = (): OpenInstantsPopoverAction =>
    actionWithoutPayload("OPEN_INSTANTS_POPOVER");

export type CloseInstantsPopoverAction = ActionWithoutPayload<"CLOSE_INSTANTS_POPOVER">;
export const closeInstantsPopover = (): CloseInstantsPopoverAction =>
    actionWithoutPayload("CLOSE_INSTANTS_POPOVER");

export type InstantsBorderSetAction = ActionWithPayload<"INSTANTS_BORDER_SET", {
    border: number;
}>;
export const instantsBorderSet = (border: number): InstantsBorderSetAction =>
    actionWithPayload("INSTANTS_BORDER_SET", {border});

export type InstantsMarkViewedAction = ActionWithoutPayload<"INSTANTS_MARK_VIEWED">;
export const instantsMarkViewed = (): InstantsMarkViewedAction =>
    actionWithoutPayload("INSTANTS_MARK_VIEWED");

export type InstantsAnyAction =
    OpenInstantsPopoverAction
    | CloseInstantsPopoverAction
    | InstantsBorderSetAction
    | InstantsMarkViewedAction;
