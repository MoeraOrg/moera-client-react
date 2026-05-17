import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import cloneDeep from 'lodash.clonedeep';

import { DraftText, MediaCaption, MediaToAttach, PostingText, StoryAttributes } from "api";
import { ClientState } from "state/state";
import { getHomeOwnerGender, getHomeOwnerName } from "state/home/selectors";
import { getOwnerName } from "state/node/selectors";
import { composeDraftListItemDelete, composeDraftSave, composeUpdateDraftDelete } from "state/compose/actions";
import { getPostingFeatures } from "state/compose/selectors";
import { getSetting } from "state/settings/selectors";
import { useDispatcher } from "ui/hook";
import { Icon, msCloudDone, msCloudUpload } from "ui/material-symbols";
import { mediaCaptionsToCaptionsText, mediaToDraftAttachment } from "ui/control/richtexteditor";
import { ComposePageValues, isPostingTextChanged, valuesToPostingText } from "ui/compose/posting-compose";
import { useDraftSaver } from "ui/draft/draft-saver";
import { MediaWithCaption } from "util/media-with-caption";
import { notNull } from "util/misc";

const getPublishAt = (publications: StoryAttributes[] | null | undefined): number | null | undefined =>
    publications != null && publications.length > 0 ? publications[0].publishAt : null;

const toDraftText = (
    ownerName: string,
    postingId: string | null,
    postingText: PostingText,
    media: MediaToAttach[],
    mediaCaptions: MediaCaption[] | undefined
): DraftText => ({
    ...cloneDeep(postingText),
    media,
    mediaCaptions: mediaCaptionsToCaptionsText(mediaCaptions),
    publications: undefined,
    receiverName: ownerName,
    draftType: postingId == null ? "new-posting" : "posting-update",
    receiverPostingId: postingId == null ? null /* important: should not be undefined */ : postingId,
    publishAt: getPublishAt(postingText.publications)
} as DraftText);

const toCaptionsList = (media: (MediaWithCaption | null)[] | null | undefined): MediaCaption[] | undefined =>
    media?.filter(notNull).map(m => m.caption).filter(notNull);

const areCaptionsEmpty = (captions: MediaCaption[] | undefined): boolean => captions == null || captions.length === 0;

type ComposeValue = [PostingText, MediaCaption[] | undefined];

export default function ComposeDraftSaver() {
    const ownerName = useSelector(getOwnerName);
    const homeOwnerName = useSelector(getHomeOwnerName);
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
    const dispatch = useDispatcher();

    const toText = useCallback(
        (values: ComposePageValues): ComposeValue => ([
            valuesToPostingText(
                values,
                {gender, postingId, features, smileysEnabled, newsFeedEnabled, avatarShapeDefault}
            ),
            toCaptionsList(values.body.media)
        ]),
        [avatarShapeDefault, features, gender, newsFeedEnabled, postingId, smileysEnabled]
    );

    const isChanged = useCallback(
        ([postingText, captions]: ComposeValue): boolean =>
            isPostingTextChanged(postingText, posting) || !areCaptionsEmpty(captions),
        [posting]
    );

    const save = useCallback(
        ([text, mediaCaptions]: ComposeValue, values: ComposePageValues): void => {
            if (ownerName != null && homeOwnerName != null) {
                const media = (values.body.media ?? [])
                    .concat(values.linkPreviews.media)
                    .filter(notNull)
                    .map(m => mediaToDraftAttachment(m, ownerName, homeOwnerName))
                dispatch(composeDraftSave(draftId, toDraftText(ownerName, postingId, text, media, mediaCaptions)));
            }
        },
        [ownerName, homeOwnerName, dispatch, draftId, postingId]
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
            {!unsaved && saving && <Icon icon={msCloudUpload} size={20}/>}
            {!unsaved && saved && <Icon icon={msCloudDone} size={20}/>}
        </span>
    );
}
