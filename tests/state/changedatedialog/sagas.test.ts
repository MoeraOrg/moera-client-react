import { Node, PostingInfo } from "api";
import { ClientAction } from "state/action";
import { ActionContext } from "state/action-types";
import { openChangeDateDialog, storyChangeDate } from "state/changedatedialog/actions";
import dialogReducer from "state/changedatedialog/reducer";
import sagas from "state/changedatedialog/sagas";
import postingReducer from "state/postings/reducer";
import { PostingsState } from "state/postings/state";
import { dispatch } from "state/store-sagas";
import { REL_CURRENT } from "util/rel-node-name";

jest.mock("api", () => ({Node: {updateStory: jest.fn()}}));
jest.mock("ui/browser", () => ({}));
jest.mock("i18n", () => ({}));
jest.mock("util/media-images", () => ({}));
jest.mock("util/html", () => ({}));
jest.mock("util/text", () => ({}));
jest.mock("state/store-sagas", () => ({dispatch: jest.fn()}));

const context = {ownerNameOrUrl: "author", homeOwnerNameOrUrl: "author", searchName: "search"} as ActionContext;
const changeDateSaga = sagas.find(entry => entry.action === "STORY_CHANGE_DATE")!;

test.each([
    {id: "original", publishedAt: 50, earliestPublishedAt: 50},
    {id: "repost", publishedAt: 300, earliestPublishedAt: 100}
])("changing $id updates the cached publication date from the API response without an event", async ({
    id, publishedAt, earliestPublishedAt
}) => {
    const posting: PostingInfo = {
        id: "post-1", revisionId: "revision-1", totalRevisions: 1, ownerName: "author", bodySrcHash: "hash",
        body: {text: "Normal post"}, heading: "Normal post", createdAt: 100, revisionCreatedAt: 100
    };
    let postings: PostingsState = {
        author: {"post-1": {posting: {
            ...posting, earliestPublishedAt: 100,
            feedReferences: [
                {feedName: "timeline", storyId: "original", publishedAt: 100, moment: 100000},
                {feedName: "timeline", storyId: "repost", publishedAt: 200, moment: 200000},
                {feedName: "news", storyId: "news-story", publishedAt: 10, moment: 10000}
            ]
        }, visitRecorded: true}}
    };
    let dialog = dialogReducer(undefined, {...openChangeDateDialog(id, 100), context});
    const action = {...storyChangeDate(id, publishedAt), context};
    dialog = dialogReducer(dialog, action);
    jest.mocked(Node.updateStory).mockResolvedValue({
        id, feedName: "timeline", storyType: "posting-added", createdAt: 100,
        publishedAt, moment: publishedAt * 1000, posting
    });
    jest.mocked(dispatch).mockImplementation((signal: ClientAction) => {
        postings = postingReducer(postings, {...signal, context});
        dialog = dialogReducer(dialog, {...signal, context});
    });

    await changeDateSaga.saga(action);

    expect(Node.updateStory).toHaveBeenCalledWith(action, REL_CURRENT, id, {publishAt: publishedAt});
    expect(postings.author?.["post-1"]?.posting?.earliestPublishedAt).toBe(earliestPublishedAt);
    expect(postings.author?.["post-1"]?.posting?.feedReferences).toEqual(expect.arrayContaining([
        expect.objectContaining({storyId: id, publishedAt, moment: publishedAt * 1000}),
        {feedName: "news", storyId: "news-story", publishedAt: 10, moment: 10000}
    ]));
    expect(postings.author?.["post-1"]?.posting?.body.text).toBe("Normal post");
    expect(postings.author?.["post-1"]?.visitRecorded).toBe(true);
    expect(dialog.show).toBe(false);
    expect(dialog.changing).toBe(false);
});
