import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { StoryInfo } from "api";
import { ClientState } from "state/state";
import { isPermitted } from "state/node/selectors";
import { storyDelete, storyPinningUpdate, storyTypeBlock } from "state/stories/actions";
import { confirmBox } from "state/confirmbox/actions";
import { DropdownMenu } from "ui/control";
import { REL_CURRENT } from "util/rel-node-name";

interface Props {
    story: StoryInfo
}

export default function StoryMenu({story}: Props) {
    const storyEditable = useSelector((state: ClientState) => isPermitted("edit", story, "admin", state));
    const storyDeletable = useSelector((state: ClientState) => isPermitted("delete", story, "admin", state));
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onPin = () => dispatch(storyPinningUpdate(story.id, !story.pinned));

    const onDelete = () =>
        dispatch(confirmBox({
            message: t("delete-message"),
            yes: t("delete"),
            no: t("cancel"),
            onYes: storyDelete(REL_CURRENT, story),
            variant: "danger"
        }));

    const onTurnOff = () =>
        dispatch(confirmBox({
            message: t("want-turn-off-story-type", {type: t("story-type-plural." + story.storyType)}),
            yes: t("delete"),
            no: t("cancel"),
            onYes: storyTypeBlock(REL_CURRENT, story.storyType),
            variant: "danger"
        }));

    return (
        <DropdownMenu items={[
            {
                title: story != null && !story.pinned ? t("pin") : t("unpin"),
                nodeName: REL_CURRENT,
                href: "/news",
                onClick: onPin,
                show: storyEditable
            },
            {
                divider: true
            },
            {
                title: t("delete"),
                nodeName: REL_CURRENT,
                href: "/news",
                onClick: onDelete,
                show: storyDeletable
            },
            {
                title: t("turn-off"),
                nodeName: REL_CURRENT,
                href: "/news",
                onClick: onTurnOff,
                show: storyDeletable
            },
        ]}/>
    );
}
