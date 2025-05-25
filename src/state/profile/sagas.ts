import i18n from 'i18next';

import { CLIENT_SETTINGS_PREFIX, Node } from "api";
import { WithContext } from "state/action-types";
import { homeIntroduced } from "state/init-barriers";
import { dispatch, select } from "state/store-sagas";
import { errorThrown } from "state/error/actions";
import {
    ProfileAvatarCreateAction,
    profileAvatarCreated,
    profileAvatarCreateFailed,
    ProfileAvatarDeleteAction,
    profileAvatarDeleted,
    ProfileAvatarsLoadAction,
    profileAvatarsLoaded,
    profileAvatarsLoadFailed,
    ProfileAvatarsReorderAction,
    ProfileImageUploadAction,
    profileImageUploaded,
    profileImageUploadFailed,
    profileImageUploadProgress,
    ProfileLoadAction,
    profileLoadFailed,
    profileSet,
    ProfileUpdateAction,
    profileUpdateFailed,
    profileUpdateSucceeded
} from "state/profile/actions";
import { executor } from "state/executor";
import { messageBox } from "state/messagebox/actions";
import { getAvatars } from "state/profile/selectors";
import { settingsUpdate } from "state/settings/actions";
import { REL_CURRENT } from "util/rel-node-name";

export default [
    executor("PROFILE_LOAD", "", profileLoadSaga),
    executor("PROFILE_UPDATE", null, profileUpdateSaga),
    executor("PROFILE_IMAGE_UPLOAD", null, profileImageUploadSaga),
    executor("PROFILE_AVATARS_LOAD", "", profileAvatarsLoadSaga),
    executor("PROFILE_AVATAR_CREATE", "", profileAvatarCreateSaga),
    executor("PROFILE_AVATAR_DELETE", payload => payload.id, profileAvatarDeleteSaga),
    executor("PROFILE_AVATARS_REORDER", "", profileAvatarsReorderSaga)
];

async function profileLoadSaga(action: WithContext<ProfileLoadAction>): Promise<void> {
    await homeIntroduced();
    try {
        const profile = await Node.getProfile(action, REL_CURRENT, true);
        dispatch(profileSet(profile).causedBy(action));
    } catch (e) {
        dispatch(profileLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function profileUpdateSaga(action: WithContext<ProfileUpdateAction>): Promise<void> {
    try {
        const profile = await Node.updateProfile(action, REL_CURRENT, action.payload.profile);
        dispatch(profileUpdateSucceeded().causedBy(action));
        dispatch(profileSet(profile).causedBy(action));
    } catch (e) {
        dispatch(profileUpdateFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function profileImageUploadSaga(action: WithContext<ProfileImageUploadAction>): Promise<void> {
    try {
        const {id, path, width, height, orientation} = await Node.uploadPublicMedia(
            action,
            REL_CURRENT,
            action.payload.file,
            (loaded: number, total: number) => dispatch(profileImageUploadProgress(loaded, total))
        );
        if (width == null || width < 100 || height == null || height < 100) {
            dispatch(messageBox(i18n.t("avatar-too-small")).causedBy(action));
            dispatch(profileImageUploadFailed().causedBy(action));
        } else {
            dispatch(profileImageUploaded(id, path, width, height, orientation ?? 1).causedBy(action));
        }
    } catch (e) {
        dispatch(profileImageUploadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function profileAvatarsLoadSaga(action: WithContext<ProfileAvatarsLoadAction>): Promise<void> {
    try {
        const avatars = await Node.getAvatars(action, REL_CURRENT);
        dispatch(profileAvatarsLoaded(avatars).causedBy(action));
    } catch (e) {
        dispatch(profileAvatarsLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function profileAvatarCreateSaga(action: WithContext<ProfileAvatarCreateAction>): Promise<void> {
    try {
        const avatar = await Node.createAvatar(action, REL_CURRENT, action.payload.avatar);
        dispatch(profileAvatarCreated(avatar).causedBy(action));
        const onCreate = select().profile.avatarEditDialog.onCreate;
        if (onCreate) {
            onCreate(avatar);
        }
        dispatch(settingsUpdate([{
            name: CLIENT_SETTINGS_PREFIX + "avatar.shape.default",
            value: avatar.shape ?? null
        }]).causedBy(action));
    } catch (e) {
        dispatch(profileAvatarCreateFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function profileAvatarDeleteSaga(action: WithContext<ProfileAvatarDeleteAction>): Promise<void> {
    const {id, onDeleted} = action.payload;

    try {
        await Node.deleteAvatar(action, REL_CURRENT, id);
        dispatch(profileAvatarDeleted(id).causedBy(action));
        if (onDeleted) {
            onDeleted(id);
        }
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

async function profileAvatarsReorderSaga(action: WithContext<ProfileAvatarsReorderAction>): Promise<void> {
    const ids = select(state => getAvatars(state).map(av => av.id));
    ids.reverse();
    try {
        await Node.reorderAvatars(action, REL_CURRENT, {ids});
    } catch (e) {
        dispatch(errorThrown(e));
    }
}
