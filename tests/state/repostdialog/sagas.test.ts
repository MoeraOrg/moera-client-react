import { Node } from "api";
import { ActionContext } from "state/action-types";
import { repostPosting } from "state/repostdialog/actions";
import sagas from "state/repostdialog/sagas";
import { dispatch } from "state/store-sagas";
import { REL_HOME } from "util/rel-node-name";

jest.mock('i18next', () => ({t: (key: string) => key}));
jest.mock("api", () => ({Node: {republishPosting: jest.fn(), republishRemotePosting: jest.fn()}}));
jest.mock("state/store-sagas", () => ({dispatch: jest.fn()}));

const republish = Node.republishRemotePosting as jest.Mock;
const republishLocal = Node.republishPosting as jest.Mock;
const dispatched = dispatch as jest.Mock;

describe("repost posting saga", () => {
    beforeEach(() => {
        republish.mockReset();
        republishLocal.mockReset();
        dispatched.mockReset();
    });

    test("publishes to the timeline and confirms the share after success", async () => {
        republish.mockResolvedValue({status: "OK"});
        const action = Object.assign(repostPosting("alice", "post-1", "private"), {
            context: {} as ActionContext
        });

        await sagas[0].saga(action);

        expect(republish).toHaveBeenCalledWith(action, REL_HOME, "alice", "post-1", {
            remoteFeedName: "timeline",
            postingView: "private",
            publications: [
                {feedName: "timeline", viewed: true, read: true},
                {feedName: "news", viewed: true, read: true}
            ]
        });
        expect(republishLocal).not.toHaveBeenCalled();
        expect(dispatched.mock.calls.map(([signal]) => signal.type)).toEqual([
            "FLASH_BOX", "REPOST_POSTING_SUCCEEDED"
        ]);
        expect(dispatched.mock.calls[0][0].payload.message).toBe("you-shared-post");
    });

    test("uses the local republish endpoint for a posting on the home node", async () => {
        republishLocal.mockResolvedValue({status: "OK"});
        const action = Object.assign(repostPosting("alice", "post-1", "signed"), {
            context: {homeOwnerName: "alice", homeOwnerNameOrUrl: "alice"} as ActionContext
        });

        await sagas[0].saga(action);

        expect(republishLocal).toHaveBeenCalledWith(action, REL_HOME, "post-1", {
            postingView: "signed",
            publications: [
                {feedName: "timeline", viewed: true, read: true},
                {feedName: "news", viewed: true, read: true}
            ]
        });
        expect(republish).not.toHaveBeenCalled();
        expect(dispatched.mock.calls.map(([signal]) => signal.type)).toEqual([
            "FLASH_BOX", "REPOST_POSTING_SUCCEEDED"
        ]);
    });

    test("reports the error and releases submission after failure", async () => {
        const error = new Error("offline");
        republish.mockRejectedValue(error);
        const action = Object.assign(repostPosting("alice", "post-1", "signed"), {
            context: {} as ActionContext
        });

        await sagas[0].saga(action);

        expect(dispatched.mock.calls.map(([signal]) => signal.type)).toEqual([
            "REPOST_POSTING_FAILED", "ERROR_THROWN"
        ]);
        expect(dispatched.mock.calls[1][0].payload.e).toBe(error);
    });
});
