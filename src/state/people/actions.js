export const PEOPLE_GO_TO_TAB = "PEOPLE_GO_TO_TAB";
export const peopleGoToTab = (tab) => ({
    type: PEOPLE_GO_TO_TAB,
    payload: {tab}
});

export const PEOPLE_GENERAL_LOAD = "PEOPLE_GENERAL_LOAD";
export const peopleGeneralLoad = () => ({
    type: PEOPLE_GENERAL_LOAD
});

export const PEOPLE_GENERAL_LOADED = "PEOPLE_GENERAL_LOADED";
export const peopleGeneralLoaded = (info) => ({
    type: PEOPLE_GENERAL_LOADED,
    payload: {info}
});

export const PEOPLE_GENERAL_LOAD_FAILED = "PEOPLE_GENERAL_LOAD_FAILED";
export const peopleGeneralLoadFailed = () => ({
    type: PEOPLE_GENERAL_LOAD_FAILED
});
