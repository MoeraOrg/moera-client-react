import { ClientState } from "state/state";
import { WithContext } from "state/action-types";
import { ClientAction } from "state/action";

import { applyMiddleware, combineReducers, legacy_createStore } from 'redux';
import * as immutable from 'object-path-immutable';
import { createStoreMiddleware } from "state/store-middleware";

import getContext from "state/context";
import pulse from "state/pulse/reducer";
import error from "state/error/reducer";
import naming from "state/naming/reducer";
import node from "state/node/reducer";
import home from "state/home/reducer";
import tokens from "state/tokens/reducer";
import navigation from "state/navigation/reducer";
import connectPage from "state/connectpage/reducer";
import nodeName from "state/nodename/reducer";
import profile from "state/profile/reducer";
import detailedPosting from "state/detailedposting/reducer";
import compose from "state/compose/reducer";
import postings from "state/postings/reducer";
import feeds from "state/feeds/reducer";
import settings from "state/settings/reducer";
import complaints from "state/complaints/reducer";
import cartes from "state/cartes/reducer";
import reactionsDialog from "state/reactionsdialog/reducer";
import changeDateDialog from "state/changedatedialog/reducer";
import people from "state/people/reducer";
import nodeCards from "state/nodecards/reducer";
import contacts from "state/contacts/reducer";
import search from "state/search/reducer";
import grant from "state/grant/reducer";
import explore from "state/explore/reducer";
import shareDialog from "state/sharedialog/reducer";
import sourceDialog from "state/sourcedialog/reducer";
import imageEditDialog from "state/imageeditdialog/reducer";
import lightbox from "state/lightbox/reducer";
import donateDialog from "state/donatedialog/reducer";
import entryCopyTextDialog from "state/entrycopytextdialog/reducer";
import linkPreviews from "state/linkpreviews/reducer";
import mediaDownloadDialog from "state/mediadownloaddialog/reducer";
import peopleHideDialog from "state/peoplehidedialog/reducer";
import friendGroupAddDialog from "state/friendgroupadddialog/reducer";
import friendGroupsDialog from "state/friendgroupsdialog/reducer";
import askDialog from "state/askdialog/reducer";
import blockDialog from "state/blockdialog/reducer";
import blockingDetailsDialog from "state/blockingdetailsdialog/reducer";
import sheriffOrderDialog from "state/sherifforderdialog/reducer";
import sheriffOrderDetailsDialog from "state/sherifforderdetailsdialog/reducer";
import messageBox from "state/messagebox/reducer";
import confirmBox from "state/confirmbox/reducer";
import flashBox from "state/flashbox/reducer";
import progressBox from "state/progressbox/reducer";
import signUp from "state/signup/reducer";
import refresh from "state/refresh/reducer";
import instants from "state/instants/reducer";

import { collectSagas } from "state/saga";
import { pulseSaga, signalPostInitSaga } from "state/pulse/sagas";
import navigationSagas from "state/navigation/sagas";
import errorSagas from "state/error/sagas";
import nodeSagas from "state/node/sagas";
import connectSagas from "state/home/connect";
import connectPageSagas from "state/connectpage/sagas";
import homeSagas from "state/home/sagas";
import cartesSagas from "state/cartes/sagas";
import nodeNameSagas from "state/nodename/sagas";
import profileSagas from "state/profile/sagas";
import feedSagas from "state/feeds/sagas";
import detailedPostingSagas from "state/detailedposting/sagas";
import composeSagas from "state/compose/sagas";
import postingsSagas from "state/postings/sagas";
import settingsSagas from "state/settings/sagas";
import complaintsSagas from "state/complaints/sagas";
import namingSagas from "state/naming/sagas";
import reactionsDialogSagas from "state/reactionsdialog/sagas";
import postingReplySagas from "state/postingreply/sagas";
import storiesSagas from "state/stories/sagas";
import changeDateDialogSagas from "state/changedatedialog/sagas";
import peopleSagas from "state/people/sagas";
import nodeCardsSagas from "state/nodecards/sagas";
import contactsSagas from "state/contacts/sagas";
import searchSagas from "state/search/sagas";
import grantSagas from "state/grant/sagas";
import exploreSagas from "state/explore/sagas";
import shareDialogSagas from "state/sharedialog/sagas";
import sourceDialogSagas from "state/sourcedialog/sagas";
import imageEditDialogSagas from "state/imageeditdialog/sagas";
import lightboxSagas from "state/lightbox/sagas";
import richTextEditorSagas from "state/richtexteditor/sagas";
import entryCopyTextDialogSagas from "state/entrycopytextdialog/sagas";
import linkPreviewsSagas from "state/linkpreviews/sagas";
import mediaDownloadDialogSagas from "state/mediadownloaddialog/sagas";
import friendGroupAddDialogSagas from "state/friendgroupadddialog/sagas";
import friendGroupsDialogSagas from "state/friendgroupsdialog/sagas";
import askDialogSagas from "state/askdialog/sagas";
import blockDialogSagas from "state/blockdialog/sagas";
import blockingDetailsDialogSagas from "state/blockingdetailsdialog/sagas";
import sheriffOrderDialogSagas from "state/sherifforderdialog/sagas";
import sheriffOrderDetailsDialogSagas from "state/sherifforderdetailsdialog/sagas";
import flashBoxSagas from "state/flashbox/sagas";
import signUpSagas from "state/signup/sagas";
import refreshSagas from "state/refresh/sagas";
import instantsSagas from "state/instants/sagas";

