import { DraftInfo, DraftText, Node, PostingInfo } from "api";
import type { ClientAction } from "state/action";
import type { ActionContext } from "state/action-types";
import { composeDraftLoad, composeDraftSave, composePostingLoad } from "state/compose/actions";
import reducer from "state/compose/reducer";
import sagas from "state/compose/sagas";
import { goToCompose } from "state/navigation/actions";
import { collectSagas, invokeSaga } from "state/saga";
import { ClientState } from "state/state";
import { dispatch, select } from "state/store-sagas";

jest.mock("api", () => ({Node: {createDraft: jest.fn(), getDraft: jest.fn(), getDrafts: jest.fn(), getPosting: jest.fn()}}));
jest.mock("state/init-barriers", () => ({mutuallyIntroduced: async () => {}}));
jest.mock("state/store-sagas", () => ({dispatch: jest.fn(), select: jest.fn()}));
jest.mock("state/postings/sagas", () => ({}));
jest.mock("state/drafts/sagas", () => ({}));
jest.mock("state/mediaupload/media-upload", () => ({}));
jest.mock("state/remotemedia/sagas", () => ({loadRemoteMediaInDraftAttachments: jest.fn()}));
jest.mock("ui/browser", () => ({}));
jest.mock("i18n", () => ({}));
jest.mock("util/html", () => ({safeHtml: (text: string) => text}));
jest.mock("util/media-images", () => ({}));

let compose = reducer(undefined, goToCompose());
const context = {ownerName: "alice"} as ActionContext;

beforeEach(() => {
    compose = reducer(undefined, goToCompose());
    (select as jest.Mock).mockImplementation((selector: (state: ClientState) => unknown) =>
        selector({compose} as ClientState)
    );
    jest.mocked(dispatch).mockImplementation((action: ClientAction) => {
        compose = reducer(compose, action);
    });
});

test("a pending autosave keeps its draft separate from a newly opened composer", async () => {
    jest.mocked(Node.createDraft).mockResolvedValue({id: "previous", body: {text: "old"}} as DraftInfo);
    const saveAction = composeDraftSave(null, {draftType: "new-posting"} as DraftText);
    const pending = invokeSaga(collectSagas(sagas), Object.assign(saveAction, {context}));

    compose = reducer(compose, goToCompose(null, null, "New text"));
    await pending;
    expect(compose.draftId).toBeNull();
    expect(compose.sharedText).toBe("New text");
});

test("opening another draft starts its own load while the previous request is pending", async () => {
    const draftId = "e4d73042-d058-44ec-9fbc-36f87d3fb05d";
    const {promise, resolve} = Promise.withResolvers<DraftInfo>();
    jest.mocked(Node.getDraft).mockReturnValueOnce(promise)
        .mockResolvedValueOnce({id: draftId, body: {text: "Second"}} as DraftInfo);
    const handlers = collectSagas(sagas);
    compose = reducer(compose, goToCompose(null, "first"));
    const first = invokeSaga(handlers, Object.assign(composeDraftLoad(), {context}));
    await Promise.resolve();

    compose = reducer(compose, goToCompose(null, draftId.toUpperCase()));
    await invokeSaga(handlers, Object.assign(composeDraftLoad(), {context}));
    resolve({id: "first", body: {text: "First"}} as DraftInfo);
    await first;
    expect(compose.draft?.id).toBe(draftId);
});

test("a late posting response leaves the prefilled form open", async () => {
    const requested = Promise.withResolvers<void>();
    const posting = Promise.withResolvers<PostingInfo>();
    jest.mocked(Node.getDrafts).mockResolvedValue([]);
    jest.mocked(Node.getPosting).mockImplementation(() => {
        requested.resolve();
        return posting.promise;
    });
    compose = reducer(compose, goToCompose("previous"));
    const loading = invokeSaga(collectSagas(sagas), Object.assign(composePostingLoad(), {context}));
    await requested.promise;
    compose = reducer(compose, goToCompose(null, null, "New text"));
    posting.resolve({id: "previous", body: {text: "Previous post"}} as PostingInfo);
    await loading;
    expect(compose.posting).toBeNull();
    expect(compose.sharedText).toBe("New text");
});
