import {
    GO_TO_LOCATION,
    GO_TO_PAGE_WITH_DEFAULT_SUBPAGE,
    INIT_FROM_LOCATION,
    NEW_LOCATION,
    UPDATE_LOCATION
} from "state/navigation/actions";
import { ERROR_AUTH_INVALID, ERROR_THROWN } from "state/error/actions";
import { OWNER_LOAD, OWNER_SWITCH, OWNER_VERIFY } from "state/owner/actions";
import {
    CONNECT_TO_HOME,
    CONNECTED_TO_HOME,
    DISCONNECTED_FROM_HOME,
    HOME_OWNER_VERIFY,
    HOME_RESTORE
} from "state/home/actions";
import { CARTES_LOAD, CARTES_SET } from "state/cartes/actions";
import { NODE_NAME_LOAD, NODE_NAME_UPDATE, REGISTER_NAME } from "state/nodename/actions";
import { PROFILE_LOAD, PROFILE_UPDATE } from "state/profile/actions";
import {
    FEED_FUTURE_SLICE_LOAD,
    FEED_GENERAL_LOAD,
    FEED_PAST_SLICE_LOAD,
    FEED_STATUS_LOAD,
    FEED_STATUS_UPDATE,
    FEED_SUBSCRIBE,
    FEED_UNSUBSCRIBE
} from "state/feeds/actions";
import { DETAILED_POSTING_LOAD } from "state/detailedposting/actions";
import {
    COMPOSE_DRAFT_LIST_ITEM_DELETE,
    COMPOSE_DRAFT_LIST_ITEM_RELOAD,
    COMPOSE_DRAFT_LIST_LOAD,
    COMPOSE_DRAFT_LOAD,
    COMPOSE_DRAFT_REVISION_DELETE,
    COMPOSE_DRAFT_SAVE,
    COMPOSE_FEATURES_LOAD,
    COMPOSE_POST,
    COMPOSE_POSTING_LOAD
} from "state/compose/actions";
import {
    POSTING_DELETE,
    POSTING_LOAD,
    POSTING_REACT,
    POSTING_REACTION_DELETE,
    POSTING_REACTION_LOAD,
    POSTING_VERIFY
} from "state/postings/actions";
import {
    SETTINGS_CLIENT_VALUES_LOAD,
    SETTINGS_CLIENT_VALUES_LOADED,
    SETTINGS_NODE_META_LOAD,
    SETTINGS_NODE_VALUES_LOAD,
    SETTINGS_UPDATE,
    SETTINGS_UPDATE_SUCCEEDED
} from "state/settings/actions";
import { NAMING_NAME_LOAD, NAMING_NAMES_MAINTENANCE } from "state/naming/actions";
import {
    REACTION_VERIFY,
    REACTIONS_DIALOG_PAST_REACTIONS_LOAD,
    REACTIONS_DIALOG_TOTALS_LOAD
} from "state/reactionsdialog/actions";
import { POSTING_REPLY } from "state/postingreply/actions";
import { STORY_PINNING_UPDATE, STORY_READING_UPDATE } from "state/stories/actions";

import { applyMiddleware, combineReducers, createStore } from 'redux';
import pulse from "state/pulse/reducer";
import error from "state/error/reducer";
import naming from "state/naming/reducer";
import node from "state/node/reducer";
import home from "state/home/reducer";
import tokens from "state/tokens/reducer";
import navigation from "state/navigation/reducer";
import connectDialog from "state/connectdialog/reducer";
import owner from "state/owner/reducer";
import nodeName from "state/nodename/reducer";
import profile from "state/profile/reducer";
import detailedPosting from "state/detailedposting/reducer";
import compose from "state/compose/reducer";
import postings from "state/postings/reducer";
import feeds from "state/feeds/reducer";
import settings from "state/settings/reducer";
import cartes from "state/cartes/reducer";
import reactionsDialog from "state/reactionsdialog/reducer";
import postingReply from "state/postingreply/reducer";
import changeDateDialog from "state/changedatedialog/reducer";
import messageBox from "state/messagebox/reducer";
import confirmBox from "state/confirmbox/reducer";

