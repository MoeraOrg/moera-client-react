import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';

import { LocationInfo } from "location/LocationInfo";
import { transform } from "location/settings";
import { settingsGoToTab } from "state/settings/actions";
import reducer from "state/settings/reducer";
import { isSettingsAtProfileSheet } from "state/settings/selectors";
import { ClientState } from "state/state";
import SettingsPage from "ui/settings/SettingsPage";

let mockState: ClientState;

jest.mock("api", () => ({clientSettingsBuildMetaMap: () => new Map()}));
jest.mock("location/util", () => ({atOwner: () => ""}));
jest.mock("react-redux", () => ({useSelector: (selector: (state: ClientState) => unknown) => selector(mockState)}));
jest.mock("react-i18next", () => ({useTranslation: () => ({t: (key: string) => key})}));
jest.mock("state/home/selectors", () => ({isConnectedToHome: () => true}));
jest.mock("state/node/selectors", () => ({}));
jest.mock("ui/page/Page", () => ({Page: ({children}: {children: React.ReactNode}) => children}));
jest.mock("ui/page/MobileBack", () => () => null);
jest.mock("ui/overlays/overlays", () => ({useOverlay: () => undefined}));
jest.mock("ui/feed/feeds", () => ({useHomeNews: () => "/news"}));
jest.mock("ui/mainmenu/MainMenuSidebar", () => () => null);
jest.mock("ui/mainmenu/BottomMenu", () => () => null);
jest.mock("ui/settings/settings-hooks", () => ({useDisableScrollX: () => undefined}));
jest.mock("ui/settings/SettingsConflicts", () => () => null);
jest.mock("ui/settings/SettingsTabs", () => () => null);
jest.mock("ui/settings/SettingsTabContent", () => () => null);
jest.mock("ui/settings/SettingsMenu", () => ({onSelect}: {onSelect: () => void}) =>
    <button className="select-sheet" onClick={onSelect}/>
);
jest.mock("ui/settings/SettingsBack", () => ({onBack}: {onBack: () => void}) =>
    <button className="back-to-menu" onClick={onBack}/>
);

describe("settings mobile navigation", () => {
    let container: HTMLDivElement;
    let root: Root;

    beforeAll(() => Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: true}));
    afterAll(() => Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: false}));

    beforeEach(() => {
        mockState = {settings: reducer(undefined, settingsGoToTab("profile"))} as ClientState;
        container = document.createElement("div");
        document.body.appendChild(container);
        root = createRoot(container);
    });

    afterEach(() => {
        act(() => root.unmount());
        container.remove();
    });

    function navigate(from: string, to: string) {
        const source = new URL(from, "https://example.com");
        const target = new URL(to, "https://example.com");
        const actions = transform(
            LocationInfo.fromUrl(source.pathname, source.search, source.hash),
            LocationInfo.fromUrl(target.pathname, target.search, target.hash)
        );
        for (const action of actions) {
            mockState = {...mockState, settings: reducer(mockState.settings, action)};
        }
        act(() => root.render(<SettingsPage/>));
    }

    test("shows the recommendations sheet when entering through Tune Recommendations", () => {
        navigate("/news", "/settings/node#news");

        expect(mockState.settings).toMatchObject({tab: "node", sheet: "news"});
        expect(container.querySelector(".settings-notebook.sheet-side")).not.toBeNull();
    });

    test("shows a linked sheet when the page is already mounted", () => {
        navigate("/news", "/settings/node");
        navigate("/settings/node", "/settings/node#news");

        expect(container.querySelector(".settings-notebook.sheet-side")).not.toBeNull();
    });

    test.each(["/settings", "/settings/profile", "/settings/client", "/settings/node"])(
        "shows the menu when entering %s without a sheet", (path: string) => {
            navigate("/news", path);

            expect(container.querySelector(".settings-notebook.menu-side")).not.toBeNull();
        }
    );

    test("keeps the default profile available for loading on desktop", () => {
        navigate("/news", "/settings/profile");

        expect(isSettingsAtProfileSheet(mockState)).toBe(true);
    });

    test("shows the profile sheet when explicitly linked", () => {
        navigate("/news", "/settings/profile#profile");

        expect(container.querySelector(".settings-notebook.sheet-side")).not.toBeNull();
    });

    test("can return to the menu and reopen the selected sheet", () => {
        navigate("/news", "/settings/node#news");
        act(() => container.querySelector<HTMLButtonElement>(".back-to-menu")!.click());
        expect(container.querySelector(".settings-notebook.menu-side")).not.toBeNull();

        act(() => container.querySelector<HTMLButtonElement>(".select-sheet")!.click());
        expect(container.querySelector(".settings-notebook.sheet-side")).not.toBeNull();
    });

    test("returns to the menu when navigating to a tab without a sheet", () => {
        navigate("/news", "/settings/node#news");
        navigate("/settings/node#news", "/settings/client");

        expect(container.querySelector(".settings-notebook.menu-side")).not.toBeNull();
    });

    test("preserves an explicit sheet when switching tabs with the same hash", () => {
        navigate("/news", "/settings/client#news");
        navigate("/settings/client#news", "/settings/node#news");

        expect(mockState.settings).toMatchObject({tab: "node", sheet: "news"});
        expect(container.querySelector(".settings-notebook.sheet-side")).not.toBeNull();
    });
});
