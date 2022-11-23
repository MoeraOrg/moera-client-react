import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { StoryInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { feedSubscribe } from "state/feeds/actions";
import { nodeCardPrepare } from "state/nodecards/actions";
import { getNodeCard } from "state/nodecards/selectors";
import { storySatisfy } from "state/stories/actions";
import { Button } from "ui/control";
import { InstantStoryButtonsActionSupplier, InstantStoryButtonsProps } from "ui/instant/buttons/InstantStoryButtons";

type Props = InstantStoryButtonsProps & ConnectedProps<typeof connector>;

function InstantStorySubscribeButtons({story, subscription, feedSubscribe, storySatisfy}: Props) {
    const {t} = useTranslation();

    const onSubscribe = () => {
        if (story.remoteNodeName != null) {
            feedSubscribe(story.remoteNodeName, "timeline", story.id);
        }
    }

    const onIgnore = () => storySatisfy(":instant", story.id);

    return (
        <div className="buttons">
            {!subscription?.loaded || subscription.subscription == null ?
                !story.satisfied &&
                    <>
                        <Button variant="primary" size="sm" compact loading={subscription?.subscribing}
                                onClick={onSubscribe}>
                            {t("subscribe-back")}
                        </Button>
                        <Button variant="secondary" size="sm" compact onClick={onIgnore}>{t("ignore")}</Button>
                    </>
            :
                <span className="message">
                    <span className="check"><FontAwesomeIcon icon="check"/></span>
                    {t("you-subscribed")}
                </span>
            }
        </div>
    )
}

export const instantStorySubscribeAction: InstantStoryButtonsActionSupplier =
    (story: StoryInfo) => story.remoteNodeName != null ? nodeCardPrepare(story.remoteNodeName) : null;

const connector = connect(
    (state: ClientState, ownProps: InstantStoryButtonsProps) => ({
        subscription: ownProps.story.remoteNodeName != null
            ? getNodeCard(state, ownProps.story.remoteNodeName)?.subscription
            : null
    }),
    { feedSubscribe, storySatisfy }
);

export default connector(InstantStorySubscribeButtons);
