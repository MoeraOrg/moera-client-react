import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { StoryInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { feedSubscribe } from "state/feeds/actions";
import { nodeCardPrepare } from "state/nodecards/actions";
import { getNodeCard } from "state/nodecards/selectors";
import { InstantStoryButtonsActionSupplier } from "ui/instant/instant-types";
import { InstantStoryButtons, InstantStoryButtonsProps } from "ui/instant/buttons/InstantStoryButtons";

type Props = InstantStoryButtonsProps & ConnectedProps<typeof connector>;

function InstantStorySubscribeButtons({story, hide, subscription, feedSubscribe}: Props) {
    const {t} = useTranslation();

    const onSubscribe = () => {
        if (story.remoteNodeName != null) {
            feedSubscribe(story.remoteNodeName, "timeline", story.id);
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

const connector = connect(
    (state: ClientState, ownProps: InstantStoryButtonsProps) => ({
        subscription: getNodeCard(state, ownProps.story.remoteNodeName)?.subscription
    }),
    { feedSubscribe }
);

export default connector(InstantStorySubscribeButtons);
