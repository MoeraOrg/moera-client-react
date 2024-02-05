import * as immutable from 'object-path-immutable';
import cloneDeep from 'lodash.clonedeep';

import { CLIENT_SETTINGS_PREFIX, clientSettingsBuildMetaMap } from "api";
import { ClientAction } from "state/action";
import { SettingsState } from "state/settings/state";

const emptySettings = {
    node: {
        loadingValues: false,
        loadedValues: false,
        conflict: false,
        values: new Map(),
        loadingMeta: false,
        loadedMeta: false,
        meta: new Map()
    },
    client: {
        loadingValues: false,
        loadedValues: false,
        conflict: false,
        values: new Map(),
        meta: clientSettingsBuildMetaMap()
    },
    updating: false,
    changePasswordDialogShow: false,
    changingPassword: false,
    tokens: {
        loading: false,
        loaded: false,
        tokens: [],
        dialog: {
            show: false,
            token: null,
            updating: false,
            newToken: null
        }
    },
    plugins: {
        loading: false,
        loaded: false,
        conflict: false,
        plugins: []
    },
    deleteNode: {
        loading: false,
        loaded: false,
        requested: false,
        updating: false
    }
};

const initialState: SettingsState = {
    tab: "client" as const,
    sheet: "appearance",
    ...emptySettings,
    formId: 0
};