import { collectTriggers } from "state/trigger";
import homeTriggers from "state/home/triggers";
import cartesTriggers from "state/cartes/triggers";
import navigationTriggers from "state/navigation/triggers";
import nodeTriggers from "state/node/triggers";
import connectPageTriggers from "state/connectpage/triggers";
import nodeNameTriggers from "state/nodename/triggers";
import profileTriggers from "state/profile/triggers";
import feedTriggers from "state/feeds/triggers";
import detailedPostingTriggers from "state/detailedposting/triggers";
import composeTriggers from "state/compose/triggers";
import postingsTriggers from "state/postings/triggers";
import settingsTriggers from "state/settings/triggers";
import complaintsTriggers from "state/complaints/triggers";
import namingTriggers from "state/naming/triggers";
import reactionsDialogTriggers from "state/reactionsdialog/triggers";
import peopleTriggers from "state/people/triggers";
import nodeCardsTriggers from "state/nodecards/triggers";
import contactsTriggers from "state/contacts/triggers";
import searchTriggers from "state/search/triggers";
import grantTriggers from "state/grant/triggers";
import exploreTriggers from "state/explore/triggers";
import imageEditDialogTriggers from "state/imageeditdialog/triggers";
import lightboxTriggers from "state/lightbox/triggers";
import askDialogTriggers from "state/askdialog/triggers";
import blockingDetailsDialogTriggers from "state/blockingdetailsdialog/triggers";
import blockedOperationsTriggers from "state/blockedoperations/triggers";
import mediaDownloadDialogTriggers from "state/mediadownloaddialog/triggers";
import sheriffOrderDetailsDialogTriggers from "state/sherifforderdetailsdialog/triggers";
import refreshTriggers from "state/refresh/triggers";
import instantsTriggers from "state/instants/triggers";

const reducers = combineReducers({
    pulse,
    error,
    naming,
    node,
    home,
    tokens,
    navigation,
    connectPage,
    nodeName,
    profile,
    detailedPosting,
    compose,
    postings,
    feeds,
    settings,
    complaints,
    cartes,
    reactionsDialog,
    changeDateDialog,
    people,
    nodeCards,
    contacts,
    search,
    grant,
    explore,
    shareDialog,
    sourceDialog,
    imageEditDialog,
    lightbox,
    donateDialog,
    entryCopyTextDialog,
    linkPreviews,
    mediaDownloadDialog,
    peopleHideDialog,
    friendGroupAddDialog,
    friendGroupsDialog,
    askDialog,
    blockDialog,
    blockingDetailsDialog,
    sheriffOrderDialog,
    sheriffOrderDetailsDialog,
    messageBox,
    confirmBox,
    flashBox,
    progressBox,
    signUp,
    refresh,
    instants
});

function combinedReducer(state: ClientState | undefined, action: ClientAction): ClientState {
    const actionWithContext: WithContext<ClientAction> = {
        ...action,
        context: getContext(state)
    };
    return action.type === "BOOT"
        ? immutable.assign(reducers(undefined, actionWithContext), [], action.payload.initialState)
        : reducers(state, actionWithContext);
}

const triggers = collectTriggers(
    homeTriggers,
    cartesTriggers,
    navigationTriggers,
    nodeTriggers,
    connectPageTriggers,
    nodeNameTriggers,
    profileTriggers,
    feedTriggers,
    detailedPostingTriggers,
    composeTriggers,
    postingsTriggers,
    settingsTriggers,
    complaintsTriggers,
    namingTriggers,
    reactionsDialogTriggers,
    peopleTriggers,
    nodeCardsTriggers,
    contactsTriggers,
    searchTriggers,
    grantTriggers,
    exploreTriggers,
    imageEditDialogTriggers,
    lightboxTriggers,
    askDialogTriggers,
    blockingDetailsDialogTriggers,
    blockedOperationsTriggers,
    mediaDownloadDialogTriggers,
    sheriffOrderDetailsDialogTriggers,
    refreshTriggers,
    instantsTriggers
);

const sagas = collectSagas(
    navigationSagas,
    errorSagas,
    nodeSagas,
    connectSagas,
    connectPageSagas,
    homeSagas,
    nodeNameSagas,
    cartesSagas,
    profileSagas,
    feedSagas,
    detailedPostingSagas,
    composeSagas,
    postingsSagas,
    settingsSagas,
    complaintsSagas,
    namingSagas,
    reactionsDialogSagas,
    postingReplySagas,
    storiesSagas,
    changeDateDialogSagas,
    peopleSagas,
    nodeCardsSagas,
    contactsSagas,
    searchSagas,
    grantSagas,
    exploreSagas,
    shareDialogSagas,
    sourceDialogSagas,
    imageEditDialogSagas,
    lightboxSagas,
    richTextEditorSagas,
    entryCopyTextDialogSagas,
    linkPreviewsSagas,
    mediaDownloadDialogSagas,
    friendGroupAddDialogSagas,
    friendGroupsDialogSagas,
    askDialogSagas,
    blockDialogSagas,
    blockingDetailsDialogSagas,
    sheriffOrderDialogSagas,
    sheriffOrderDetailsDialogSagas,
    flashBoxSagas,
    signUpSagas,
    refreshSagas,
    instantsSagas
);

export default function initStore(): void {
    window.middleware = createStoreMiddleware(triggers, sagas);
    window.store = legacy_createStore(combinedReducer, applyMiddleware(window.middleware));
    signalPostInitSaga();
    pulseSaga();
}