import createSagaMiddleware from 'redux-saga';
import { spawn, takeEvery, takeLatest } from 'redux-saga/effects';
import { flushPostponedIntroducedSaga, introduce } from "api/node/introduce";
import { askNaming, flushPostponedNamingSaga } from "api/node/ask-naming";
import { pulseSaga } from "state/pulse/sagas";
import {
    goToLocationSaga,
    goToPageWithDefaultSubpageSaga,
    initFromLocationSaga,
    newLocationSaga
} from "state/navigation/sagas";
import { errorAuthInvalidSaga, errorSaga } from "state/error/sagas";
import { ownerLoadSaga, ownerSwitchSaga, ownerVerifySaga } from "state/owner/sagas";
import { connectToHomeSaga, verifyHomeOwnerSaga } from "state/home/connect";
import { homeRestoreSaga } from "state/home/sagas";
import { cartesLoadSaga } from "state/cartes/sagas";
import { nodeNameLoadSaga, nodeNameUpdateSaga, registerNameSaga } from "state/nodename/sagas";
import { profileLoadSaga, profileUpdateSaga } from "state/profile/sagas";
import {
    feedFutureSliceLoadSaga,
    feedGeneralLoadSaga,
    feedPastSliceLoadSaga,
    feedStatusLoadSaga,
    feedStatusUpdateSaga,
    feedSubscribeSaga,
    feedUnsubscribeSaga
} from "state/feeds/sagas";
import { detailedPostingLoadSaga } from "state/detailedposting/sagas";
import {
    composeDraftListItemDeleteSaga,
    composeDraftListItemReloadSaga,
    composeDraftListLoadSaga,
    composeDraftLoadSaga,
    composeDraftRevisionDeleteSaga,
    composeDraftSaveSaga,
    composeFeaturesLoadSaga,
    composePostingLoadSaga,
    composePostSaga
} from "state/compose/sagas";
import {
    postingDeleteSaga,
    postingLoadSaga,
    postingReactionDeleteSaga,
    postingReactionLoadSaga,
    postingReactSaga,
    postingVerifySaga
} from "state/postings/sagas";
import {
    settingsClientValuesLoadSaga,
    settingsNodeMetaLoadSaga,
    settingsNodeValuesLoadSaga,
    settingsUpdateSaga,
    settingsUpdateSucceededSaga
} from "state/settings/sagas";
import { namingNameLoadSaga, namingNamesMaintenanceSaga } from "state/naming/sagas";
import {
    reactionsDialogPastReactionsLoadSaga,
    reactionsDialogTotalsLoadSaga,
    reactionVerifySaga
} from "state/reactionsdialog/sagas";
import { postingReplySaga } from "state/postingreply/sagas";
import { storyPinningUpdateSaga, storyReadingUpdateSaga } from "state/stories/sagas";
import { storyChangeDateSaga } from "state/changedatedialog/sagas";

import { collectTriggers, invokeTriggers } from "state/trigger";
import homeTriggers from "state/home/triggers";
import cartesTriggers from "state/cartes/triggers";
import navigationTriggers from "state/navigation/triggers";
import ownerTriggers from "state/owner/triggers";
import nodeNameTriggers from "state/nodename/triggers";
import profileTriggers from "state/profile/triggers";
import feedTriggers from "state/feeds/triggers";
import detailedPostingTriggers from "state/detailedposting/triggers";
import composeTriggers from "state/compose/triggers";
import postingsTriggers from "state/postings/triggers";
import settingsTriggers from "state/settings/triggers";
import namingTriggers from "state/naming/triggers";
import reactionsDialogTriggers from "state/reactionsdialog/triggers";
import { STORY_CHANGE_DATE } from "state/changedatedialog/actions";

const triggers = collectTriggers(
    homeTriggers,
    cartesTriggers,
    navigationTriggers,
    ownerTriggers,
    nodeNameTriggers,
    profileTriggers,
    feedTriggers,
    detailedPostingTriggers,
    composeTriggers,
    postingsTriggers,
    settingsTriggers,
    namingTriggers,
    reactionsDialogTriggers
);

function* flushPostponedSaga() {
    yield flushPostponedIntroducedSaga();
    yield flushPostponedNamingSaga();
}

