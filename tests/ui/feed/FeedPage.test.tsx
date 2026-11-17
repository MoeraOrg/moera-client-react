import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';

import { emptyFeed } from "state/feeds/empty";
import { feedScrolled, feedStatusUpdate } from "state/feeds/actions";
import { ExtStoryInfo, FeedState } from "state/feeds/state";
import { ClientState } from "state/state";
import FeedPage from "ui/feed/FeedPage";
import { REL_HOME } from "util/rel-node-name";

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
    let heights: Record<number, number>;
    let resizeObservers: {callback: ResizeObserverCallback; elements: Set<Element>}[];
    const originalResizeObserver = globalThis.ResizeObserver;

    beforeAll(() => Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: true}));
    afterAll(() => Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: false}));

    beforeEach(() => {
        jest.useFakeTimers();
        resizeObservers = [];
        globalThis.ResizeObserver = class {
            private elements = new Set<Element>();

            constructor(callback: ResizeObserverCallback) {
                resizeObservers.push({callback, elements: this.elements});
            }

            observe(element: Element) {
                this.elements.add(element);
            }

            unobserve(element: Element) {
                this.elements.delete(element);
            }

            disconnect() {
                this.elements.clear();
            }
        };
        feed = {...emptyFeed, after: 0, stories: [story(300), story(200), story(100)]};
        mockState = {
            home: {owner: {name: "alice"}, root: {location: null, api: null}},
            node: {owner: {name: "alice"}, root: {location: null, api: null}},
            settings: {client: {meta: new Map(), values: new Map()}},
            feeds: {alice: {news: feed}},
            postings: {}
        } as unknown as ClientState;
        positions = {400: -700, 300: -450, 200: -150, 100: 240, 50: 600};
        heights = {};
        jest.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
            const top = positions[Number(this.dataset.moment)] ?? 0;
            const height = heights[Number(this.dataset.moment)] ?? 300;
            return {top, bottom: top + height, height} as DOMRect;
        });
        jest.spyOn(window, "scrollTo").mockImplementation(() => undefined);
        jest.spyOn(window, "scrollBy").mockImplementation((...args: unknown[]) => {
            const delta = args[1] as number;
            for (const moment of Object.keys(positions)) {
                positions[Number(moment)] -= delta;
            }
            jest.replaceProperty(window, "scrollY", window.scrollY + delta);
        });
        jest.replaceProperty(window, "scrollY", 500);
        container = document.createElement("div");
        document.body.appendChild(container);
        root = createRoot(container);
    });

    afterEach(() => {
        act(() => root.unmount());
        container.remove();
        jest.restoreAllMocks();
        globalThis.ResizeObserver = originalResizeObserver;
        jest.useRealTimers();
    });

    function render(visible = true) {
        mockState = {...mockState};
        act(() => root.render(<FeedPage nodeName="alice" feedName="news" visible={visible}/>));
    }

    function resizePosting(moment: number) {
        const posting = container.querySelector<HTMLElement>(`[data-moment="${moment}"]`)!;
        act(() => {
            for (const {callback, elements} of resizeObservers) {
                if ([...elements].some(element => element === posting || element.contains(posting))) {
                    callback([{target: posting} as ResizeObserverEntry], {} as ResizeObserver);
                }
            }
        });
    }

    function addLinkedPosting(): HTMLDivElement {
        const linked = document.createElement("div");
        linked.className = "linked-posting posting entry preview";
        linked.getBoundingClientRect = () => ({top: 50, bottom: 150, height: 100}) as DOMRect;
        container.querySelector('[data-moment="300"]')!.appendChild(linked);
        return linked;
    }

    test("ignores linked postings when reporting the scroll moment", () => {
        render();
        addLinkedPosting();

        act(() => window.dispatchEvent(new Event("scroll")));
        act(() => jest.advanceTimersByTime(500));

        expect(mockDispatch).toHaveBeenLastCalledWith(feedScrolled("alice", "news", 100));
    });

    test("ignores linked postings when scrolling to an anchor", () => {
        render();
        addLinkedPosting();
        jest.mocked(window.scrollBy).mockClear();

        feed.anchor = 100;
        render();

        expect(window.scrollBy).toHaveBeenCalledWith(0, 205);
    });

    test("ignores linked postings when reporting the not viewed moment", () => {
        render();
        const linked = addLinkedPosting();
        linked.dataset.viewed = "false";
        container.querySelector<HTMLElement>('[data-moment="100"]')!.dataset.viewed = "false";

        render();
        act(() => jest.advanceTimersByTime(1000));

        expect(mockDispatch).toHaveBeenCalledWith(feedStatusUpdate(REL_HOME, "news", true, null, 100));
    });

    test("does not mark linked postings as viewed", () => {
        render();
        const linked = addLinkedPosting();
        linked.classList.add("not-viewed");
        linked.dataset.viewed = "false";
        container.querySelector<HTMLElement>('[data-moment="100"]')!.dataset.viewed = "false";

        render();
        act(() => jest.advanceTimersByTime(1000));

        expect(linked.dataset.viewed).toBe("false");
        expect(linked.classList.contains("not-viewed")).toBe(true);
        expect(container.querySelector<HTMLElement>('[data-moment="100"]')!.dataset.viewed).toBe("true");
    });

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

    test("preserves the posting with 25 pixels of extra space when prepending at the page top", () => {
        jest.replaceProperty(window, "scrollY", 0);
        positions = {300: 50, 200: 350, 100: 650};
        render();
        act(() => window.dispatchEvent(new Event("scroll")));
        jest.mocked(window.scrollTo).mockClear();
        jest.mocked(window.scrollBy).mockClear();

        positions = {400: 50, 300: 350, 200: 650, 100: 950};
        feed.stories = [story(400), ...feed.stories];
        render();

        expect(window.scrollTo).not.toHaveBeenCalled();
        expect(window.scrollBy).toHaveBeenCalledTimes(1);
        expect(window.scrollBy).toHaveBeenCalledWith(0, 275);
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

    test("preserves the posting offset when a linked posting grows without a feed render", () => {
        render();
        addLinkedPosting();
        positions[100] += 636;

        resizePosting(300);

        expect(window.scrollBy).toHaveBeenCalledWith(0, 636);
        expect(positions[100]).toBe(240);
    });

    test("compensates a size change before a feed render can replace the saved offset", () => {
        render();
        positions[100] += 636;

        render();
        resizePosting(300);

        expect(window.scrollBy).toHaveBeenCalledTimes(1);
        expect(positions[100]).toBe(240);
    });

    test("preserves the offset across consecutive resizes without a scroll event", () => {
        render();
        positions[100] += 636;
        resizePosting(300);
        positions[100] += 80;
        resizePosting(300);

        expect(window.scrollBy).toHaveBeenNthCalledWith(1, 0, 636);
        expect(window.scrollBy).toHaveBeenNthCalledWith(2, 0, 80);
        expect(positions[100]).toBe(240);
    });

    test("does not scroll again when the browser already compensated a resize", () => {
        render();
        jest.replaceProperty(window, "scrollY", 1136);

        resizePosting(300);
        act(() => window.dispatchEvent(new Event("scroll")));

        expect(window.scrollBy).not.toHaveBeenCalled();
    });

    test("does not scroll when content at or below the saved posting grows", () => {
        render();
        resizePosting(100);

        expect(window.scrollBy).not.toHaveBeenCalled();
    });

    test("stays at the page top when initial story content appears", () => {
        jest.replaceProperty(window, "scrollY", 0);
        positions = {300: 0, 200: 50, 100: 350};
        heights[300] = 0;
        render();
        heights[300] = 300;
        positions = {300: 50, 200: 350, 100: 650};

        resizePosting(300);

        expect(window.scrollBy).not.toHaveBeenCalled();
        expect(window.scrollY).toBe(0);
    });

    test("uses the new posting offset after manual scrolling", () => {
        render();
        positions = {300: -200, 200: 100, 100: 490};
        jest.replaceProperty(window, "scrollY", 250);
        act(() => window.dispatchEvent(new Event("scroll")));
        positions[200] += 90;
        positions[100] += 90;

        resizePosting(300);

        expect(window.scrollBy).toHaveBeenCalledWith(0, 90);
        expect(positions[200]).toBe(100);
    });

    test("does not lose a resize to a queued scroll event with an unchanged scroll position", () => {
        render();
        positions[100] += 636;

        act(() => window.dispatchEvent(new Event("scroll")));
        resizePosting(300);

        expect(positions[100]).toBe(240);
        expect(window.scrollBy).toHaveBeenCalledTimes(1);
    });

    test.each(["render", "resize"])("does not undo manual scrolling before its event during a %s", update => {
        render();
        for (const moment of Object.keys(positions)) {
            positions[Number(moment)] -= 100;
        }
        jest.replaceProperty(window, "scrollY", 600);

        if (update === "render") {
            render();
        } else {
            resizePosting(300);
        }

        expect(window.scrollBy).not.toHaveBeenCalled();
        expect(window.scrollY).toBe(600);
        expect(positions[100]).toBe(140);
    });

    test("keeps the interacted posting in place while its contents expand", () => {
        render();
        const posting = container.querySelector<HTMLElement>('[data-moment="200"]')!;
        const details = document.createElement("details");
        const summary = document.createElement("summary");
        summary.textContent = "Expand";
        details.appendChild(summary);
        posting.appendChild(details);

        act(() => summary.click());
        positions[100] += 600;
        resizePosting(200);
        render();
        positions[100] += 200;
        resizePosting(200);

        expect(window.scrollBy).not.toHaveBeenCalled();
        expect(positions[200]).toBe(-150);
    });

    test("waits for a lazy anchor posting to have layout before positioning it", () => {
        feed.before = 400;
        feed.anchor = 300;
        positions = {300: 0, 200: 100, 100: 400};
        heights[300] = 0;
        render();

        expect(window.scrollBy).not.toHaveBeenCalled();
        expect(mockDispatch).not.toHaveBeenCalledWith(expect.objectContaining({type: "FEED_SCROLLED_TO_ANCHOR"}));

        positions = {300: 100, 200: 400, 100: 700};
        heights[300] = 300;
        resizePosting(300);

        expect(window.scrollBy).toHaveBeenCalledTimes(1);
        expect(window.scrollBy).toHaveBeenCalledWith(0, 65);
        expect(positions[300]).toBe(35);
        expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({type: "FEED_SCROLLED_TO_ANCHOR"}));
    });

    test("does not scroll when the saved posting has been removed", () => {
        render();
        feed.stories = feed.stories.filter(story => story.moment !== 100);

        render();
        resizePosting(300);

        expect(window.scrollBy).not.toHaveBeenCalled();
    });

    test("does not compensate resizes while the feed is hidden", () => {
        render();
        render(false);
        positions[100] += 636;

        resizePosting(300);
        render(false);

        expect(window.scrollBy).not.toHaveBeenCalled();
    });

    test("releases resize observation on unmount", () => {
        render();
        act(() => root.unmount());
        positions[100] += 636;

        for (const {elements} of resizeObservers) {
            expect(elements.size).toBe(0);
        }
        expect(window.scrollBy).not.toHaveBeenCalled();
        root = createRoot(container);
    });

    test("does not choose an anchor from another feed", () => {
        const otherPosting = document.createElement("article");
        otherPosting.className = "posting";
        otherPosting.dataset.moment = "1000";
        positions[1000] = 50;
        document.body.prepend(otherPosting);
        try {
            render();
            positions[100] += 636;

            resizePosting(300);

            expect(positions[100]).toBe(240);
        } finally {
            otherPosting.remove();
        }
    });
});
