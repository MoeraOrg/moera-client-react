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

test("opens a new post with decoded subject and text before checking the Android interface", () => {
    const subject = "Тема + планы & итоги #1";
    const text = "Привет + Moera!\nhttps://example.org/story?a=1&b=2#more";
    const compose = openComposer(new URLSearchParams({subject, text}).toString());
    expect(compose).toMatchObject({sharedSubject: subject, sharedText: text, sharedTextType: "text"});
    expect(isComposeSharedTextToBeLoaded({compose} as ClientState)).toBe(false);
    expect(isComposeBecameReady({compose} as ClientState)).toBe(true);
});

test("reopening a prefilled composer initializes a fresh form even for the same text", () => {
    const query = "?text=%3Cb%3Ehello%3C%2Fb%3E&type=html";
    const compose = openComposer(query + "&nolinkpreviews=true");
    expect(compose).toMatchObject({sharedText: "<b>hello</b>", sharedTextType: "html", sharedTextNoLinkPreviews: true});
    const reopened = openComposer(query + "&nolinkpreviews=false", compose);
    expect(reopened.formId).not.toBe(compose.formId);
    expect(reopened.sharedTextNoLinkPreviews).toBe(false);
});

test.each<[string, string | null, string | null]>([
    ["?id=post-1&subject=ignored&text=ignored&nolinkpreviews", "post-1", null],
    ["?draft=draft-1&subject=ignored&text=ignored&nolinkpreviews", null, "draft-1"]
])("opens saved content for %s", (query: string, postingId: string | null, draftId: string | null) => {
    expect(openComposer(query)).toMatchObject({
        postingId, draftId, sharedSubject: null, sharedText: null, sharedTextNoLinkPreviews: false
    });
});

test("omits prefill parameters from generated compose URLs", () => {
    const query = "?subject=Greeting&text=%3Cb%3Ehello%3C%2Fb%3E&type=html&nolinkpreviews";
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
    const nextCompose = openComposer("?subject=Greeting&nolinkpreviews", compose);
    expect(isComposeSharedTextToBeLoaded({compose: nextCompose} as ClientState)).toBe(true);
    const fromAndroid = composeReducer(nextCompose, composeSharedTextSet("Shared body", "text"));
    expect(fromAndroid).toMatchObject({
        sharedSubject: "Greeting", sharedText: "Shared body", sharedTextNoLinkPreviews: false
    });
    expect(openComposer("", fromAndroid).sharedSubject).toBeNull();
});
