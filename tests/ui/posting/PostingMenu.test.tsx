import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';

import { PostingInfo } from "api";
import { ClientAction } from "state/action";
import { ClientState } from "state/state";
import { MenuItem } from "ui/control/dropdownmenu/dropdown-menu-types";
import PostingMenu from "ui/posting/PostingMenu";
import { MinimalStoryInfo } from "ui/types";
import { REL_CURRENT } from "util/rel-node-name";

const mockDispatch = jest.fn();
let mockConfirmDelete = false;
const mockState = {
    home: {owner: {name: "author"}, root: {location: "https://author", api: "https://author/moera/api"}},
    node: {owner: {name: "author"}, root: {location: "https://author", api: "https://author/moera/api"}, features: null},
    tokens: {"https://author": {token: "token", permissions: ["other"]}},
    postings: {}
};

jest.mock("api", () => ({}));
jest.mock("ui/browser", () => ({}));
jest.mock("i18n", () => ({}));
jest.mock("util/media-images", () => ({}));
jest.mock("react-redux", () => ({useSelector: (selector: (state: unknown) => unknown) => selector(mockState)}));
jest.mock("react-i18next", () => ({useTranslation: () => ({t: (key: string) => key})}));
jest.mock("state/settings/selectors", () => ({
    getSetting: (_state: ClientState, name: string) => name === "posting.delete.confirm" ? mockConfirmDelete : null
}));
jest.mock("ui/hook", () => ({useDispatcher: () => mockDispatch}));
jest.mock("ui/control", () => ({
    DropdownMenu: ({content}: {content: React.ReactNode}) => <>{content}</>,
    DropdownMenuItems: ({items}: {items: MenuItem[]}) => <>
        {items.map((item: MenuItem, index: number) => "title" in item && item.show
            ? <button key={index} type="button" onClick={item.onClick}>{item.title}</button>
            : null)}
    </>
}));

describe("posting menu deletion", () => {
    let container: HTMLDivElement;
    let root: Root;
    let posting: PostingInfo;
    const story: MinimalStoryInfo = {id: "repost", publishedAt: 200, moment: 200};

    beforeAll(() => Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: true}));
    afterAll(() => Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: false}));

    beforeEach(() => {
        mockConfirmDelete = false;
        container = document.createElement("div");
        document.body.appendChild(container);
        root = createRoot(container);
        posting = {
            id: "post-1", revisionId: "revision-1", totalRevisions: 1, ownerName: "author", bodySrcHash: "hash",
            body: {text: "My post"}, heading: "My post", createdAt: 100, revisionCreatedAt: 100,
            feedReferences: [
                {feedName: "timeline", storyId: "original", publishedAt: 100, moment: 100},
                {feedName: "timeline", storyId: "repost", publishedAt: 200, moment: 200},
                {feedName: "timeline", storyId: "another-repost", publishedAt: 300, moment: 300}
            ]
        };
    });

    afterEach(() => {
        act(() => root.unmount());
        container.remove();
    });

    function clickDelete(feedName: string | null = "timeline", targetStory: MinimalStoryInfo | null = story): ClientAction {
        act(() => root.render(<PostingMenu posting={posting} feedName={feedName} story={targetStory}/>));
        const button = Array.from(container.querySelectorAll("button"))
            .find((item: HTMLButtonElement) => item.textContent === "delete");
        expect(button).toBeDefined();
        act(() => button!.click());
        expect(mockDispatch).toHaveBeenCalledTimes(1);
        return mockDispatch.mock.calls[0][0];
    }

    function confirmDeletion(action: ClientAction, deleteAll = false) {
        expect(action.type).toBe("CONFIRM_BOX");
        if (action.type !== "CONFIRM_BOX" || typeof action.payload.attributes.onYes !== "function") {
            throw new Error("Expected a deletion confirmation handler");
        }
        return action.payload.attributes.onYes(deleteAll);
    }

    test("deletes only the selected repost of an own posting when confirmation is disabled", () => {
        posting.feedReferences = posting.feedReferences!.slice(0, 2);

        expect(clickDelete()).toMatchObject({
            type: "STORY_DELETE",
            payload: {nodeName: REL_CURRENT, story, feedName: "timeline", postingId: "post-1"}
        });
    });

    test("preserves other copies of a remote posting when confirmation is disabled", () => {
        posting.ownerName = "remote-author";
        posting.receiverName = "remote-author";
        posting.receiverPostingId = "remote-post";

        expect(clickDelete()).toMatchObject({
            type: "STORY_DELETE",
            payload: {nodeName: REL_CURRENT, story, feedName: "timeline", postingId: "post-1"}
        });
    });

    test("preserves timeline publications when deleting a news story without confirmation", () => {
        const newsStory = {id: "news-story", publishedAt: 400, moment: 400};
        posting.feedReferences = [
            {feedName: "timeline", storyId: "original", publishedAt: 100, moment: 100},
            {feedName: "news", storyId: "news-story", publishedAt: 400, moment: 400}
        ];

        expect(clickDelete("news", newsStory)).toMatchObject({
            type: "STORY_DELETE",
            payload: {nodeName: REL_CURRENT, story: newsStory, feedName: "news", postingId: "post-1"}
        });
    });

    test("deletes only the selected repost when the confirmation checkbox is left unchecked", () => {
        mockConfirmDelete = true;
        const action = clickDelete();

        expect(action).toMatchObject({payload: {attributes: {dontShowAgainBox: true}}});
        expect(confirmDeletion(action)).toMatchObject({
            type: "STORY_DELETE",
            payload: {nodeName: REL_CURRENT, story, feedName: "timeline", postingId: "post-1"}
        });
    });

    test("deletes the whole posting when deletion of all reposts is explicitly selected", () => {
        mockConfirmDelete = true;

        expect(confirmDeletion(clickDelete(), true)).toMatchObject({
            type: "POSTING_DELETE", payload: {id: "post-1", nodeName: REL_CURRENT}
        });
    });

    test.each([false, true])("deletes the last publication with confirmation set to %s", (confirmDelete: boolean) => {
        mockConfirmDelete = confirmDelete;
        posting.feedReferences = [{feedName: "timeline", storyId: "repost", publishedAt: 200, moment: 200}];

        const action = clickDelete();

        expect(confirmDelete ? confirmDeletion(action) : action).toMatchObject({
            type: "POSTING_DELETE", payload: {id: "post-1", nodeName: REL_CURRENT}
        });
    });

    test.each([false, true])("deletes from the posting page with confirmation set to %s", (confirmDelete: boolean) => {
        mockConfirmDelete = confirmDelete;

        const action = clickDelete(null, null);

        if (confirmDelete) {
            expect(action).toMatchObject({payload: {attributes: {
                message: "delete-post-with-reposts", dontShowAgainBox: false
            }}});
        }
        expect(confirmDelete ? confirmDeletion(action) : action).toMatchObject({
            type: "POSTING_DELETE", payload: {id: "post-1", nodeName: REL_CURRENT}
        });
    });
});
