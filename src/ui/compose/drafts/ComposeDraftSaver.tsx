import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cloneDeep from 'lodash.clonedeep';

import { DraftText, PostingText, StoryAttributes, VerifiedMediaFile } from "api";
import { ClientState } from "state/state";
import { getHomeOwnerGender } from "state/home/selectors";
import { getOwnerName } from "state/node/selectors";
import { composeDraftListItemDelete, composeDraftSave, composeUpdateDraftDelete } from "state/compose/actions";
import { getPostingFeatures } from "state/compose/selectors";
import { getSetting } from "state/settings/selectors";
import { ComposePageValues, isPostingTextChanged, valuesToPostingText } from "ui/compose/posting-compose";
import { useDraftSaver } from "ui/draft/draft-saver";
import { notNull } from "util/misc";
import { Icon, msCloudDone, msCloudUpload } from "ui/material-symbols";

const getPublishAt = (publications: StoryAttributes[] | null | undefined): number | null | undefined =>
    publications != null && publications.length > 0 ? publications[0].publishAt : null;

const toDraftText = (
    ownerName: string, postingId: string | null, postingText: PostingText, media: Map<string, VerifiedMediaFile>
): DraftText => ({
    ...cloneDeep(postingText),
    media: postingText.media?.filter(notNull).map(id => ({
        id,
        hash: media.get(id)?.hash,
        digest: media.get(id)?.digest
    })),
    publications: undefined,
    receiverName: ownerName,
    draftType: postingId == null ? "new-posting" : "posting-update",
    receiverPostingId: postingId == null ? null /* important: should not be undefined */ : postingId,
    publishAt: getPublishAt(postingText.publications)
} as DraftText);


export default function ComposeDraftSaver() {
    const ownerName = useSelector(getOwnerName);
    const gender = useSelector(getHomeOwnerGender);
    const features = useSelector(getPostingFeatures);
    const postingId = useSelector((state: ClientState) => state.compose.postingId);
    const posting = useSelector((state: ClientState) => state.compose.posting);
    const draftId = useSelector((state: ClientState) => state.compose.draftId);
    const smileysEnabled = useSelector((state: ClientState) =>
        getSetting(state, "posting.smileys.enabled") as boolean
    );
    const newsFeedEnabled = useSelector((state: ClientState) =>
        getSetting(state, "posting.feed.news.enabled") as boolean
    );
    const avatarShapeDefault = useSelector((state: ClientState) =>
        getSetting(state, "avatar.shape.default") as string
    );
    const dispatch = useDispatch();

    const toText = useCallback(
        (values: ComposePageValues): PostingText =>
            valuesToPostingText(
                values,
                {gender, postingId, features, smileysEnabled, newsFeedEnabled, avatarShapeDefault}
            ),
        [avatarShapeDefault, features, gender, newsFeedEnabled, postingId, smileysEnabled]
    );

    const isChanged = useCallback(
        (postingText: PostingText): boolean => isPostingTextChanged(postingText, posting),
        [posting]
    );

    const save = useCallback(
        (text: PostingText, values: ComposePageValues): void => {
            if (ownerName != null) {
                const media = new Map(
                    (values.body.media ?? [])
                        .concat(values.linkPreviews.media)
                        .filter(notNull)
                        .map(rm => [rm.id, rm])
                );
                dispatch(composeDraftSave(draftId, toDraftText(ownerName, postingId, text, media)));
            }
        },
        [ownerName, draftId, postingId, dispatch]
    );

    const drop = useCallback(
        (): void => {
            if (draftId != null) {
                if (postingId == null) {
                    dispatch(composeDraftListItemDelete(draftId, false));
                } else {
                    dispatch(composeUpdateDraftDelete(false));
                }
            }
        },
        [draftId, postingId, dispatch]
    );

    const {unsaved, saving, saved} = useDraftSaver({
        toText, isChanged, save, drop,
        savingDraftSelector: (state: ClientState) => state.compose.savingDraft,
        savedDraftSelector: (state: ClientState) => state.compose.savedDraft
    });

    return (
        <span className="draft-status">
            {!unsaved && saving && <Icon icon={msCloudUpload} width={20} height={20}/>}
            {!unsaved && saved && <Icon icon={msCloudDone} width={20} height={20}/>}
        </span>
    );
}
