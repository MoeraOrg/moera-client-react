import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { StoryInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { getHomeFriendsId } from "state/home/selectors";
import { nodeCardPrepare } from "state/nodecards/actions";
import { getNodeCard } from "state/nodecards/selectors";
import { friendshipUpdate } from "state/people/actions";
import {
    InstantStoryButtons,
    InstantStoryButtonsActionSupplier,
    InstantStoryButtonsProps
} from "ui/instant/buttons/InstantStoryButtons";

type Props = InstantStoryButtonsProps & ConnectedProps<typeof connector>;

function InstantStoryFriendButtons({story, friendship, friendsId, friendshipUpdate}: Props) {
    const {t} = useTranslation();

    const friend = story.summaryData?.friend;
    if (friend?.friendGroupTitle != null && friend.friendGroupTitle !== "t:friends") {
        return null;
    }

    const onAddFriend = () => {
        if (story.remoteNodeName != null && friendsId != null) {
            friendshipUpdate(story.remoteNodeName, [friendsId], story.id);
        }
    }

    return (
        <InstantStoryButtons story={story} accepting={friendship?.updating ?? false}
                             accepted={(friendship?.loaded ?? false) && friendship?.groups != null
                                 && friendship.groups.length > 0}
                             acceptTitle={t("add-friend")} acceptedTitle={t("you-friends")}
                             onAccept={onAddFriend}/>
    )
}

export const instantStoryFriendAction: InstantStoryButtonsActionSupplier =
    (story: StoryInfo) => story.remoteNodeName != null ? nodeCardPrepare(story.remoteNodeName) : null;

const connector = connect(
    (state: ClientState, ownProps: InstantStoryButtonsProps) => ({
        friendship: ownProps.story.remoteNodeName != null
            ? getNodeCard(state, ownProps.story.remoteNodeName)?.friendship
            : null,
        friendsId: getHomeFriendsId(state)
    }),
    { friendshipUpdate }
);

export default connector(InstantStoryFriendButtons);