function* combinedSaga() {
    yield spawn(pulseSaga);
    yield takeLatest(INIT_FROM_LOCATION, initFromLocationSaga);
    yield takeEvery(NEW_LOCATION, newLocationSaga);
    yield takeEvery(UPDATE_LOCATION, newLocationSaga);
    yield takeLatest(GO_TO_LOCATION, goToLocationSaga);
    yield takeLatest(GO_TO_PAGE_WITH_DEFAULT_SUBPAGE, goToPageWithDefaultSubpageSaga);
    yield takeLatest(ERROR_THROWN, errorSaga);
    yield takeLatest(ERROR_AUTH_INVALID, errorAuthInvalidSaga);
    yield takeLatest(OWNER_LOAD, ownerLoadSaga);
    yield takeLatest(OWNER_VERIFY, askNaming(ownerVerifySaga));
    yield takeLatest(OWNER_SWITCH, ownerSwitchSaga);
    yield takeLatest(CONNECT_TO_HOME, connectToHomeSaga);
    yield takeLatest(HOME_RESTORE, homeRestoreSaga);
    yield takeLatest(HOME_OWNER_VERIFY, askNaming(verifyHomeOwnerSaga));
    yield takeLatest(NODE_NAME_LOAD, nodeNameLoadSaga);
    yield takeLatest(CARTES_LOAD, cartesLoadSaga);
    yield takeEvery(CONNECTED_TO_HOME, flushPostponedSaga);
    yield takeEvery(DISCONNECTED_FROM_HOME, flushPostponedSaga);
    yield takeEvery(CARTES_SET, flushPostponedSaga);
    yield takeLatest(PROFILE_LOAD, introduce(profileLoadSaga));
    yield takeLatest(PROFILE_UPDATE, profileUpdateSaga);
    yield takeLatest(REGISTER_NAME, registerNameSaga);
    yield takeLatest(NODE_NAME_UPDATE, nodeNameUpdateSaga);
    yield takeEvery(FEED_GENERAL_LOAD, introduce(feedGeneralLoadSaga));
    yield takeEvery(FEED_SUBSCRIBE, feedSubscribeSaga);
    yield takeEvery(FEED_UNSUBSCRIBE, feedUnsubscribeSaga);
    yield takeEvery(FEED_STATUS_LOAD, feedStatusLoadSaga);
    yield takeEvery(FEED_STATUS_UPDATE, feedStatusUpdateSaga);
    yield takeEvery(FEED_PAST_SLICE_LOAD, introduce(feedPastSliceLoadSaga));
    yield takeEvery(FEED_FUTURE_SLICE_LOAD, introduce(feedFutureSliceLoadSaga));
    yield takeLatest(DETAILED_POSTING_LOAD, introduce(detailedPostingLoadSaga));
    yield takeLatest(COMPOSE_FEATURES_LOAD, composeFeaturesLoadSaga);
    yield takeLatest(COMPOSE_POSTING_LOAD, introduce(composePostingLoadSaga));
    yield takeLatest(COMPOSE_POST, composePostSaga);
    yield takeLatest(POSTING_DELETE, postingDeleteSaga);
    yield takeLatest(POSTING_LOAD, introduce(postingLoadSaga));
    yield takeLatest(SETTINGS_NODE_VALUES_LOAD, introduce(settingsNodeValuesLoadSaga));
    yield takeLatest(SETTINGS_NODE_META_LOAD, introduce(settingsNodeMetaLoadSaga));
    yield takeLatest(SETTINGS_CLIENT_VALUES_LOAD, introduce(settingsClientValuesLoadSaga));
    yield takeLatest(SETTINGS_CLIENT_VALUES_LOADED, flushPostponedNamingSaga);
    yield takeLatest(SETTINGS_UPDATE, settingsUpdateSaga);
    yield takeLatest(SETTINGS_UPDATE_SUCCEEDED, settingsUpdateSucceededSaga);
    yield takeEvery(NAMING_NAME_LOAD, askNaming(namingNameLoadSaga));
    yield takeLatest(NAMING_NAMES_MAINTENANCE, namingNamesMaintenanceSaga);
    yield takeEvery(POSTING_VERIFY, postingVerifySaga);
    yield takeEvery(POSTING_REACT, postingReactSaga);
    yield takeEvery(POSTING_REACTION_LOAD, postingReactionLoadSaga);
    yield takeEvery(POSTING_REACTION_DELETE, postingReactionDeleteSaga);
    yield takeLatest(REACTIONS_DIALOG_PAST_REACTIONS_LOAD, reactionsDialogPastReactionsLoadSaga);
    yield takeLatest(REACTIONS_DIALOG_TOTALS_LOAD, reactionsDialogTotalsLoadSaga);
    yield takeEvery(REACTION_VERIFY, reactionVerifySaga);
    yield takeLatest(COMPOSE_DRAFT_LOAD, introduce(composeDraftLoadSaga));
    yield takeLatest(COMPOSE_DRAFT_SAVE, composeDraftSaveSaga);
    yield takeLatest(COMPOSE_DRAFT_LIST_LOAD, introduce(composeDraftListLoadSaga));
    yield takeLatest(COMPOSE_DRAFT_LIST_ITEM_RELOAD, composeDraftListItemReloadSaga);
    yield takeLatest(COMPOSE_DRAFT_LIST_ITEM_DELETE, composeDraftListItemDeleteSaga);
    yield takeLatest(COMPOSE_DRAFT_REVISION_DELETE, composeDraftRevisionDeleteSaga);
    yield takeLatest(POSTING_REPLY, postingReplySaga);
    yield takeEvery(STORY_PINNING_UPDATE, storyPinningUpdateSaga);
    yield takeLatest(STORY_CHANGE_DATE, storyChangeDateSaga);
    yield takeEvery(STORY_READING_UPDATE, storyReadingUpdateSaga);

    yield invokeTriggers(triggers);
}

const sagaMiddleware = createSagaMiddleware();
export default createStore(
    combineReducers({
        pulse,
        error,
        naming,
        node,
        home,
        tokens,
        navigation,
        connectDialog,
        owner,
        nodeName,
        profile,
        detailedPosting,
        compose,
        postings,
        feeds,
        settings,
        cartes,
        reactionsDialog,
        postingReply,
        changeDateDialog,
        messageBox,
        confirmBox
    }),
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(combinedSaga);
