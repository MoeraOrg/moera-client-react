import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { StoryInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { nodeCardPrepare } from "state/nodecards/actions";
import { getNodeCard } from "state/nodecards/selectors";
import { friendshipUpdate } from "state/people/actions";
import {
    InstantStoryButtons,
    InstantStoryButtonsActionSupplier,
    InstantStoryButtonsProps
} from "ui/instant/buttons/InstantStoryButtons";

type Props = InstantStoryButtonsProps & ConnectedProps<typeof connector>;

function InstantStoryFriendGroupButtons({story, friendship, friendshipUpdate}: Props) {
    const {t} = useTranslation();

    const friendGroupIds = friendship?.groups?.map(fg => fg.id) ?? [];
    const friendGroupId = story.summaryData?.friendGroup?.id;

    const onAddFriend = () => {
        if (story.remoteNodeName != null && friendGroupId != null) {
            friendshipUpdate(story.remoteNodeName, [...friendGroupIds, friendGroupId], story.id);
        }
    }

    return (
        <InstantStoryButtons story={story} ready={friendship?.loaded ?? false} accepting={friendship?.updating ?? false}
                             accepted={friendGroupId != null && friendGroupIds.includes(friendGroupId)}
                             acceptTitle={t("add-friend")} acceptedTitle={t("you-friends")}
                             onAccept={onAddFriend}/>
    )
}

export const instantStoryFriendGroupAction: InstantStoryButtonsActionSupplier =
    (story: StoryInfo) => story.remoteNodeName != null ? nodeCardPrepare(story.remoteNodeName) : null;

const connector = connect(
    (state: ClientState, ownProps: InstantStoryButtonsProps) => ({
        friendship: getNodeCard(state, ownProps.story.remoteNodeName)?.friendship
    }),
    { friendshipUpdate }
);

export default connector(InstantStoryFriendGroupButtons);
