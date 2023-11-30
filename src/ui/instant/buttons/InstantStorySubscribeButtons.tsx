import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { StoryInfo } from "api";
import { ClientState } from "state/state";
import { feedSubscribe } from "state/feeds/actions";
import { nodeCardPrepare } from "state/nodecards/actions";
import { getNodeCard } from "state/nodecards/selectors";
import { InstantStoryButtonsActionSupplier } from "ui/instant/instant-types";
import { InstantStoryButtons, InstantStoryButtonsProps } from "ui/instant/buttons/InstantStoryButtons";

export default function InstantStorySubscribeButtons({story, hide}: InstantStoryButtonsProps) {
    const subscription = useSelector((state: ClientState) => getNodeCard(state, story.remoteNodeName)?.subscription);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onSubscribe = () => {
        if (story.remoteNodeName != null) {
            dispatch(feedSubscribe(story.remoteNodeName, "timeline", story.id));
        }
    }

    return (
        <InstantStoryButtons story={story} hide={hide} ready={subscription?.loaded ?? false}
                             accepting={subscription?.subscribing ?? false}
                             accepted={subscription?.subscription != null}
                             acceptTitle={t("subscribe-back")} acceptedTitle={t("you-subscribed")}
                             onAccept={onSubscribe}/>
    )
}

export const instantStorySubscribeAction: InstantStoryButtonsActionSupplier =
    (story: StoryInfo) => story.remoteNodeName != null ? nodeCardPrepare(story.remoteNodeName) : null;
