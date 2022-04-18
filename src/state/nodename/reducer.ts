import cloneDeep from 'lodash.clonedeep';

import {
    MNEMONIC_CLOSE,
    NODE_NAME_LOAD,
    NODE_NAME_LOAD_FAILED,
    NODE_NAME_SET,
    NODE_NAME_UNSET,
    NODE_NAME_UPDATE,
    NODE_NAME_UPDATE_DIALOG,
    NODE_NAME_UPDATE_DIALOG_CANCEL,
    NODE_NAME_UPDATE_FAILED,
    NODE_NAME_UPDATE_SUCCEEDED,
    REGISTER_NAME,
    REGISTER_NAME_DIALOG,
    REGISTER_NAME_DIALOG_CANCEL,
    REGISTER_NAME_FAILED,
    REGISTER_NAME_SUCCEEDED
} from "state/nodename/actions";
import { INIT_FROM_LOCATION } from "state/navigation/actions";
import { NodeNameState } from "state/nodename/state";
import { ClientAction } from "state/action";

const emptyInfo = {
    name: null,
    operationStatus: null,
    operationStatusUpdated: null,
    operationErrorCode: null,
    operationErrorMessage: null,
    operations: {
        manage: "admin"
    }
};

const initialState = {
    loaded: false,
    loading: false,
    ...emptyInfo,
    showingRegisterDialog: false,
    registering: false,
    mnemonicName: null,
    mnemonic: null,
    showingUpdateDialog: false,
    showingChangeName: false,
    updating: false
};

export default (state: NodeNameState = initialState, action: ClientAction): NodeNameState => {
    switch (action.type) {
        case INIT_FROM_LOCATION:
            return cloneDeep(initialState);

        case NODE_NAME_LOAD:
            return {
                ...state,
                loading: true
            };

        case NODE_NAME_LOAD_FAILED:
            return {
                ...state,
                loading: false
            };

        case NODE_NAME_SET:
            return {
                ...state,
                ...emptyInfo,
                name: action.payload.nodeName,
                loading: false,
                loaded: true
            };

        case NODE_NAME_UNSET:
            return {
                ...state,
                ...emptyInfo,
                loading: false,
                loaded: false
            };

        case REGISTER_NAME_DIALOG:
            return {
                ...state,
                showingRegisterDialog: true
            };

        case REGISTER_NAME_DIALOG_CANCEL:
            return {
                ...state,
                showingRegisterDialog: false
            };

        case REGISTER_NAME:
            return {
                ...state,
                registering: true
            };

        case REGISTER_NAME_SUCCEEDED:
            return {
                ...state,
                showingRegisterDialog: false,
                registering: false,
                mnemonicName: action.payload.name,
                mnemonic: action.payload.mnemonic
            };

        case REGISTER_NAME_FAILED:
            return {
                ...state,
                registering: false
            };

        case MNEMONIC_CLOSE:
            return {
                ...state,
                mnemonic: null
            };

        case NODE_NAME_UPDATE_DIALOG:
            return {
                ...state,
                showingUpdateDialog: true,
                showingChangeName: action.payload.changeName
            };

        case NODE_NAME_UPDATE_DIALOG_CANCEL:
            return {
                ...state,
                showingUpdateDialog: false
            };

        case NODE_NAME_UPDATE:
            return {
                ...state,
                updating: true
            };

        case NODE_NAME_UPDATE_SUCCEEDED:
            return {
                ...state,
                showingUpdateDialog: false,
                updating: false
            };

        case NODE_NAME_UPDATE_FAILED:
            return {
                ...state,
                updating: false
            };

        default:
            return state;
    }
}
