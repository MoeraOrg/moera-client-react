import { applyMiddleware, legacy_createStore } from 'redux';

import { PostingInfo } from "api";
import { ClientAction } from "state/action";
import { ActionContext, actionWithoutPayload } from "state/action-types";
import { ownerSwitch } from "state/node/actions";
import { postingSet } from "state/postings/actions";
import * as cache from "state/postings/cache";
import reducer from "state/postings/reducer";
import sagas from "state/postings/sagas";
import triggers from "state/postings/triggers";
import { collectSagas } from "state/saga";
import { ClientState } from "state/state";
import { createStoreMiddleware } from "state/store-middleware";
import { collectTriggers } from "state/trigger";

jest.mock("api", () => ({}));
jest.mock("ui/browser", () => ({}));
jest.mock("i18n", () => ({}));
jest.mock("util/media-images", () => ({}));
jest.mock("util/text", () => ({}));
jest.mock("util/html", () => ({safeHtml: (text: string) => text, safePreviewHtml: (text: string) => text}));

const posting = {id: "post", body: {text: "Body"}} as PostingInfo;
const tick = () => new Promise(resolve => setTimeout(resolve, 0));

describe("posting maintenance scheduling", () => {
    let oldStore: typeof window.store;

    beforeEach(() => {
        oldStore = window.store;
        jest.spyOn(Date, "now").mockReturnValue(1_000_000);
        const initial = {
            node: {owner: {name: "current"}}, home: {owner: {name: "home"}},
            postings: {
                spare: Object.fromEntries(Array.from({length: 300}, (_, i) =>
                    [`post-${i}`, {posting, lastUsedAt: 800}]
                )),
                remote: {post: {posting, lastUsedAt: 100}}
            },
            feeds: {}
        } as unknown as ClientState;
        const middleware = createStoreMiddleware(collectTriggers(triggers), collectSagas(sagas));
        window.store = legacy_createStore((state = initial, action: ClientAction) => {
            const context = {
                ownerNameOrUrl: state.node.owner.name, homeOwnerNameOrUrl: "home"
            } as ActionContext;
            return {
                ...state,
                node: action.type === "OWNER_SWITCH"
                    ? {...state.node, owner: {...state.node.owner, name: action.payload.nodeName}}
                    : state.node,
                postings: reducer(state.postings, {...action, context})
            };
        }, applyMiddleware(middleware));
    });

    afterEach(() => {
        window.store = oldStore;
        jest.restoreAllMocks();
    });

    test("cleans up on the ten-minute pulse and coalesces synchronous requests", async () => {
        const collected = jest.spyOn(cache, "getReferencedPostings");
        window.store.dispatch(actionWithoutPayload("PULSE_1MIN"));
        await tick();

        expect(window.store.getState().postings.remote?.post).toBeDefined();
        expect(collected).not.toHaveBeenCalled();

        window.store.dispatch(actionWithoutPayload("PULSE_10MIN"));
        window.store.dispatch(actionWithoutPayload("PULSE_10MIN"));
        await tick();

        expect(window.store.getState().postings.remote).toBeUndefined();
        expect(collected).toHaveBeenCalledTimes(1);
    });

    test("defers cleanup after loading until wake-up while protecting the fresh posting", async () => {
        const collected = jest.spyOn(cache, "getReferencedPostings");
        window.store.dispatch(postingSet(posting, "fresh"));
        await tick();

        expect(window.store.getState().postings.remote?.post).toBeDefined();
        expect(collected).not.toHaveBeenCalled();

        window.store.dispatch(actionWithoutPayload("WAKE_UP"));
        await tick();

        expect(window.store.getState().postings.remote).toBeUndefined();
        expect(window.store.getState().postings.fresh?.post?.posting?.body.text).toBe("Body");
        expect(collected).toHaveBeenCalledTimes(1);
    });

    test("cleans unused postings after navigation without dropping fresh nodes", async () => {
        window.store.dispatch(ownerSwitch("remote", "https://remote.example"));
        window.store.dispatch(postingSet({...posting, id: "new"}, "fresh"));
        await tick();

        // Changing owners does not clear an entire node; only old unused entries are evicted.
        expect(window.store.getState().postings.fresh?.new?.posting?.body.text).toBe("Body");
        expect(Object.keys(window.store.getState().postings.spare!)).toHaveLength(299);
    });
});
