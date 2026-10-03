import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';

import { PostingInfo } from "api";
import PostingSharings from "ui/posting/PostingSharings";

const mockDispatch = jest.fn();
const mockState = {
    home: {owner: {name: "viewer"}, root: {location: null, api: null}},
    node: {owner: {name: "feed"}, root: {location: null, api: null}, features: null},
    nodeCards: {cards: {}},
    settings: {client: {meta: new Map(), values: new Map()}},
    tokens: {}
};

jest.mock("api", () => ({}));
jest.mock("ui/browser", () => ({}));
jest.mock("i18n", () => ({}));
jest.mock("util/media-images", () => ({}));
jest.mock("ui/posting/PostingSharings.css", () => ({}));
jest.mock("ui/material-symbols", () => ({Icon: () => <svg/>, msRepeat: null}));
jest.mock('react-redux', () => ({useSelector: (selector: (state: unknown) => unknown) => selector(mockState)}));
jest.mock('react-i18next', () => ({useTranslation: () => ({t: (key: string) => key})}));
jest.mock("ui/hook", () => ({useDispatcher: () => mockDispatch}));

describe("posting sharings button", () => {
    let container: HTMLDivElement;
    let root: Root;
    let posting: PostingInfo;

    beforeAll(() => Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: true}));
    afterAll(() => Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: false}));

    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
        root = createRoot(container);
        posting = {id: "post-1", ownerName: "author", totalSharings: 3} as PostingInfo;
    });

    afterEach(() => {
        act(() => root.unmount());
        container.remove();
    });

    test("opens the dialog for its node and posting", () => {
        act(() => root.render(<PostingSharings nodeName="feed" posting={posting}/>));
        const button = container.querySelector("button")!;

        expect(button.textContent).toBe("3");
        expect(button.disabled).toBe(false);
        act(() => button.click());
        expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
            type: "OPEN_SHARINGS_DIALOG", payload: {nodeName: "feed", postingId: "post-1"}
        }));
    });

    test("keeps the count visible but cannot open private sharings", () => {
        posting.operations = {viewSharings: "private"};
        act(() => root.render(<PostingSharings nodeName="feed" posting={posting}/>));
        const button = container.querySelector("button")!;

        expect(button.textContent).toBe("3");
        expect(button.disabled).toBe(true);
        act(() => button.click());
        expect(mockDispatch).not.toHaveBeenCalled();
    });

    test("checks the receiver's permission for a copied posting", () => {
        posting.receiverName = "receiver";
        posting.operations = {viewSharings: "public"};
        posting.receiverOperations = {viewSharings: "none"};
        act(() => root.render(<PostingSharings nodeName="feed" posting={posting}/>));

        expect(container.querySelector("button")?.disabled).toBe(true);
    });

    test.each([0, null, undefined])("hides an absent sharing count (%s)", (totalSharings: number | null | undefined) => {
        posting.totalSharings = totalSharings;
        act(() => root.render(<PostingSharings nodeName="feed" posting={posting}/>));

        expect(container.querySelector("button")).toBeNull();
    });
});
