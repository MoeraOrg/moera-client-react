import { StoryInfo } from "api/node/api-types";
import { ExtStoryInfo } from "state/feeds/state";
import { ClientAction } from "state/action";

export type InstantStoryButtonsActionSupplier = (story: StoryInfo) => ClientAction | null | undefined;

export interface InstantStoryButtonsProps {
    story: ExtStoryInfo;
}
