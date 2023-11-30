import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { StoryInfo } from "api";
import { ClientState } from "state/state";
import { getHomeFriendsId } from "state/home/selectors";
import { nodeCardPrepare } from "state/nodecards/actions";
import { getNodeCard } from "state/nodecards/selectors";
import { friendshipUpdate } from "state/people/actions";
import { InstantStoryButtonsActionSupplier } from "ui/instant/instant-types";
import { InstantStoryButtons, InstantStoryButtonsProps } from "ui/instant/buttons/InstantStoryButtons";

export default function InstantStoryFriendButtons({story, hide}: InstantStoryButtonsProps) {
    const friendship = useSelector((state: ClientState) => getNodeCard(state, story.remoteNodeName)?.friendship);
    const friendsId = useSelector(getHomeFriendsId);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const friendGroup = story.summaryData?.friendGroup;
    if (friendGroup?.title != null && friendGroup.title !== "t:friends") {
        return null;
    }

    const onAddFriend = () => {
        if (story.remoteNodeName != null && friendsId != null) {
            dispatch(friendshipUpdate(story.remoteNodeName, [friendsId], story.id));
        }
    }

    return (
        <InstantStoryButtons story={story} hide={hide} ready={friendship?.loaded ?? false}
                             accepting={friendship?.updating ?? false}
                             accepted={friendship?.groups != null && friendship.groups.length > 0}
                             acceptTitle={t("add-friend")} acceptedTitle={t("you-friends")}
                             onAccept={onAddFriend}/>
    )
}

export const instantStoryFriendAction: InstantStoryButtonsActionSupplier =
    (story: StoryInfo) => story.remoteNodeName != null ? nodeCardPrepare(story.remoteNodeName) : null;
