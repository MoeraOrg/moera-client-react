import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';

import { emptyFeed } from "state/feeds/empty";
import { ExtStoryInfo, FeedState } from "state/feeds/state";
import { ClientState } from "state/state";
import FeedPage from "ui/feed/FeedPage";

const mockDispatch = jest.fn();
let mockState: ClientState;

jest.mock("api", () => ({}));
jest.mock("ui/browser", () => ({isAndroidGooglePlay: () => false}));
jest.mock("i18n", () => ({}));
jest.mock("util/media-images", () => ({}));
jest.mock("react-redux", () => ({useSelector: (selector: (state: ClientState) => unknown) => selector(mockState)}));
jest.mock("react-i18next", () => ({useTranslation: () => ({t: (key: string) => key})}));
jest.mock("ui/hook", () => ({
    useDebounce: jest.requireActual("ui/hook/misc").useDebounce,
    useDispatcher: () => mockDispatch,
    isTinyScreen: () => false
}));
jest.mock("ui/control", () => ({FeedTopBox: ({children}: {children: React.ReactNode}) => children}));
jest.mock("ui/feed/FeedTopButton", () => () => null);
jest.mock("ui/feed/FeedSkipPinnedButton", () => () => null);
jest.mock("ui/feed/FeedSentinel", () => () => null);
jest.mock("ui/feed/nocontent/FeedNoContent", () => () => null);
jest.mock("ui/feed/FeedStory", () => ({story}: {story: ExtStoryInfo}) =>
    <article className="posting" data-moment={story.moment} data-viewed="true"/>
);

function story(moment: number): ExtStoryInfo {
    return {id: `story-${moment}`, storyType: "posting-added", moment, createdAt: 0, publishedAt: 0};
}

describe("feed scrolling", () => {
    let container: HTMLDivElement;
    let root: Root;
    let feed: FeedState;
    let positions: Record<number, number>;

    beforeAll(() => Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: true}));
    afterAll(() => Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: false}));

    beforeEach(() => {
        jest.useFakeTimers();
        feed = {...emptyFeed, after: 0, stories: [story(300), story(200), story(100)]};
        mockState = {
            home: {owner: {name: "alice"}, root: {location: null, api: null}},
            node: {owner: {name: "alice"}, root: {location: null, api: null}},
            settings: {client: {meta: new Map(), values: new Map()}},
            feeds: {alice: {news: feed}},
            postings: {}
        } as unknown as ClientState;
        positions = {400: -700, 300: -450, 200: -150, 100: 240, 50: 600};
        jest.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
            const top = positions[Number(this.dataset.moment)] ?? 0;
            return {top, bottom: top + 300, height: 300} as DOMRect;
        });
        jest.spyOn(window, "scrollTo").mockImplementation(() => undefined);
        jest.spyOn(window, "scrollBy").mockImplementation(() => undefined);
        jest.replaceProperty(window, "scrollY", 500);
        container = document.createElement("div");
        document.body.appendChild(container);
        root = createRoot(container);
    });

    afterEach(() => {
        act(() => root.unmount());
        container.remove();
        jest.restoreAllMocks();
        jest.useRealTimers();
    });

    function render() {
        mockState = {...mockState};
        act(() => root.render(<FeedPage nodeName="alice" feedName="news" visible/>));
    }

    test("does not realign the current posting when a new story is prepended", () => {
        render();
        act(() => window.dispatchEvent(new Event("scroll")));
        jest.mocked(window.scrollTo).mockClear();
        jest.mocked(window.scrollBy).mockClear();

        feed.stories = [story(400), ...feed.stories];
        render();

        expect(window.scrollTo).not.toHaveBeenCalled();
        expect(window.scrollBy).not.toHaveBeenCalled();
    });

    test("does not jump to the top when a story arrives before the first scroll event", () => {
        render();
        jest.mocked(window.scrollTo).mockClear();
        jest.mocked(window.scrollBy).mockClear();

        feed.stories = [story(400), ...feed.stories];
        render();

        expect(window.scrollTo).not.toHaveBeenCalled();
        expect(window.scrollBy).not.toHaveBeenCalled();
    });

    test("preserves the exact posting offset when the browser does not anchor a prepend", () => {
        render();
        act(() => window.dispatchEvent(new Event("scroll")));
        jest.mocked(window.scrollTo).mockClear();
        jest.mocked(window.scrollBy).mockClear();

        positions[100] += 501;
        feed.stories = [story(400), ...feed.stories];
        render();

        expect(window.scrollTo).not.toHaveBeenCalled();
        expect(window.scrollBy).toHaveBeenCalledWith(0, 501);
    });

    test("keeps new stories visible when the page is already at the top", () => {
        render();
        jest.replaceProperty(window, "scrollY", 0);
        act(() => window.dispatchEvent(new Event("scroll")));
        jest.mocked(window.scrollTo).mockClear();
        jest.mocked(window.scrollBy).mockClear();

        positions[100] += 501;
        feed.stories = [story(400), ...feed.stories];
        render();

        expect(window.scrollTo).not.toHaveBeenCalled();
        expect(window.scrollBy).not.toHaveBeenCalled();
    });

    test("refreshes the saved offset between consecutive prepends without a scroll event", () => {
        render();
        act(() => window.dispatchEvent(new Event("scroll")));
        positions[100] += 501;
        feed.stories = [story(400), ...feed.stories];
        render();
        jest.mocked(window.scrollBy).mockClear();

        positions[100] += 200;
        feed.stories = [story(500), ...feed.stories];
        render();

        expect(window.scrollBy).toHaveBeenCalledWith(0, 200);
    });

    test("does not scroll when older stories are appended", () => {
        render();
        act(() => window.dispatchEvent(new Event("scroll")));
        jest.mocked(window.scrollTo).mockClear();
        jest.mocked(window.scrollBy).mockClear();

        feed.stories = [...feed.stories, story(50)];
        render();

        expect(window.scrollTo).not.toHaveBeenCalled();
        expect(window.scrollBy).not.toHaveBeenCalled();
    });

    test("opens a feed at the top after its initial stories load", () => {
        feed.stories = [];
        render();
        expect(window.scrollTo).not.toHaveBeenCalled();

        feed.stories = [story(300), story(200), story(100)];
        render();

        expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });

    test("scrolls to an explicitly requested anchor in the loaded slice", () => {
        render();
        jest.mocked(window.scrollTo).mockClear();
        jest.mocked(window.scrollBy).mockClear();

        feed.anchor = 100;
        render();

        expect(window.scrollTo).not.toHaveBeenCalled();
        expect(window.scrollBy).toHaveBeenCalledWith(0, 205);
        expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({type: "FEED_SCROLLED_TO_ANCHOR"}));
    });

    test("scrolls to the page top for an explicit top anchor", () => {
        feed.anchor = Number.MAX_SAFE_INTEGER;
        render();

        expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
        expect(window.scrollBy).not.toHaveBeenCalled();
    });
});
