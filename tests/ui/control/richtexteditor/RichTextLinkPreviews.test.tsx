import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useSelector } from 'react-redux';
import { useField } from 'formik';

import { ClientState } from "state/state";
import RichTextLinkPreviews from "ui/control/richtexteditor/RichTextLinkPreviews";

jest.mock("react-redux", () => ({useSelector: jest.fn()}));
jest.mock("formik", () => ({useField: jest.fn()}));
jest.mock("state/home/selectors", () => ({getRelNodeNameContext: () => ({})}));
jest.mock("state/settings/selectors", () => ({getSetting: () => 3}));
jest.mock("ui/hook", () => ({useDispatcher: () => jest.fn()}));
jest.mock("ui/entry/EntryLinkPreview", () => ({EntryLinkPreview: () => null}));
jest.mock("ui/entry/EntryLinkSelector", () => () => null);
jest.mock("ui/control/richtexteditor/visual/scripture-editor", () => ({}));
jest.mock("util/text", () => ({}));
jest.mock("util/media-with-caption", () => ({}));

let root: Root;

beforeEach(() => {
    (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
    root = createRoot(document.createElement("div"));
});

afterEach(() => {
    act(() => root.unmount());
});

test.each(["Posting heading", ""])("carries owner metadata into the body with heading %p", (heading: string) => {
    const url = "https://moera.page/@alice/~/post/post-1";
    const owner = {
        ownerName: "alice_0", ownerFullName: "Alice", ownerSourceUri: "https://alice.example/profile",
        ownerGender: "female", ownerAvatar: {mediaId: "avatar-id", path: "avatar-hash", shape: "circle"}
    };
    const state = {linkPreviews: {
        [url]: {loading: false, loaded: true, images: {}, info: {url, description: heading, ...owner}}
    }} as unknown as ClientState;
    (useSelector as jest.Mock).mockImplementation(selector => selector(state));
    const value = {previews: [], media: [], status: {[url]: "loaded"}};
    const setValue = jest.fn();
    (useField as jest.Mock).mockImplementation(name => [
        {}, {value: name === "previews" ? value : [url]}, {setValue}
    ]);

    act(() => root.render(<RichTextLinkPreviews name="previews" urlsField="urls" nodeName="home_0"/>));

    expect(setValue).toHaveBeenCalledWith({
        previews: [expect.objectContaining({url, description: heading, ...owner})],
        media: [], status: {[url]: "loaded"}
    });
    const preview = setValue.mock.calls[0][0].previews[0];
    expect(preview.title).toBeFalsy();
    expect(preview.imageHash).toBeFalsy();
});
