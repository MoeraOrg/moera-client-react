import { trigger } from "state/trigger";
import { isAtInstantsPage } from "state/navigation/selectors";
import { instantsMarkViewed } from "state/instants/actions";

export default [
    trigger("OPEN_INSTANTS_POPOVER", true, instantsMarkViewed),
    trigger("GO_TO_PAGE", isAtInstantsPage, instantsMarkViewed)
];
