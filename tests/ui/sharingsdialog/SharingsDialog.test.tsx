import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';

import { SharingInfo } from "api";
import SharingsDialog from "ui/sharingsdialog/SharingsDialog";

const mockState = {
    sharingsDialog: {
        nodeName: "author_0", postingId: "local-post", loading: false, loaded: true,
        after: Number.MIN_SAFE_INTEGER, total: 1, items: [] as SharingInfo[]
    },
    home: {owner: {name: "viewer_0"}, root: {location: null, api: null}},
    node: {owner: {name: "author_0"}, root: {location: null, api: null}},
    search: {nodeName: "search_0"},
    nodeCards: {cards: {}},
    postings: {},
    settings: {client: {meta: new Map(), values: new Map()}},
    tokens: {}
};

jest.mock("api", () => ({NodeName: jest.requireActual("api/node-name").NodeName}));
jest.mock("ui/browser", () => ({}));
jest.mock("i18n", () => ({tGender: (gender: string) => gender}));
jest.mock("util/media-images", () => ({}));
jest.mock('react-redux', () => ({useSelector: (selector: (state: unknown) => unknown) => selector(mockState)}));
jest.mock('react-i18next', () => ({useTranslation: () => ({t: (key: string) => key})}));
jest.mock("ui/hook", () => ({useDispatcher: () => jest.fn()}));
jest.mock("ui/control", () => ({
    ModalDialog: ({children}: {children: React.ReactNode}) => <section>{children}</section>,
    Avatar: () => <span/>,
    SubscribeButton: () => <button/>
}));
jest.mock("ui/nodename/NodeName", () => ({name}: {name: string}) => <span>{name}</span>);
jest.mock("ui/navigation/Jump", () => ({nodeName, href, children}: {
    nodeName: string; href: string; children: React.ReactNode;
}) => <a data-nodename={nodeName} href={href}>{children}</a>);

describe("sharings dialog links", () => {
    let container: HTMLDivElement;
    let root: Root;

    beforeAll(() => Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: true}));
    afterAll(() => Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: false}));

    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
        root = createRoot(container);
    });

    afterEach(() => {
        act(() => root.unmount());
        container.remove();
    });

    test.each([
        {sharingType: "refer", remotePostingId: "source-post", remoteStoryMoment: null, href: "/post/source-post"},
        {sharingType: "refer", remotePostingId: "post/with space", remoteStoryMoment: 42,
            href: "/post/post%2Fwith%20space"},
        {sharingType: "republish", remotePostingId: "source-post", remoteStoryMoment: 42, href: "/?before=42"},
        {sharingType: "republish", remotePostingId: null, remoteStoryMoment: 0, href: "/?before=0"}
    ] as const)("links $sharingType to $href", ({href, ...target}) => {
        mockState.sharingsDialog.items = [{
            id: "sharing", postingId: "local-post", remoteNodeName: "alice_0", moment: 100, createdAt: 100, ...target
        }];

        act(() => root.render(<SharingsDialog/>));

        const links = container.querySelectorAll(".item a");
        expect(links).toHaveLength(2);
        for (const link of links) {
            expect(link.getAttribute("data-nodename")).toBe("alice_0");
            expect(link.getAttribute("href")).toBe(href);
        }
    });
});
