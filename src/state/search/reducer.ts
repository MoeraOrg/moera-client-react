import * as immutable from 'object-path-immutable';

import { SearchEntryInfo } from "api";
import { ClientAction } from "state/action";
import { ExtSearchEntryInfo, SearchState } from "state/search/state";
import { htmlEntities, replaceEmojis, safePreviewHtml } from "util/html";
import { ellipsize } from "util/text";

const MAX_SHORT_TITLE = 120;
const HASHTAGS = /^(?:\s*#[\p{L}\p{Nd}_]+\s*)+$/gu;

const initialState: SearchState = {
    mode: "fulltext",
    query: "",
    loading: false,
    loaded: false,
    entries: []
}

function safeguard(entry: SearchEntryInfo): ExtSearchEntryInfo {
    const ientry = immutable.wrap(entry);
    const subjectPreview = entry.bodyPreview?.subject;
    if (subjectPreview) {
        ientry.set("bodyPreview.subjectHtml", replaceEmojis(htmlEntities(ellipsize(subjectPreview, MAX_SHORT_TITLE))));
    }
    return ientry
        .update("bodyPreview.text", text => safePreviewHtml(text, null))
        .value();
}

export default (state: SearchState = initialState, action: ClientAction): SearchState => {
    switch (action.type) {
        case "SEARCH_LOAD":
            return {
                ...state,
                mode: action.payload.query.match(HASHTAGS) ? "hashtag" : "fulltext",
                query: action.payload.query,
                loading: true,
                loaded: false,
                entries: []
            };

        case "SEARCH_LOADED":
            return {
                ...state,
                loading: false,
                loaded: true,
                entries: action.payload.entries.map(safeguard)
            };

        case "SEARCH_LOAD_FAILED":
            return {
                ...state,
                loading: false
            };

        default:
            return state;
    }
}
