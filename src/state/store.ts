import { ClientState } from "state/state";
import { WithContext } from "state/action-types";
import { ClientAction } from "state/action";

import { applyMiddleware, combineReducers, legacy_createStore } from 'redux';
import getContext from "state/context";
import pulse from "state/pulse/reducer";
import error from "state/error/reducer";
import naming from "state/naming/reducer";
import node from "state/node/reducer";
import home from "state/home/reducer";
import tokens from "state/tokens/reducer";
import navigation from "state/navigation/reducer";
import connectDialog from "state/connectdialog/reducer";
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
import postingReply from "state/postingreply/reducer";
import changeDateDialog from "state/changedatedialog/reducer";
import people from "state/people/reducer";
import nodeCards from "state/nodecards/reducer";
import contacts from "state/contacts/reducer";
import grant from "state/grant/reducer";
import shareDialog from "state/sharedialog/reducer";
import sourceDialog from "state/sourcedialog/reducer";
import imageEditDialog from "state/imageeditdialog/reducer";
import lightBox from "state/lightbox/reducer";
import donateDialog from "state/donatedialog/reducer";
import entryCopyTextDialog from "state/entrycopytextdialog/reducer";
import linkPreviews from "state/linkpreviews/reducer";
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
import signUpDialog from "state/signupdialog/reducer";
import quickTips from "state/quicktips/reducer";
import refresh from "state/refresh/reducer";

import createSagaMiddleware from 'redux-saga';
import { spawn } from 'typed-redux-saga';
import { pulseSaga, signalPostInitSaga } from "state/pulse/sagas";
import navigationExecutors from "state/navigation/sagas";
import errorExecutors from "state/error/sagas";
import nodeExecutors from "state/node/sagas";
import connectExecutors from "state/home/connect";
import connectDialogExecutors from "state/connectdialog/sagas";
import homeExecutors from "state/home/sagas";
import cartesExecutors from "state/cartes/sagas";
import nodeNameExecutors from "state/nodename/sagas";
import profileExecutors from "state/profile/sagas";
import feedExecutors from "state/feeds/sagas";
import detailedPostingExecutors from "state/detailedposting/sagas";
import composeExecutors from "state/compose/sagas";
import postingsExecutors from "state/postings/sagas";
import settingsExecutors from "state/settings/sagas";
import complaintsExecutors from "state/complaints/sagas";
import namingExecutors from "state/naming/sagas";
import reactionsDialogExecutors from "state/reactionsdialog/sagas";
import postingReplyExecutors from "state/postingreply/sagas";
import storiesExecutors from "state/stories/sagas";
import changeDateDialogExecutors from "state/changedatedialog/sagas";
import peopleExecutors from "state/people/sagas";
import nodeCardsExecutors from "state/nodecards/sagas";
import contactsExecutors from "state/contacts/sagas";
import grantExecutors from "state/grant/sagas";
import shareDialogExecutors from "state/sharedialog/sagas";
import sourceDialogExecutors from "state/sourcedialog/sagas";
import imageEditDialogExecutors from "state/imageeditdialog/sagas";
import lightBoxExecutors from "state/lightbox/sagas";
import richTextEditorExecutors from "state/richtexteditor/sagas";
import entryCopyTextDialogExecutors from "state/entrycopytextdialog/sagas";
import linkPreviewsExecutors from "state/linkpreviews/sagas";
import friendGroupAddDialogExecutors from "state/friendgroupadddialog/sagas";
import friendGroupsDialogExecutors from "state/friendgroupsdialog/sagas";
import askDialogExecutors from "state/askdialog/sagas";
import blockDialogExecutors from "state/blockdialog/sagas";
import blockingDetailsDialogExecutors from "state/blockingdetailsdialog/sagas";
import sheriffOrderDialogExecutors from "state/sherifforderdialog/sagas";
import sheriffOrderDetailsDialogExecutors from "state/sherifforderdetailsdialog/sagas";
import flashBoxExecutors from "state/flashbox/sagas";
import signUpDialogExecutors from "state/signupdialog/sagas";
import refreshExecutors from "state/refresh/sagas";

