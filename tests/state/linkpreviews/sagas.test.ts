import { Node, PostingInfo } from "api";
import { ActionContext } from "state/action-types";
import { linkPreviewLoad } from "state/linkpreviews/actions";
import sagas from "state/linkpreviews/sagas";
import { Saga } from "state/saga";
import { ClientState } from "state/state";
import { dispatch, select } from "state/store-sagas";
import { REL_HOME } from "util/rel-node-name";

jest.mock("api", () => ({
    Node: {createLinkPreview: jest.fn(), getPosting: jest.fn()},
    NodeName: jest.requireActual("api/node-name").NodeName
}));
jest.mock("state/store-sagas", () => ({dispatch: jest.fn(), select: jest.fn()}));
jest.mock("state/home/selectors", () => ({getRelNodeNameContext: () => ({})}));
jest.mock("ui/control/richtexteditor", () => ({}));
jest.mock("util/media-images", () => ({}));
jest.mock("util/media-with-caption", () => ({}));
jest.mock("i18n", () => ({}));

const createPreview = jest.mocked(Node.createLinkPreview);
const getPosting = jest.mocked(Node.getPosting);
const dispatched = jest.mocked(dispatch);
const selected = select as jest.Mock;
const loadSaga = sagas.find((entry: Saga) => entry.action === "LINK_PREVIEW_LOAD")!;
let state: ClientState;
let posting: PostingInfo;

function load(url: string) {
    const action = Object.assign(linkPreviewLoad(url), {context: {} as ActionContext});
    return {action, finished: loadSaga.saga(action)};
}

beforeEach(() => {
    state = {postings: {}} as ClientState;
    selected.mockImplementation((selector?: (value: ClientState) => unknown) => selector ? selector(state) : state);
    posting = {
        id: "post-1",
        ownerName: "author_0",
        ownerFullName: "Post Author",
        ownerSourceUri: "https://author.example/profile",
        ownerGender: "female",
        ownerAvatar: {
            mediaId: "avatar-id", path: "avatar-hash", mimeType: "image/png", width: 100, height: 100,
            shape: "circle", directPath: "https://cdn.example/temporary", directPathExpiresAt: 12345
        },
        heading: "Posting heading",
        createdAt: 1234
    } as PostingInfo;
    getPosting.mockResolvedValue(posting);
    createPreview.mockResolvedValue({url: "https://canonical.example", title: "Web page"});
});

test.each([
    "https://moera.page/@alice/~/post/post-1",
    "https://web.moera.org/@alice/alice.example/post/post-1?read=token#comments",
    "https://MOERA.PAGE/@alice/http:alice.example:8080/post/post-1/"
])("uses the cached posting for %s", async (url: string) => {
    state.postings = {alice_0: {"post-1": {posting}}};

    await load(url).finished;

    expect(getPosting).not.toHaveBeenCalled();
    expect(createPreview).not.toHaveBeenCalled();
    expect(dispatched).toHaveBeenCalledWith(expect.objectContaining({
        type: "LINK_PREVIEW_LOADED",
        payload: {url, info: expect.objectContaining({
            url, description: posting.heading, publishedAt: posting.createdAt,
            ownerName: posting.ownerName, ownerFullName: posting.ownerFullName,
            ownerSourceUri: posting.ownerSourceUri, ownerGender: posting.ownerGender,
            ownerAvatar: {
                mediaId: "avatar-id", path: "avatar-hash", mimeType: "image/png", width: 100, height: 100,
                shape: "circle"
            }
        })}
    }));
    const info = (dispatched.mock.calls[0][0] as any).payload.info;
    expect(info.title).toBeFalsy();
    expect(info.image).toBeUndefined();
    expect(info.imageHash).toBeUndefined();
    expect(posting.ownerAvatar?.directPath).toBe("https://cdn.example/temporary");
    expect(posting.ownerAvatar?.directPathExpiresAt).toBe(12345);
});

test("fetches an uncached posting from its node and caches it", async () => {
    const url = "https://moera.page/@alice_2/~/post/post-1";
    const {action, finished} = load(url);
    await finished;

    expect(getPosting).toHaveBeenCalledWith(action, "alice_2", "post-1", false);
    expect(createPreview).not.toHaveBeenCalled();
    expect(dispatched).toHaveBeenCalledWith(expect.objectContaining({
        type: "POSTING_SET", payload: expect.objectContaining({posting, nodeName: "alice_2"})
    }));
    expect(dispatched).toHaveBeenCalledWith(expect.objectContaining({
        type: "LINK_PREVIEW_LOADED", payload: {url, info: expect.objectContaining({ownerName: "author_0"})}
    }));
});

test("handles missing optional owner data and an empty heading", async () => {
    posting = {id: "post-1", ownerName: "alice_0", heading: "", createdAt: 1234} as PostingInfo;
    state.postings = {alice_0: {"post-1": {posting}}};
    await load("https://moera.page/@alice/~/post/post-1").finished;

    expect(dispatched).toHaveBeenCalledWith(expect.objectContaining({
        type: "LINK_PREVIEW_LOADED", payload: expect.objectContaining({
            info: expect.objectContaining({ownerName: "alice_0", description: ""})
        })
    }));
});

test.each([
    "https://example.org/@alice/~/post/post-1",
    "https://moera.page.example.org/@alice/~/post/post-1",
    "https://sub.moera.page/@alice/~/post/post-1",
    "https://moera.page/@alice/~/timeline",
    "https://web.moera.org/@alice/~/post/post-1/comments",
    "https://moera.page/post/post-1",
    "https://moera.page/@/alice.example/post/post-1",
    "https://moera.page/@alice/~/post/",
    "https://moera.page/@%E0%A4%A/~/post/post-1"
])("keeps ordinary preview loading for %s", async (url: string) => {
    const {action, finished} = load(url);
    await finished;

    expect(createPreview).toHaveBeenCalledWith(action, REL_HOME, url);
    expect(getPosting).not.toHaveBeenCalled();
    expect(dispatched).toHaveBeenCalledWith(expect.objectContaining({
        type: "LINK_PREVIEW_LOADED", payload: {url, info: {url, title: "Web page"}}
    }));
});

test("decodes an encoded node name", async () => {
    const {action, finished} = load("https://moera.page/@%D0%B0%D0%BB%D0%B8%D1%81%D0%B0/~/post/post-1");
    await finished;
    expect(getPosting).toHaveBeenCalledWith(action, "алиса_0", "post-1", false);
});

test("releases loading when the posting request fails", async () => {
    getPosting.mockRejectedValue(new Error("Posting not found"));
    const url = "https://moera.page/@alice/~/post/post-1";
    await load(url).finished;

    expect(dispatched).toHaveBeenCalledWith(expect.objectContaining({
        type: "LINK_PREVIEW_LOAD_FAILED", payload: {url}
    }));
    expect(createPreview).not.toHaveBeenCalled();
});
