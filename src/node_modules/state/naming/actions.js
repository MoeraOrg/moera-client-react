export const NAMING_NAME_USED = "NAMING_NAME_USED";
export const namingNameUsed = (name) => ({
    type: NAMING_NAME_USED,
    payload: {name}
});

export const NAMING_NAME_LOAD = "NAMING_NAME_LOAD";
export const namingNameLoad = (name) => ({
    type: NAMING_NAME_LOAD,
    payload: {name}
});

export const NAMING_NAME_LOADED = "NAMING_NAME_LOADED";
export const namingNameLoaded = (name, latest, nodeUri) => ({
    type: NAMING_NAME_LOADED,
    payload: {name, latest, nodeUri}
});

export const NAMING_NAME_LOAD_FAILED = "NAMING_NAME_LOAD_FAILED";
export const namingNameLoadFailed = (name) => ({
    type: NAMING_NAME_LOAD_FAILED,
    payload: {name}
});

export const NAMING_NAME_PURGE = "NAMING_NAME_PURGE";
export const namingNamePurge = (name) => ({
    type: NAMING_NAME_PURGE,
    payload: {name}
});

export const NAMING_NAMES_MAINTENANCE = "NAMING_NAMES_MAINTENANCE";
export const namingNamesMaintenance = () => ({
    type: NAMING_NAMES_MAINTENANCE
});