export default (state: SettingsState = initialState, action: ClientAction): SettingsState => {
    switch (action.type) {
        case "SETTINGS_GO_TO_TAB":
            return immutable.wrap(state)
                .set("tab", action.payload.tab)
                .set("sheet", "appearance")
                .set("node.conflict", false)
                .set("client.conflict", false)
                .set("plugins.conflict", false)
                .update("formId", formId => formId + 1)
                .value();

        case "SETTINGS_GO_TO_SHEET":
            return immutable.wrap(state)
                .set("sheet", action.payload.sheet)
                .set("node.conflict", false)
                .set("client.conflict", false)
                .set("plugins.conflict", false)
                .value();

        case "DISCONNECTED_FROM_HOME":
            return {
                ...state,
                ...emptySettings
            };

        case "SETTINGS_NODE_VALUES_LOAD":
            return immutable.set(state, "node.loadingValues", true);

        case "SETTINGS_NODE_VALUES_LOADED": {
            let values = new Map();
            action.payload.settings.forEach(({name, value}) => values.set(name, value));
            return immutable.wrap(state)
                .set("node.loadingValues", false)
                .set("node.loadedValues", true)
                .set("node.values", values)
                .update("formId", formId => formId + 1)
                .value();
        }

        case "SETTINGS_NODE_VALUES_LOAD_FAILED":
            return immutable.set(state, "node.loadingValues", false);

        case "SETTINGS_NODE_VALUES_UNSET":
            return immutable.wrap(state)
                .set("node.loadingValues", false)
                .set("node.loadedValues", false)
                .set("node.conflict", false)
                .set("node.values", new Map())
                .update("formId", formId => formId + 1)
                .value();

        case "SETTINGS_NODE_CONFLICT":
            return immutable.set(state, "node.conflict", true);

        case "SETTINGS_NODE_CONFLICT_CLOSE":
            return immutable.set(state, "node.conflict", false);

        case "SETTINGS_NODE_META_LOAD":
            return immutable.set(state, "node.loadingMeta", true);

        case "SETTINGS_NODE_META_LOADED": {
            const metadata = new Map();
            action.payload.meta.forEach(meta => metadata.set(meta.name, meta));
            return immutable.wrap(state)
                .set("node.loadingMeta", false)
                .set("node.loadedMeta", true)
                .set("node.meta", metadata)
                .update("formId", formId => formId + 1)
                .value();
        }

        case "SETTINGS_NODE_META_LOAD_FAILED":
            return immutable.set(state, "node.loadingMeta", false);

        case "SETTINGS_NODE_META_UNSET":
            return immutable.wrap(state)
                .set("node.loadingMeta", false)
                .set("node.loadedMeta", false)
                .set("node.meta", new Map())
                .update("formId", formId => formId + 1)
                .value();

        case "SETTINGS_CLIENT_VALUES_LOAD":
            return immutable.set(state, "client.loadingValues", true);

        case "SETTINGS_CLIENT_VALUES_LOADED": {
            const values = new Map(state.client.values.entries());
            action.payload.settings.forEach(({name, value}) => values.set(name, value ?? null));
            return immutable.wrap(state)
                .set("client.loadingValues", false)
                .set("client.loadedValues", true)
                .set("client.values", values)
                .update("formId", formId => formId + 1)
                .value();
        }

        case "SETTINGS_CLIENT_VALUES_LOAD_FAILED":
            return immutable.set(state, "client.loadingValues", false);

        case "SETTINGS_CLIENT_VALUES_SET": {
            const values = new Map(state.client.values.entries());
            action.payload.settings.forEach(({name, value}) => values.set(name, value ?? null));
            return immutable.set(state, "client.values", values);
        }

        case "SETTINGS_CLIENT_VALUES_UNSET":
            return immutable.wrap(state)
                .set("client.loadingValues", false)
                .set("client.loadedValues", false)
                .set("client.conflict", false)
                .set("client.values", new Map())
                .update("formId", formId => formId + 1)
                .value();

        case "SETTINGS_CLIENT_CONFLICT":
            return immutable.set(state, "client.conflict", true);

        case "SETTINGS_CLIENT_CONFLICT_CLOSE":
            return immutable.set(state, "client.conflict", false);

        case "SETTINGS_UPDATE":
            return {
                ...state,
                updating: true
            };

        case "SETTINGS_UPDATE_SUCCEEDED":
            const nodeValues = new Map(state.node.values);
            const clientValues = new Map(state.client.values);
            action.payload.settings.forEach(({name, value}) => {
                if (name.startsWith(CLIENT_SETTINGS_PREFIX)) {
                    if (value != null) {
                        clientValues.set(name, value);
                    } else {
                        const meta = state.client.meta.get(name);
                        if (meta?.defaultValue != null) {
                            clientValues.set(name, meta.defaultValue);
                        }
                    }
                } else {
                    if (value != null) {
                        nodeValues.set(name, value);
                    } else {
                        const meta = state.node.meta.get(name);
                        if (meta?.defaultValue != null) {
                            nodeValues.set(name, meta.defaultValue);
                        }
                    }
                }
            });
            return immutable.wrap(state)
                .set("node.conflict", false)
                .set("client.conflict", false)
                .set("plugins.conflict", false)
                .set("node.values", nodeValues)
                .set("client.values", clientValues)
                .set("updating", false)
                .update("formId", formId => formId + 1)
                .value();

        case "SETTINGS_UPDATE_FAILED":
            return {
                ...state,
                updating: false
            };

        case "SETTINGS_CHANGE_PASSWORD_DIALOG_OPEN":
            return {
                ...state,
                changePasswordDialogShow: true
            };

        case "SETTINGS_CHANGE_PASSWORD_DIALOG_CLOSE":
            return {
                ...state,
                changePasswordDialogShow: false
            };

        case "SETTINGS_CHANGE_PASSWORD":
            return {
                ...state,
                changingPassword: true
            }

        case "SETTINGS_CHANGED_PASSWORD":
            return {
                ...state,
                changingPassword: false,
                changePasswordDialogShow: false
            }

        case "SETTINGS_CHANGE_PASSWORD_FAILED":
            return {
                ...state,
                changingPassword: false
            }

        case "SETTINGS_TOKENS_LOAD":
            return immutable.set(state, "tokens.loading", true);

        case "SETTINGS_TOKENS_LOADED":
            return immutable.assign(state, "tokens", {
                loading: false,
                loaded: true,
                tokens: action.payload.tokens
            });

        case "SETTINGS_TOKENS_LOAD_FAILED":
            return immutable.set(state, "tokens.loading", false);

        case "SETTINGS_TOKENS_UNSET":
            return immutable.set(state, "tokens", cloneDeep(initialState.tokens));

        case "SETTINGS_TOKENS_DIALOG_OPEN":
            return immutable.assign(state, "tokens.dialog", {
                show: true,
                token: action.payload.token
            });

        case "SETTINGS_TOKENS_DIALOG_CLOSE":
            return immutable.set(state, "tokens.dialog.show", false);

        case "SETTINGS_TOKENS_CREATE":
        case "SETTINGS_TOKENS_UPDATE":
            return immutable.set(state, "tokens.dialog.updating", true);

        case "SETTINGS_TOKENS_CREATED":
            return immutable.wrap(state)
                .assign("tokens.dialog", {
                    show: false,
                    updating: false,
                    newToken: action.payload.token
                })
                .set("tokens.tokens", [{
                    ...action.payload.token,
                    token: action.payload.token.token.substring(0, 4) + "\u2026"
                }].concat(state.tokens.tokens))
                .value();

        case "EVENT_HOME_TOKEN_ADDED":
            if (state.tokens.loaded) {
                return immutable.set(state, "tokens.tokens", [action.payload.token].concat(state.tokens.tokens));
            }
            return state;

        case "SETTINGS_TOKENS_UPDATED":
            return immutable.wrap(state)
                .assign("tokens.dialog", {
                    show: false,
                    updating: false
                })
                .set("tokens.tokens",
                    state.tokens.tokens.map(t => t.id === action.payload.token.id ? action.payload.token : t)
                )
                .value();

        case "EVENT_HOME_TOKEN_UPDATED":
            if (state.tokens.loaded) {
                return immutable.set(state, "tokens.tokens",
                    state.tokens.tokens.map(t => t.id === action.payload.token.id ? action.payload.token : t))
            }
            return state;

        case "SETTINGS_TOKENS_CREATE_FAILED":
        case "SETTINGS_TOKENS_UPDATE_FAILED":
            return immutable.set(state, "tokens.dialog.updating", false);

        case "SETTINGS_TOKENS_DELETED":
            return immutable.set(state, "tokens.tokens", state.tokens.tokens.filter(t => t.id !== action.payload.id));

        case "EVENT_HOME_TOKEN_DELETED":
            if (state.tokens.loaded) {
                return immutable.set(state, "tokens.tokens",
                    state.tokens.tokens.filter(t => t.id !== action.payload.id));
            }
            return state;

        case "SETTINGS_TOKENS_NEW_TOKEN_CLOSE":
            return immutable.set(state, "tokens.dialog.newToken", null);

        case "SETTINGS_PLUGINS_LOAD":
            return immutable.set(state, "plugins.loading", true);

        case "SETTINGS_PLUGINS_LOADED":
            return immutable.assign(state, "plugins", {
                loading: false,
                loaded: true,
                plugins: action.payload.plugins
            });

        case "SETTINGS_PLUGINS_LOAD_FAILED":
            return immutable.set(state, "plugins.loading", false);

        case "SETTINGS_PLUGINS_UNSET":
            return immutable.set(state, "plugins", cloneDeep(initialState.plugins));

        case "SETTINGS_PLUGINS_DELETED":
            return immutable.set(state, "plugins.plugins",
                state.plugins.plugins.filter(p => p.name !== action.payload.name));

        case "SETTINGS_PLUGINS_CONFLICT":
            return immutable.set(state, "plugins.conflict", true);

        case "SETTINGS_PLUGINS_CONFLICT_CLOSE":
            return immutable.set(state, "plugins.conflict", false);

        case "SETTINGS_DELETE_NODE_REQUEST_LOAD":
            return immutable.set(state, "deleteNode.loading", true);

        case "SETTINGS_DELETE_NODE_REQUEST_LOADED":
            return immutable.assign(state, "deleteNode", {
                loading: false,
                loaded: true,
                requested: action.payload.requested
            });

        case "SETTINGS_DELETE_NODE_REQUEST_LOAD_FAILED":
            return immutable.set(state, "deleteNode.loading", false);

        case "SETTINGS_DELETE_NODE_REQUEST_SEND":
        case "SETTINGS_DELETE_NODE_REQUEST_CANCEL":
            return immutable.set(state, "deleteNode.updating", true);

        case "SETTINGS_DELETE_NODE_REQUEST_UPDATE_FAILED":
            return immutable.set(state, "deleteNode.updating", false);

        case "SETTINGS_DELETE_NODE_REQUEST_STATUS_SET":
            return immutable.assign(state, "deleteNode", {
                updating: false,
                requested: action.payload.requested
            });

        case "SETTINGS_DELETE_NODE_REQUEST_UNSET":
            return immutable.set(state, "deleteNode.loaded", false);

        case "EVENT_HOME_DELETE_NODE_STATUS_UPDATED":
            return immutable.set(state, "deleteNode.requested", action.payload.requested);

        default:
            return state;
    }
}
