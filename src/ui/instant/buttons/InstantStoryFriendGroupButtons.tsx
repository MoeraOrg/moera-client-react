import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { StoryInfo } from "api";
import { ClientState } from "state/state";
import { nodeCardPrepare } from "state/nodecards/actions";
import { getNodeCard } from "state/nodecards/selectors";
import { friendshipUpdate } from "state/people/actions";
import { InstantStoryButtonsActionSupplier } from "ui/instant/instant-types";
import { InstantStoryButtons, InstantStoryButtonsProps } from "ui/instant/buttons/InstantStoryButtons";

export default function InstantStoryFriendGroupButtons({story, hide}: InstantStoryButtonsProps) {
    const friendship = useSelector((state: ClientState) => getNodeCard(state, story.remoteNodeName)?.friendship);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const friendGroupIds = friendship?.groups?.map(fg => fg.id) ?? [];
    const friendGroupId = story.summaryData?.friendGroup?.id;

    const onAddFriend = () => {
        if (story.remoteNodeName != null && friendGroupId != null) {
            dispatch(friendshipUpdate(story.remoteNodeName, [...friendGroupIds, friendGroupId], story.id));
        }
    }

    return (
        <InstantStoryButtons story={story} hide={hide} ready={friendship?.loaded ?? false}
                             accepting={friendship?.updating ?? false}
                             accepted={friendGroupId != null && friendGroupIds.includes(friendGroupId)}
                             acceptTitle={t("add-friend")} acceptedTitle={t("you-friends")}
                             onAccept={onAddFriend}/>
    )
}

export const instantStoryFriendGroupAction: InstantStoryButtonsActionSupplier =
    (story: StoryInfo) => story.remoteNodeName != null ? nodeCardPrepare(story.remoteNodeName) : null;
