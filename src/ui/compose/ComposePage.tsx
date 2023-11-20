import { useSelector } from 'react-redux';

import { PrincipalValue, SourceFormat } from "api";
import { ClientState } from "state/state";
import { getHomeOwnerAvatar, getHomeOwnerFullName, getHomeOwnerGender } from "state/home/selectors";
import { getPostingFeatures } from "state/compose/selectors";
import { getSetting } from "state/settings/selectors";
import ComposePageContent from "ui/compose/ComposePageContent";

export default function ComposePage() {
    const gender = useSelector(getHomeOwnerGender);
    const fullNameDefault = useSelector(getHomeOwnerFullName);
    const avatarDefault = useSelector(getHomeOwnerAvatar);
    const postingId = useSelector((state: ClientState) => state.compose.postingId);
    const features = useSelector(getPostingFeatures);
    const posting = useSelector((state: ClientState) => state.compose.posting);
    const draft = useSelector((state: ClientState) => state.compose.draft);
    const sharedText = useSelector((state: ClientState) => state.compose.sharedText);
    const sharedTextType = useSelector((state: ClientState) => state.compose.sharedTextType);
    const smileysEnabled = useSelector((state: ClientState) =>
        getSetting(state, "posting.smileys.enabled") as boolean);
    const newsFeedEnabled = useSelector((state: ClientState) =>
        getSetting(state, "posting.feed.news.enabled") as boolean);
    const avatarShapeDefault = useSelector((state: ClientState) =>
        getSetting(state, "avatar.shape.default") as string);
    const visibilityDefault = useSelector((state: ClientState) =>
        getSetting(state, "posting.visibility.default") as PrincipalValue);
    const commentsVisibilityDefault = useSelector((state: ClientState) =>
        getSetting(state, "posting.comments.visibility.default") as PrincipalValue);
    const commentAdditionDefault = useSelector((state: ClientState) =>
        getSetting(state, "posting.comments.addition.default") as PrincipalValue);
    const commentsHideDefault = useSelector((state: ClientState) =>
        getSetting(state, "posting.comments.hide.default") as boolean);
    const reactionsEnabledDefault = useSelector((state: ClientState) =>
        getSetting(state, "posting.reactions.enabled.default") as boolean);
    const reactionsNegativeEnabledDefault = useSelector((state: ClientState) =>
        getSetting(state, "posting.reactions.negative.enabled.default") as boolean);
    const reactionsPositiveDefault = useSelector((state: ClientState) =>
        getSetting(state, "posting.reactions.positive.default") as string);
    const reactionsNegativeDefault = useSelector((state: ClientState) =>
        getSetting(state, "posting.reactions.negative.default") as string);
    const reactionsVisibleDefault = useSelector((state: ClientState) =>
        getSetting(state, "posting.reactions.visible.default") as boolean);
    const reactionTotalsVisibleDefault = useSelector((state: ClientState) =>
        getSetting(state, "posting.reactions.totals-visible.default") as boolean);
    const sourceFormatDefault = useSelector((state: ClientState) =>
        getSetting(state, "posting.body-src-format.default") as SourceFormat);

    return <ComposePageContent gender={gender} fullNameDefault={fullNameDefault} avatarDefault={avatarDefault}
                               postingId={postingId} features={features} posting={posting} draft={draft}
                               sharedText={sharedText} sharedTextType={sharedTextType} smileysEnabled={smileysEnabled}
                               newsFeedEnabled={newsFeedEnabled} avatarShapeDefault={avatarShapeDefault}
                               visibilityDefault={visibilityDefault}
                               commentsVisibilityDefault={commentsVisibilityDefault}
                               commentAdditionDefault={commentAdditionDefault}
                               commentsHideDefault={commentsHideDefault}
                               reactionsEnabledDefault={reactionsEnabledDefault}
                               reactionsNegativeEnabledDefault={reactionsNegativeEnabledDefault}
                               reactionsPositiveDefault={reactionsPositiveDefault}
                               reactionsNegativeDefault={reactionsNegativeDefault}
                               reactionsVisibleDefault={reactionsVisibleDefault}
                               reactionTotalsVisibleDefault={reactionTotalsVisibleDefault}
                               sourceFormatDefault={sourceFormatDefault}/>;
}
