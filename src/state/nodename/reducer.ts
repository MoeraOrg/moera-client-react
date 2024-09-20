import cloneDeep from 'lodash.clonedeep';

import { NodeNameState } from "state/nodename/state";
import { ClientAction } from "state/action";

const emptyInfo = {
    name: null,
    operationStatus: null,
    operationStatusUpdated: null,
    operationErrorCode: null,
    operationErrorMessage: null,
    operations: {
        manage: "admin" as const
    }
};

const initialState: NodeNameState = {
    loaded: false,
    loading: false,
    ...emptyInfo,
    showingRegisterDialog: false,
    registering: false,
    storedMnemonic: false,
    mnemonicName: null,
    mnemonic: null,
    showingUpdateDialog: false,
    showingChangeName: false,
    updating: false
};

export default (state: NodeNameState = initialState, action: ClientAction): NodeNameState => {
    switch (action.type) {
        case "INIT_FROM_LOCATION":
            return cloneDeep(initialState);

        case "NODE_NAME_LOAD":
            return {
                ...state,
                loading: true
            };

        case "NODE_NAME_LOAD_FAILED":
            return {
                ...state,
                loading: false
            };

        case "NODE_NAME_SET":
            return {
                ...state,
                ...emptyInfo,
                name: action.payload.info.name ?? null,
                operationStatus: action.payload.info.operationStatus ?? null,
                operationStatusUpdated: action.payload.info.operationStatusUpdated ?? null,
                operationErrorCode: action.payload.info.operationErrorCode ?? null,
                operationErrorMessage: action.payload.info.operationErrorMessage ?? null,
                operations: {
                    manage: action.payload.info.operations?.manage ?? emptyInfo.operations.manage
                },
                storedMnemonic: action.payload.info.storedMnemonic ?? false,
                loading: false,
                loaded: true
            };

        case "NODE_NAME_UNSET":
            return {
                ...state,
                ...emptyInfo,
                loading: false,
                loaded: false
            };

        case "REGISTER_NAME_DIALOG":
            return {
                ...state,
                showingRegisterDialog: true
            };

        case "REGISTER_NAME_DIALOG_CANCEL":
            return {
                ...state,
                showingRegisterDialog: false
            };

        case "REGISTER_NAME":
            return {
                ...state,
                registering: true
            };

        case "REGISTER_NAME_SUCCEEDED":
            return {
                ...state,
                showingRegisterDialog: false,
                registering: false,
                mnemonicName: action.payload.name,
                mnemonic: action.payload.mnemonic
            };

        case "REGISTER_NAME_FAILED":
            return {
                ...state,
                registering: false
            };

        case "MNEMONIC_OPEN":
            return {
                ...state,
                mnemonicName: action.payload.name,
                mnemonic: action.payload.mnemonic
            };

        case "MNEMONIC_CLOSED":
            return {
                ...state,
                storedMnemonic: action.payload.stored,
                mnemonic: null
            };

        case "NODE_NAME_UPDATE_DIALOG":
            return {
                ...state,
                showingUpdateDialog: true,
                showingChangeName: action.payload.changeName
            };

        case "NODE_NAME_UPDATE_DIALOG_CANCEL":
            return {
                ...state,
                showingUpdateDialog: false
            };

        case "NODE_NAME_UPDATE":
            return {
                ...state,
                updating: true
            };

        case "NODE_NAME_UPDATE_SUCCEEDED":
            return {
                ...state,
                showingUpdateDialog: false,
                updating: false
            };

        case "NODE_NAME_UPDATE_FAILED":
            return {
                ...state,
                updating: false
            };

        default:
            return state;
    }
}
