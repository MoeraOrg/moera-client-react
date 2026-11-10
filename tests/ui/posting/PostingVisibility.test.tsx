import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';

import { PostingInfo, PrincipalValue } from "api";
import PostingVisibility from "ui/posting/PostingVisibility";
import { MinimalStoryInfo } from "ui/types";
import { REL_CURRENT } from "util/rel-node-name";

const mockDispatch = jest.fn();
const mockState = {
    home: {owner: {name: "author"}, root: {location: "https://author", api: "https://author/moera/api"}},
    node: {owner: {name: "author"}, root: {location: "https://author", api: "https://author/moera/api"}, features: null},
    tokens: {"https://author": {token: "token", permissions: ["other"]}}
};

jest.mock("api", () => ({}));
jest.mock("ui/browser", () => ({}));
jest.mock("react-redux", () => ({useSelector: (selector: (state: unknown) => unknown) => selector(mockState)}));
jest.mock("react-i18next", () => ({useTranslation: () => ({t: (key: string) => key})}));
jest.mock("state/settings/selectors", () => ({getSetting: () => false}));
jest.mock("ui/hook", () => ({useDispatcher: () => mockDispatch}));
jest.mock("ui/material-symbols", () => ({Icon: () => <svg/>, msDelete: null}));
jest.mock("ui/control", () => ({
    Principal: ({value}: {value: PrincipalValue}) => <span>{value}</span>,
    PrincipalSelect: ({value, onChange}: {value: PrincipalValue; onChange: (value: PrincipalValue) => void}) =>
        <button type="button" onClick={() => onChange("private")}>{value}</button>
}));

describe("posting visibility", () => {
    let container: HTMLDivElement;
    let root: Root;
    const posting = {id: "post-1", ownerName: "author", operations: {view: "public"}} as PostingInfo;
    const story: MinimalStoryInfo = {id: "story-1", publishedAt: 100, moment: 100, operations: {view: "signed"}};

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

    test("changes the story visibility when the story overrides the posting visibility", () => {
        act(() => root.render(<PostingVisibility posting={posting} story={story}/>));
        const button = container.querySelector("button")!;
        expect(button.textContent).toBe("signed");

        act(() => button.click());

        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
            type: "STORY_OPERATIONS_UPDATE",
            payload: {id: "story-1", nodeName: REL_CURRENT, operations: {view: "private"}}
        }));
    });

    test.each([null, {}, {view: null}, {view: "unset" as const}])(
        "changes the posting visibility when story view is unset (%j)", (operations: MinimalStoryInfo["operations"]) => {
            act(() => root.render(<PostingVisibility posting={posting} story={{...story, operations}}/>));

            act(() => container.querySelector("button")!.click());

            expect(mockDispatch).toHaveBeenCalledTimes(1);
            expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
                type: "POSTING_OPERATIONS_UPDATE",
                payload: {id: "post-1", nodeName: REL_CURRENT, operations: {view: "private"}}
            }));
        }
    );

    test("changes the posting visibility when there is no story", () => {
        act(() => root.render(<PostingVisibility posting={posting} story={null}/>));

        act(() => container.querySelector("button")!.click());

        expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
            type: "POSTING_OPERATIONS_UPDATE",
            payload: {id: "post-1", nodeName: REL_CURRENT, operations: {view: "private"}}
        }));
    });
});
