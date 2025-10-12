import * as immutable from 'object-path-immutable';

import { SearchEntryInfo } from "api";
import { ClientAction } from "state/action";
import { ExtSearchEntryInfo, SearchState } from "state/search/state";
import { emptyHistoryQuery, emptySearchFilter } from "state/search/empty";
import { htmlEntities, replaceEmojis, safePreviewHtml } from "util/html";
import { ellipsize } from "util/text";

const MAX_SHORT_TITLE = 120;
const HASHTAGS = /^(?:\s*#[\p{L}\p{Nd}_]+\s*)+$/gu;

const initialState: SearchState = {
    mode: "fulltext",
    tab: "content",
    query: "",
    filter: emptySearchFilter,
    loading: false,
    loaded: false,
    entries: [],
    nodes: [],
    after: Number.MAX_SAFE_INTEGER,
    nextPage: 0,
    total: 0,
    scrollPosition: 0,
    showFilters: false,
    historyQueries: {},
    history: []
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
                tab: action.payload.tab,
                filter: action.payload.filter,
                loading: true,
                loaded: false,
                entries: [],
                nodes: []
            };

        case "SEARCH_HASHTAG_LOADED":
            return {
                ...state,
                loading: false,
                loaded: true,
                entries: state.entries.concat(action.payload.slice.entries.map(safeguard)),
                after: action.payload.slice.after
            };

        case "SEARCH_TEXT_LOADED":
            return {
                ...state,
                loading: false,
                loaded: true,
                entries: state.entries.concat(action.payload.page.entries.map(safeguard)),
                nextPage: action.payload.page.page + 1,
                total: action.payload.page.total
            };

        case "SEARCH_PEOPLE_LOADED":
            return {
                ...state,
                loading: false,
                loaded: true,
                nodes: state.nodes.concat(action.payload.page.nodes),
                nextPage: action.payload.page.page + 1,
                // an empty result means there are no more results
                total: action.payload.page.nodes.length > 0 ? action.payload.page.total : state.nodes.length
            };

        case "SEARCH_LOAD_FAILED":
            return {
                ...state,
                loading: false
            };

        case "SEARCH_SCROLLED":
            return {
                ...state,
                scrollPosition: action.payload.position
            };

        case "SEARCH_OPEN_FILTER_DIALOG":
            return {
                ...state,
                showFilters: true
            };

        case "SEARCH_CLOSE_FILTER_DIALOG":
            return {
                ...state,
                showFilters: false
            };

        case "SEARCH_HISTORY_LOAD":
            if (state.historyQueries[action.payload.query]) {
                return immutable.set(state, ["historyQueries", action.payload.query, "loading"], true);
            } else {
                return immutable.assign(
                    state,
                    ["historyQueries", action.payload.query],
                    {...emptyHistoryQuery, loading: true}
                );
            }

        case "SEARCH_HISTORY_LOADED": {
            const istate = immutable.wrap(state);
            istate.assign(["historyQueries", action.payload.query], {loading: false, loaded: true});
            const queries = new Set(action.payload.history.map(h => h.query));
            istate.set("history", state.history.filter(h => !queries.has(h.query)).concat(action.payload.history));
            return istate.value();
        }

        case "SEARCH_HISTORY_LOAD_FAILED":
            return immutable.set(state, ["historyQueries", action.payload.query, "loading"], false);

        case "SEARCH_HISTORY_ADD": {
            const istate = immutable.wrap(state);
            istate.set(
                "history",
                state.history.filter(h => h.query !== action.payload.history.query).concat([action.payload.history])
            );
            return istate.value();
        }

        default:
            return state;
    }
}
