import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';

import { LinkPreview } from "api";
import { ClientState } from "state/state";
import { ExtPostingInfo } from "state/postings/state";
import EntryLinkPreviews from "ui/entry/EntryLinkPreviews";
import LinkedPosting from "ui/entry/LinkedPosting";
import { REL_CURRENT, REL_HOME, RelNodeName } from "util/rel-node-name";

let mockState: ClientState;

jest.mock("api", () => ({NodeName: {expand: (name: string) => name}}));
jest.mock("ui/browser", () => ({}));
jest.mock("i18n", () => ({}));
jest.mock("util/media-images", () => ({}));
jest.mock('react-redux', () => ({useSelector: (selector: (state: ClientState) => unknown) => selector(mockState)}));
jest.mock('react-i18next', () => ({useTranslation: () => ({t: (key: string) => key})}));
jest.mock("ui/material-symbols", () => ({Icon: () => null}));
jest.mock("ui/entry/EntryLinkPreview", () => ({EntryLinkPreview: () => null}));
jest.mock("ui/posting/PostingAvatar", () => () => null);
jest.mock("ui/posting/PostingOwner", () => () => null);
jest.mock("ui/posting/PostingDate", () => () => null);
jest.mock("ui/posting/PostingUpdated", () => () => null);
jest.mock("ui/posting/PostingVisibility", () => () => null);
jest.mock("ui/posting/PostingSubject", () => () => null);
jest.mock("ui/entry/EntryAttachments", () => () => null);
jest.mock("ui/entry/EntryGallery", () => () => null);
jest.mock("ui/navigation/Jump", () => () => null);
jest.mock("ui/entry/EntryHtml", () => ({html, nodeName}: {html: string; nodeName: string | RelNodeName}) =>
    <div data-content-node={nodeName.toString()} dangerouslySetInnerHTML={{__html: html}}/>
);

const preview: LinkPreview = {
    url: "https://moera.page/@original.example/~/post/original", ownerName: "author", description: "Preview text"
};
const picked = {
    id: "picked", body: {previewText: "<p>Picked body</p>"}, receiverName: "original.example", receiverPostingId: "original"
} as ExtPostingInfo;
const original = {id: "original", body: {previewText: "<p>Original body</p>"}} as ExtPostingInfo;

describe("linked posting picked fallback", () => {
    let container: HTMLDivElement;
    let root: Root;

    beforeAll(() => Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: true}));
    afterAll(() => Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: false}));

    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
        root = createRoot(container);
        mockState = {
            node: {owner: {name: "current.example"}},
            home: {owner: {name: "home.example"}, root: {location: null}},
            settings: {client: {meta: new Map(), values: new Map()}},
            postings: {
                "original.example": {original: {picked: [
                    {nodeName: "current.example", postingId: "picked"},
                    {nodeName: "home.example", postingId: "picked"}
                ]}},
                "current.example": {
                    picked: {posting: {...picked, body: {previewText: "<p>Alternative body</p>"}}}
                },
                "home.example": {
                    picked: {posting: picked}
                }
            }
        } as unknown as ClientState;
    });

    afterEach(() => {
        act(() => root.unmount());
        container.remove();
    });

    function renderPreviews(nodeName: RelNodeName | string = REL_HOME) {
        act(() => root.render(
            <EntryLinkPreviews
                nodeName={nodeName} linkPreviews={[preview]} noFollow={false} media={null}
            />
        ));
    }

    test("renders the picked copy using the home node for its content", () => {
        renderPreviews();

        expect(container.textContent).toBe("Picked body");
        expect(container.querySelector("[data-content-node]")?.getAttribute("data-content-node"))
            .toBe("home.example");
    });

    test("prefers an original as soon as it becomes available", () => {
        renderPreviews();
        expect(container.textContent).toBe("Picked body");

        mockState.postings["original.example"]!.original!.posting = original;
        renderPreviews();
        expect(container.textContent).toBe("Original body");
        expect(container.querySelector("[data-content-node]")?.getAttribute("data-content-node"))
            .toBe("original.example");
    });

    test.each([
        {nodeName: "another.example", postingId: "original"},
        {nodeName: "original.example", postingId: "another"}
    ])("does not use a picked copy for $nodeName/$postingId", ({nodeName, postingId}) => {
        mockState.postings["original.example"] = {};
        mockState.postings[nodeName] = {[postingId]: {picked: [{nodeName: "home.example", postingId: "picked"}]}};
        renderPreviews();

        expect(container.textContent).toBe("Preview text");
    });

    test("uses preview text when the picked copy has only metadata", () => {
        mockState.postings["home.example"]!.picked = {visitRecorded: true};
        renderPreviews();

        expect(container.textContent).toBe("Preview text");
        expect(container.querySelector("[data-content-node]")?.getAttribute("data-content-node"))
            .toBe("original.example");
    });

    test("keeps compact editor previews even when both copies are cached", () => {
        mockState.postings["original.example"]!.original!.posting = original;
        act(() => root.render(
            <LinkedPosting preview={preview} compact/>
        ));

        expect(container.textContent).toBe("Preview text");
    });

    test("renders the picked copy without a parent posting", () => {
        act(() => root.render(<LinkedPosting preview={preview}/>));

        expect(container.textContent).toBe("Picked body");
        expect(container.querySelector("[data-content-node]")?.getAttribute("data-content-node"))
            .toBe("home.example");
    });

    test("uses the home node for picked content when the parent is on another node", () => {
        renderPreviews(REL_CURRENT);

        expect(container.textContent).toBe("Picked body");
        expect(container.querySelector("[data-content-node]")?.getAttribute("data-content-node"))
            .toBe("home.example");
    });

    test.each(["missing", "metadata only"])("uses the parent's copy when the home copy is %s", missing => {
        mockState.postings["home.example"]!.picked = missing === "missing" ? undefined : {visitRecorded: true};
        renderPreviews(REL_CURRENT);

        expect(container.textContent).toBe("Alternative body");
        expect(container.querySelector("[data-content-node]")?.getAttribute("data-content-node"))
            .toBe("current.example");
    });

    test("uses the parent's copy without a home owner", () => {
        mockState.home.owner.name = null;
        renderPreviews("current.example");

        expect(container.textContent).toBe("Alternative body");
        expect(container.querySelector("[data-content-node]")?.getAttribute("data-content-node"))
            .toBe("current.example");
    });

    test("uses preview text when there is no home owner", () => {
        mockState.home.owner.name = null;
        renderPreviews();

        expect(container.textContent).toBe("Preview text");
    });
});
