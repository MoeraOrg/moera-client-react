export const NAMING_NAMES_USED = "NAMING_NAMES_USED";
export const namingNamesUsed = (names) => ({
    type: NAMING_NAMES_USED,
    payload: {names}
});

export const NAMING_NAME_LOAD = "NAMING_NAME_LOAD";
export const namingNameLoad = (name) => ({
    type: NAMING_NAME_LOAD,
    payload: {name}
});

export const NAMING_NAME_LOADED = "NAMING_NAME_LOADED";
export const namingNameLoaded = (name, nodeUri, updated) => ({
    type: NAMING_NAME_LOADED,
    payload: {name, nodeUri, updated}
});

export const NAMING_NAME_LOAD_FAILED = "NAMING_NAME_LOAD_FAILED";
export const namingNameLoadFailed = (name) => ({
    type: NAMING_NAME_LOAD_FAILED,
    payload: {name}
});

export const NAMING_NAMES_PURGE = "NAMING_NAMES_PURGE";
export const namingNamesPurge = (names) => ({
    type: NAMING_NAMES_PURGE,
    payload: {names}
});

export const NAMING_NAMES_MAINTENANCE = "NAMING_NAMES_MAINTENANCE";
export const namingNamesMaintenance = () => ({
    type: NAMING_NAMES_MAINTENANCE
});

export const NAMING_NAMES_POPULATE = "NAMING_NAMES_POPULATE";
export const namingNamesPopulate = (names) => ({
    type: NAMING_NAMES_POPULATE,
    payload: {names}
});
