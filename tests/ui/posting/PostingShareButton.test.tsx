import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import i18n from "i18n";
import PostingShareButton from "ui/posting/PostingShareButton";

jest.mock("api", () => jest.requireActual("api/node-name"));
jest.mock("ui/browser", () => ({getRootLocation: () => "https://moera.page"}));
jest.mock("ui/control", () => ({
    DropdownMenu: jest.requireActual("ui/control/dropdownmenu/DropdownMenuItems").DropdownMenuItems
}));
jest.mock("ui/hook", () => ({
    ...jest.requireActual("ui/hook/parent-context"),
    ...jest.requireActual("ui/hook/redux")
}));
jest.mock("util/media-images", () => ({}));
jest.mock("title-case", () => ({titleCase: (text: string) => text}));

const store = createStore(() => ({
    home: {owner: {name: "me_0"}, root: {page: "https://me.example"}},
    node: {owner: {name: "author_0"}, root: {page: "https://author.example"}},
    naming: {names: {
        author_0: {loaded: true, nodeUri: "https://author.example"},
        receiver_0: {loaded: true, nodeUri: "https://receiver.example"}
    }},
    settings: {client: {meta: new Map()}}
}));

beforeAll(async () => {
    await i18n.changeLanguage("en");
});

test.each<[string | null, string | null, string]>([
    [null, null, "https://moera.page/@author/author.example/post/local"],
    ["receiver_0", "original+1", "https://moera.page/@receiver/receiver.example/post/original%2B1"]
])("Share & Write opens the home composer with the original post link (receiver %s)", (
    receiver: string | null, id: string | null, url: string
) => {
    const menu = document.createElement("div");
    menu.innerHTML = renderToStaticMarkup(
        <Provider store={store}>
            <PostingShareButton postingId="local" postingOwnerName="author_0" postingOwnerFullName={null}
                                postingReceiverName={receiver} postingReceiverFullName={null}
                                postingReceiverPostingId={id} postingHeading="Post" postingVisible="public"/>
        </Provider>
    );

    const item = menu.querySelector<HTMLAnchorElement>('a[href*="/compose?"]');
    expect(item?.textContent).toContain("Share & Write");
    const destination = new URL(item!.href);
    expect(destination.pathname).toBe("/@me/me.example/compose");
    expect(destination.searchParams.get("type")).toBe("html");
    expect(destination.searchParams.get("text")).toBe(`<p></p><p><a href="${url}">${url}</a></p>`);
});