import { collectTriggers, invokeTriggers } from "state/trigger";
import homeTriggers from "state/home/triggers";
import cartesTriggers from "state/cartes/triggers";
import navigationTriggers from "state/navigation/triggers";
import nodeTriggers from "state/node/triggers";
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
import grantTriggers from "state/grant/triggers";
import imageEditDialogTriggers from "state/imageeditdialog/triggers";
import lightBoxTriggers from "state/lightbox/triggers";
import askDialogTriggers from "state/askdialog/triggers";
import blockingDetailsDialogTriggers from "state/blockingdetailsdialog/triggers";
import blockedOperationsTriggers from "state/blockedoperations/triggers";
import sheriffOrderDetailsDialogTriggers from "state/sherifforderdetailsdialog/triggers";
import signUpDialogTriggers from "state/signupdialog/triggers";
import quickTipsTriggers from "state/quicktips/triggers";
import refreshTriggers from "state/refresh/triggers";

import { collectExecutors, invokeExecutors } from "state/executor";

const reducers = combineReducers({
    pulse,
    error,
    naming,
    node,
    home,
    tokens,
    navigation,
    connectDialog,
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
    postingReply,
    changeDateDialog,
    people,
    nodeCards,
    contacts,
    grant,
    shareDialog,
    sourceDialog,
    imageEditDialog,
    lightBox,
    donateDialog,
    entryCopyTextDialog,
    linkPreviews,
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
    signUpDialog,
    quickTips,
    refresh
});

function combinedReducer(state: ClientState | undefined, action: ClientAction): ClientState {
    const actionWithContext: WithContext<ClientAction> = {
        ...action,
        context: getContext(state)
    };
    return reducers(state, actionWithContext);
}

const triggers = collectTriggers(
    homeTriggers,
    cartesTriggers,
    navigationTriggers,
    nodeTriggers,
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
    grantTriggers,
    imageEditDialogTriggers,
    lightBoxTriggers,
    askDialogTriggers,
    blockingDetailsDialogTriggers,
    blockedOperationsTriggers,
    sheriffOrderDetailsDialogTriggers,
    signUpDialogTriggers,
    quickTipsTriggers,
    refreshTriggers
);

const executors = collectExecutors(
    navigationExecutors,
    errorExecutors,
    nodeExecutors,
    connectExecutors,
    connectDialogExecutors,
    homeExecutors,
    nodeNameExecutors,
    cartesExecutors,
    profileExecutors,
    feedExecutors,
    detailedPostingExecutors,
    composeExecutors,
    postingsExecutors,
    settingsExecutors,
    complaintsExecutors,
    namingExecutors,
    reactionsDialogExecutors,
    postingReplyExecutors,
    storiesExecutors,
    changeDateDialogExecutors,
    peopleExecutors,
    nodeCardsExecutors,
    contactsExecutors,
    grantExecutors,
    shareDialogExecutors,
    sourceDialogExecutors,
    imageEditDialogExecutors,
    lightBoxExecutors,
    richTextEditorExecutors,
    entryCopyTextDialogExecutors,
    linkPreviewsExecutors,
    friendGroupAddDialogExecutors,
    friendGroupsDialogExecutors,
    askDialogExecutors,
    blockDialogExecutors,
    blockingDetailsDialogExecutors,
    sheriffOrderDialogExecutors,
    sheriffOrderDetailsDialogExecutors,
    flashBoxExecutors,
    signUpDialogExecutors,
    refreshExecutors
);

function* combinedSaga() {
    yield* spawn(signalPostInitSaga);
    yield* spawn(pulseSaga);

    yield* invokeTriggers(triggers);
    yield* invokeExecutors(executors);
}

const sagaMiddleware = createSagaMiddleware();
export default legacy_createStore(combinedReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(combinedSaga);
