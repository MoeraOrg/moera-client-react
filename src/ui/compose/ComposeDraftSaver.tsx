import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cloneDeep from 'lodash.clonedeep';

import { DraftText, PostingText, StoryAttributes } from "api/node/api-types";
import { ClientState } from "state/state";
import { composeDraftSave } from "state/compose/actions";
import { getPostingFeatures } from "state/compose/selectors";
import { getOwnerName } from "state/owner/selectors";
import { getSetting } from "state/settings/selectors";
import { DraftSaver } from "ui/control";
import composePageLogic, { ComposePageValues } from "ui/compose/compose-page-logic";

type Props = {
    initialText: PostingText;
} & ConnectedProps<typeof connector>;

const composeDraftSaverLogic = {

    toText: (values: ComposePageValues, props: Props): PostingText =>
        composePageLogic.mapValuesToPostingText(values, props),

    isEmpty: (postingText: PostingText): boolean =>
        composePageLogic.isPostingTextEmpty(postingText),

    toDraftText: (ownerName: string, postingId: string | null, postingText: PostingText): DraftText => ({
        ...cloneDeep(postingText),
        publications: undefined,
        receiverName: ownerName,
        draftType: postingId == null ? "new-posting" : "posting-update",
        receiverPostingId: postingId == null ? null /* important, should not be undefined */ : postingId,
        publishAt: composeDraftSaverLogic.getPublishAt(postingText.publications)
    } as DraftText),

    getPublishAt: (publications: StoryAttributes[] | null | undefined): number | null | undefined =>
        publications != null && publications.length > 0 ? publications[0].publishAt : null,

    save: (text: PostingText, props: Props): void => {
        if (props.ownerName != null) {
            props.composeDraftSave(props.draftId,
                composeDraftSaverLogic.toDraftText(props.ownerName, props.postingId, text));
        }
    }

}

const ComposeDraftSaver = (props: Props) => (
    <DraftSaver logic={composeDraftSaverLogic} {...props}/>
);

const connector = connect(
    (state: ClientState) => ({
        ownerName: getOwnerName(state),
        features: getPostingFeatures(state),
        postingId: state.compose.postingId,
        draftId: state.compose.draftId,
        savingDraft: state.compose.savingDraft,
        savedDraft: state.compose.savedDraft,
        smileysEnabled: getSetting(state, "posting.smileys.enabled") as boolean,
        newsFeedEnabled: getSetting(state, "posting.feed.news.enabled") as boolean,
        avatarShapeDefault: getSetting(state, "avatar.shape.default") as string
    }),
    { composeDraftSave }
);

export default connector(ComposeDraftSaver);
