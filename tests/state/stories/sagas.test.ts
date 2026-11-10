import { Node, StoryInfo } from "api";
import { ActionContext } from "state/action-types";
import { Saga } from "state/saga";
import { storyOperationsUpdate } from "state/stories/actions";
import sagas from "state/stories/sagas";
import { dispatch } from "state/store-sagas";
import { REL_CURRENT, REL_HOME, RelNodeName } from "util/rel-node-name";

jest.mock("api", () => ({Node: {updateStory: jest.fn()}}));
jest.mock("state/store-sagas", () => ({dispatch: jest.fn(), select: jest.fn()}));
jest.mock("ui/browser", () => ({}));
jest.mock("i18n", () => ({}));

const updateStory = jest.mocked(Node.updateStory);
const dispatched = jest.mocked(dispatch);
const operationsUpdateSaga = sagas.find((entry: Saga) => entry.action === "STORY_OPERATIONS_UPDATE");

describe("story operations update", () => {
    test.each([REL_CURRENT, REL_HOME, "remote"])(
        "updates the story on %s and stores the server response", async (nodeName: RelNodeName | string) => {
            expect(operationsUpdateSaga).toBeDefined();
            const action = Object.assign(storyOperationsUpdate("story-1", nodeName, {view: "private"}), {
                context: {} as ActionContext
            });
            const story: StoryInfo = {
                id: "story-1", feedName: "timeline", storyType: "posting-added", createdAt: 100, publishedAt: 100,
                moment: 100, postingId: "post-1", operations: {view: "private", edit: "admin", delete: "admin"}
            };
            updateStory.mockResolvedValue(story);

            await operationsUpdateSaga!.saga(action);

            expect(updateStory).toHaveBeenCalledWith(action, nodeName, "story-1", {operations: {view: "private"}});
            expect(dispatched).toHaveBeenCalledTimes(1);
            expect(dispatched).toHaveBeenCalledWith(expect.objectContaining({
                type: "STORY_UPDATED", payload: {nodeName, story}, cause: action
            }));
        }
    );

    test("reports a failed update without changing the stored story", async () => {
        expect(operationsUpdateSaga).toBeDefined();
        const error = new Error("offline");
        updateStory.mockRejectedValue(error);
        const action = Object.assign(storyOperationsUpdate("story-1", REL_CURRENT, {view: "private"}), {
            context: {} as ActionContext
        });

        await operationsUpdateSaga!.saga(action);

        expect(dispatched).toHaveBeenCalledTimes(1);
        expect(dispatched).toHaveBeenCalledWith(expect.objectContaining({
            type: "ERROR_THROWN", payload: {e: error}
        }));
    });
});
