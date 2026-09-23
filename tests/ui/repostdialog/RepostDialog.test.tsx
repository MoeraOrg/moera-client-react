import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';

import RepostDialog from "ui/repostdialog/RepostDialog";

const mockDispatch = jest.fn();
let mockHomeOwnerName = "bob";
let mockNameDisplayMode = "both";
const mockState = {
    repostDialog: {
        show: true,
        nodeName: "receiver",
        postingId: "post-1",
        heading: "A post heading",
        fullName: "Receiver Blog",
        visible: "signed",
        submitting: false
    }
};

jest.mock("api", () => ({NodeName: jest.requireActual("api/node-name").NodeName}));

jest.mock('react-redux', () => ({
    useSelector: (selector: (state: unknown) => unknown) => selector(mockState)
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (text: string, values?: {heading?: string}) =>
        values?.heading == null ? text : `${text}:${values.heading}`}),
    Trans: ({i18nKey, values, components}: {
        i18nKey: string;
        values: {name: string; heading: string};
        components: {b: React.ReactNode};
    }) => <span data-i18n-key={i18nKey}>{components.b && <b>{values.name}</b>}{values.heading}</span>
}));

jest.mock("ui/hook", () => ({
    useDispatcher: () => mockDispatch
}));

jest.mock("state/home/selectors", () => ({
    getHomeOwnerName: () => mockHomeOwnerName
}));

jest.mock("ui/nodename/hooks", () => ({
    useNameDisplayMode: () => mockNameDisplayMode
}));

jest.mock("state/store-sagas", () => ({
    dispatch: (...args: unknown[]) => mockDispatch(...args)
}));

jest.mock("ui/control/field", () => ({
    PrincipalField: () => <div/>
}));

jest.mock("ui/control", () => ({
    ModalDialog: ({title, onClose, children}: {
        title: string;
        onClose: () => void;
        children: React.ReactNode;
    }) => (
        <section>
            <h1>{title}</h1>
            <button type="button" onClick={onClose}>close</button>
            {children}
        </section>
    ),
    Button: ({type = "button", onClick, children}: {
        type?: "button" | "submit";
        onClick?: () => void;
        children: React.ReactNode;
    }) => <button type={type} onClick={onClick}>{children}</button>
}));

describe("repost dialog", () => {
    let container: HTMLDivElement;
    let root: Root;

    beforeAll(() => Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: true}));

    afterAll(() => Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: false}));

    beforeEach(() => {
        mockDispatch.mockClear();
        mockHomeOwnerName = "bob";
        mockNameDisplayMode = "both";
        mockState.repostDialog.nodeName = "receiver";
        container = document.createElement("div");
        document.body.appendChild(container);
        root = createRoot(container);
    });

    afterEach(() => {
        act(() => root.unmount());
        container.remove();
    });

    test("shows the node name in the share prompt and closes through the dialog action", () => {
        act(() => root.render(<RepostDialog/>));

        expect(container.querySelector("h1")?.textContent).toBe("repost");
        expect(container.querySelectorAll("form")).toHaveLength(1);
        expect(container.querySelector(".form-text [data-i18n-key]")?.getAttribute("data-i18n-key"))
            .toBe("share-post-your-blog");
        expect(container.querySelector(".form-text b")?.textContent).toBe("Receiver Blog (receiver)");
        expect(container.querySelector(".form-text")?.textContent).toContain("A post heading");

        act(() => (Array.from(container.querySelectorAll("button")).find(button => button.textContent === "cancel"))?.click());
        expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({type: "CLOSE_REPOST_DIALOG"}));
    });

    test("uses the repeat prompt for a post from the home node", () => {
        mockState.repostDialog.nodeName = "bob";
        act(() => root.render(<RepostDialog/>));

        expect(container.querySelector(".form-text")?.textContent).toBe("repeat-your-post:A post heading");
        expect(container.querySelector(".form-text b")).toBeNull();
    });

    test("uses the configured display mode for the node name", () => {
        mockNameDisplayMode = "name";
        act(() => root.render(<RepostDialog/>));

        expect(container.querySelector(".form-text b")?.textContent).toBe("receiver");
    });

    test("submits the source posting with the selected visibility", async () => {
        await act(async () => root.render(<RepostDialog/>));

        await act(async () => {
            container.querySelector("form")?.dispatchEvent(new Event("submit", {bubbles: true, cancelable: true}));
        });

        expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
            type: "REPOST_POSTING",
            payload: {nodeName: "receiver", postingId: "post-1", postingView: "signed"}
        }));
    });
});
