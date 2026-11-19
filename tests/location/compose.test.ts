import { LocationInfo, locationTransform } from "location";
import { build } from "location/compose";
import { composeSharedTextSet } from "state/compose/actions";
import composeReducer from "state/compose/reducer";
import { isComposeBecameReady, isComposeSharedTextToBeLoaded } from "state/compose/selectors";
import { ComposeState } from "state/compose/state";
import { ClientState } from "state/state";

jest.mock("api", () => ({}));
jest.mock("i18n", () => ({}));
jest.mock("ui/browser", () => ({isAndroidApp: () => true}));
jest.mock("util/html", () => ({}));
jest.mock("util/media-images", () => ({}));

function openComposer(query: string, previous?: ComposeState): ComposeState {
    const destination = LocationInfo.fromUrl("/compose", query, null);
    const [navigation] = locationTransform(new LocationInfo(), destination);
    return composeReducer(previous, navigation);
}

test("opens a new post with decoded text before checking the Android interface", () => {
    const text = "Привет + Moera!\nhttps://example.org/story?a=1&b=2#more";
    const compose = openComposer(new URLSearchParams({text}).toString());
    expect(compose).toMatchObject({sharedText: text, sharedTextType: "text"});
    expect(isComposeSharedTextToBeLoaded({compose} as ClientState)).toBe(false);
    expect(isComposeBecameReady({compose} as ClientState)).toBe(true);
});

test("reopening a prefilled composer initializes a fresh form even for the same text", () => {
    const query = "?text=%3Cb%3Ehello%3C%2Fb%3E&type=html";
    const compose = openComposer(query);
    expect(compose).toMatchObject({sharedText: "<b>hello</b>", sharedTextType: "html"});
    expect(openComposer(query, compose).formId).not.toBe(compose.formId);
});

test.each<[string, string | null, string | null]>([
    ["?id=post-1&text=ignored", "post-1", null],
    ["?draft=draft-1&text=ignored", null, "draft-1"]
])("opens saved content for %s", (query: string, postingId: string | null, draftId: string | null) => {
    expect(openComposer(query)).toMatchObject({postingId, draftId, sharedText: null});
});

test("omits shared text and its type from generated compose URLs", () => {
    const query = "?text=%3Cb%3Ehello%3C%2Fb%3E&type=html";
    const compose = openComposer(query);
    const state = {compose, node: {owner: {name: null}}} as ClientState;
    expect(build(state, new LocationInfo()).toUrl()).toBe("/compose");
    expect(build({...state, compose: {...compose, draftId: "saved"}}, new LocationInfo()).toUrl())
        .toBe("/compose?draft=saved");
    expect(build({...state, compose: {...compose, postingId: "post-1"}}, new LocationInfo()).toUrl())
        .toBe("/compose?id=post-1");
    const fromAndroid = composeReducer(openComposer(""), composeSharedTextSet("shared privately", "text"));
    expect(build({...state, compose: fromAndroid}, new LocationInfo()).toUrl()).toBe("/compose");
});

test("treats an unsupported input type as plain text", () => {
    const compose = openComposer("?text=%23%20hello&type=markdown");
    expect(compose).toMatchObject({sharedText: "# hello", sharedTextType: "text"});
    const state = {compose, node: {owner: {name: null}}} as ClientState;
    expect(build(state, new LocationInfo()).toUrl()).toBe("/compose");
});

test("Android supplies text only when the URL omits it", () => {
    const compose = openComposer("?text=");
    expect(compose.sharedText).toBe("");
    expect(isComposeSharedTextToBeLoaded({compose} as ClientState)).toBe(false);
    const nextCompose = openComposer("", compose);
    expect(isComposeSharedTextToBeLoaded({compose: nextCompose} as ClientState)).toBe(true);
});
