import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cloneDeep from 'lodash.clonedeep';

import { DraftText, PostingText } from "api/node/api-types";
import { composeDraftSave } from "state/compose/actions";
import { getOwnerName } from "state/owner/selectors";
import { ClientState } from "state/state";
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
        receiverName: ownerName,
        draftType: postingId == null ? "new-posting" : "posting-update",
        receiverPostingId: postingId == null ? null /* important, should not be undefined */ : postingId
    } as DraftText),

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
        subjectPresent: state.compose.subjectPresent,
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
