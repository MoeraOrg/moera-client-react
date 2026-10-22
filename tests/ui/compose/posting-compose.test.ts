import { PostingInfo } from "api";
import { DraftPostingInfo, ExtDraftInfo } from "state/compose/state";
import {
    composePageLogic, ComposePageProps, isPostingTextChanged, valuesToPostingText
} from "ui/compose/posting-compose";

jest.mock("api", () => ({
    CLIENT_SETTINGS_PREFIX: "client.mercy.",
    NodeName: jest.requireActual("api/node-name").NodeName
}));
jest.mock("state/store-sagas", () => ({dispatch: jest.fn()}));
jest.mock("ui/browser", () => ({}));
jest.mock("i18n", () => ({}));
jest.mock("ui/control", () => ({}));
jest.mock("ui/hook", () => ({}));
jest.mock("ui/entry/EntryLinkPreview", () => ({}));
jest.mock("ui/entry/EntryLinkSelector", () => ({}));
jest.mock("sanitize-html", () => Object.assign(jest.fn(), {
    defaults: {allowedTags: [], allowedAttributes: {}, allowedSchemes: []}
}));
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
