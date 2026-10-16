import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ReactEditor, useSlateStatic } from 'slate-react';
import { HistoryEditor } from 'slate-history';

import VisualEditor from "ui/control/richtexteditor/visual/VisualEditor";
import { RichTextValue } from "ui/control/richtexteditor/rich-text-value";
import { LinkElement, Scripture } from "ui/control/richtexteditor/visual/scripture";
import { ScriptureEditor } from "ui/control/richtexteditor/visual/scripture-editor";

jest.mock("react-redux", () => ({useSelector: () => false}));
jest.mock("state/settings/selectors", () => ({getSetting: () => false}));
jest.mock("api", () => ({NodeName: jest.requireActual("api/node-name").NodeName}));
jest.mock("ui/hook", () => ({useIsTinyScreen: () => false}));
jest.mock("ui/control", () => ({}));
jest.mock("util/media-images", () => ({}));
jest.mock("sanitize-html", () => Object.assign(jest.fn(), {
    defaults: {allowedTags: [], allowedAttributes: {}, allowedSchemes: []}
}));
jest.mock("mime", () => ({getExtension: jest.fn(), getType: jest.fn()}));
jest.mock("ui/control/richtexteditor/visual/VisualEditorCommands", () =>
    ({children}: {children: React.ReactNode}) => children
);
jest.mock("ui/control/richtexteditor/visual/VisualTextArea", () => () => null);
jest.mock("ui/control/richtexteditor/panel/RichTextEditorPanel", () => () => null);
jest.mock("ui/control/richtexteditor/formatting-menu/RichTextEditorShortPanel", () => () => null);
jest.mock("ui/control/richtexteditor/media/RichTextEditorDropzone", () => () => null);

describe("visual editor link URLs", () => {
    let container: HTMLDivElement;
    let root: Root;
    let editor: ScriptureEditor<ReactEditor & HistoryEditor>;
    const onUrls = jest.fn();

    function EditorProbe() {
        editor = useSlateStatic() as ScriptureEditor<ReactEditor & HistoryEditor>;
        return null;
    }

    beforeAll(() => Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: true}));
    afterAll(() => Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: false}));

    beforeEach(async () => {
        jest.useFakeTimers();
        container = document.createElement("div");
        document.body.appendChild(container);
        root = createRoot(container);
        const scripture: Scripture = [{
            type: "paragraph",
            children: [
                {text: ""},
                {type: "link", href: "https://example.com/old", children: [{text: "Link"}]},
                {text: ""}
            ]
        }];
        const value = {scripture} as RichTextValue;
        await act(async () => root.render(
            <VisualEditor value={value} touched={false} nodeName="alice" panelMode="none" noMedia onUrls={onUrls}>
                <EditorProbe/>
            </VisualEditor>
        ));
        await act(async () => jest.runAllTimers());
        onUrls.mockClear();
    });

    afterEach(() => {
        act(() => root.unmount());
        container.remove();
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    test("reports the new URL after editing a link and tracks undo and redo", async () => {
        await act(async () => {
            editor.setNodes<LinkElement>({href: "https://example.com/new"}, {at: [0, 1]});
        });
        await act(async () => jest.runAllTimers());
        expect(onUrls).toHaveBeenLastCalledWith(["https://example.com/new"]);

        await act(async () => editor.undo());
        await act(async () => jest.runAllTimers());
        expect(onUrls).toHaveBeenLastCalledWith(["https://example.com/old"]);

        await act(async () => editor.redo());
        await act(async () => jest.runAllTimers());
        expect(onUrls).toHaveBeenLastCalledWith(["https://example.com/new"]);
    });
});
