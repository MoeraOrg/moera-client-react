import { SearchFilter } from "state/search/state";

export const emptySearchFilter: SearchFilter = {
    entryType: "posting",
    inNewsfeed: false,
    ownedByMe: false,
    repliedToMe: false,
    minImageCount: null,
    videoPresent: false,
    safeSearch: null,
    beforeDate: "now",
    datePeriod: "any"
};
