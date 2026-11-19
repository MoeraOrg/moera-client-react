import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import { Formik } from 'formik';

import { PostingInfo, SourceFormat } from "api";
import type { SharedTextType } from "api/android/types";
import { transform } from "location/compose";
import { LocationInfo } from "location/LocationInfo";
import composeReducer from "state/compose/reducer";
import { DraftPostingInfo, ExtDraftInfo } from "state/compose/state";
import linkPreviewsReducer from "state/linkpreviews/reducer";
import {
    composePageLogic, ComposePageProps, isPostingTextChanged, valuesToPostingText
} from "ui/compose/posting-compose";
import RichTextLinkPreviews from "ui/control/richtexteditor/RichTextLinkPreviews";

jest.mock("api", () => ({
    CLIENT_SETTINGS_PREFIX: "client.mercy.",
    NodeName: jest.requireActual("api/node-name").NodeName
}));
jest.mock("state/store-sagas", () => ({dispatch: jest.fn()}));
jest.mock("ui/browser", () => ({}));
jest.mock("i18n", () => ({}));
jest.mock("ui/control", () => ({}));
jest.mock("ui/hook", () => jest.requireActual("ui/hook/redux"));
jest.mock("state/home/selectors", () => {
    const context = {ownerNameOrUrl: "alice", homeOwnerNameOrUrl: "alice", searchName: "search"};
    return {getRelNodeNameContext: () => context};
});
jest.mock("state/settings/selectors", () => ({getSetting: () => 2}));
jest.mock("ui/entry/EntryLinkPreview", () => ({EntryLinkPreview: () => null}));
jest.mock("ui/entry/EntryLinkSelector", () => () => null);
jest.mock("ui/entry/LinkedPosting", () => () => null);
jest.mock("mime", () => ({getExtension: jest.fn(), getType: jest.fn()}));
jest.mock("ui/control/richtexteditor", () => ({
    ...jest.requireActual("ui/control/richtexteditor/rich-text-value"),
    ...jest.requireActual("ui/control/richtexteditor/RichTextLinkPreviews")
}));

const props: ComposePageProps = {
    nodeName: "alice", homeOwnerName: "alice", postingId: null, posting: null, draft: null,
    avatarDefault: null, fullNameDefault: null, gender: null, ownerSourceUri: null,
    features: null, smileysEnabled: false, newsFeedEnabled: false, avatarShapeDefault: "circle",
    sharedText: null, sharedTextType: null, visibilityDefault: "public", commentsVisibilityDefault: "public",
    commentAdditionDefault: "signed", commentTrustDefault: "signed", commentsHideDefault: false,
    reactionsEnabledDefault: true, reactionsNegativeEnabledDefault: true,
    reactionsPositiveDefault: "", reactionsNegativeDefault: "*",
    reactionsVisibleDefault: true, reactionTotalsVisibleDefault: true,
    sharingsVisibleDefault: false, totalSharingsVisibleDefault: false, sourceFormatDefault: "plain-text"
};

describe("link previews on opening the composer", () => {
    const url = "https://example.org/story?a=1&b=2";
    const text = `Read ${url}`;
    const html = '<a href="https://example.org/story?a=1&amp;b=2">Read this</a>';

    beforeAll(() => Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: true}));
    afterAll(() => Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: false}));

    test.each<[SourceFormat, SharedTextType, string, string]>([
        ["plain-text", "text", text, text],
        ["markdown", "text", text, text],
        ["html/visual", "text", text, "Read"],
        ["html/visual", "html", html, "Read this"]
    ])("loads a preview on mount in %s for a %s URL parameter", async (
        sourceFormatDefault: SourceFormat, type: SharedTextType, text: string, expectedBody: string
    ) => {
        const query = new URLSearchParams({text, type}).toString();
        const [navigation] = transform(new LocationInfo(), LocationInfo.fromUrl("/compose", query, null));
        const {sharedText, sharedTextType} = composeReducer(undefined, navigation);
        const values = composePageLogic.mapPropsToValues({...props, sourceFormatDefault, sharedTextType, sharedText});
        expect(values.body.text).toContain(expectedBody);
        const store = createStore(combineReducers({linkPreviews: linkPreviewsReducer}));
        const root = createRoot(document.createElement("div"));
        try {
            await act(async () => root.render(
                <Provider store={store}>
                    <Formik initialValues={values} onSubmit={() => {}}>
                        <RichTextLinkPreviews name="linkPreviews" urlsField="bodyUrls" nodeName="alice"/>
                    </Formik>
                </Provider>
            ));
            expect(store.getState().linkPreviews).toEqual({[url]: expect.objectContaining({loading: true})});
        } finally {
            act(() => root.unmount());
        }
    });

    test.each(["draft", "posting"])("keeps a dismissed preview hidden when opening a %s", (source: string) => {
        const values = composePageLogic.mapPropsToValues({...props, [source]: {bodySrc: {text}}});
        expect(values.linkPreviews.status[url]).toBe("deleted");
    });
});

describe("compose sharing permissions", () => {
    test.each<[boolean, boolean, string, string]>([
        [false, false, "private", "private"],
        [false, true, "private", "public"],
        [true, false, "public", "public"],
        [true, true, "public", "public"]
    ])("list %s, total %s produce permissions %s, %s", (
        list: boolean, total: boolean, viewSharings: string, viewTotalSharings: string
    ) => {
        const values = composePageLogic.mapPropsToValues({
            ...props, sharingsVisibleDefault: list, totalSharingsVisibleDefault: total
        });
        const text = valuesToPostingText(values, props);

        expect(text.operations).toMatchObject({viewSharings, viewTotalSharings});
    });

    test("draft permissions override the posting and account defaults", () => {
        const values = composePageLogic.mapPropsToValues({
            ...props,
            posting: {operations: {viewSharings: "public", viewTotalSharings: "public"}} as DraftPostingInfo,
            draft: {operations: {viewSharings: "private", viewTotalSharings: "public"}} as ExtDraftInfo
        });
        expect(values).toMatchObject({
            sharingsVisible: false, sharingsVisibleDefault: false,
            totalSharingsVisible: true, totalSharingsVisibleDefault: true
        });
    });

    test("posts with omitted sharing permissions keep public visibility", () => {
        const values = composePageLogic.mapPropsToValues({...props, posting: {} as DraftPostingInfo});
        expect(values).toMatchObject({sharingsVisible: true, totalSharingsVisible: true});
    });

    test("changing only sharing visibility is detected for draft saving", () => {
        const values = composePageLogic.mapPropsToValues(props);
        const text = valuesToPostingText(values, props);
        const posting = {...text, bodySrc: JSON.parse(text.bodySrc!)} as unknown as PostingInfo;

        expect(isPostingTextChanged(text, posting)).toBe(false);
        const changed = valuesToPostingText({...values, totalSharingsVisible: true}, props);
        expect(isPostingTextChanged(changed, posting)).toBe(true);
    });
});
