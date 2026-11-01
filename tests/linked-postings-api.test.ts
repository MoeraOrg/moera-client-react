import workerpool from 'workerpool';

import { SafeValidateFunction } from "safe/types";
import "safe/index";

jest.mock('workerpool', () => ({worker: jest.fn()}));

const safeValidate = (workerpool.worker as jest.Mock).mock.calls[0][0].safeValidate as SafeValidateFunction;

function posting(id: string) {
    return {
        id, revisionId: "revision", totalRevisions: 1, ownerName: "alice", bodySrcHash: "",
        body: JSON.stringify({text: id}), heading: id, createdAt: 0, revisionCreatedAt: 0
    };
}

test("validates and decodes linked postings inside feed stories", () => {
    const child = {...posting("child"), linkedPostings: [posting("grandchild")]};
    const parent = {...posting("parent"), linkedPostings: [child]};
    const feed = {
        before: 0, after: 0, totalInPast: 0, totalInFuture: 0,
        stories: [{
            id: "story", feedName: "timeline", storyType: "posting-added", createdAt: 0,
            publishedAt: 0, moment: 0, posting: parent
        }]
    };

    const result = safeValidate({schemaName: "FeedSliceInfo", data: feed, decodeBodies: true});

    expect(result.valid).toBe(true);
    expect(result.data.stories[0].posting.linkedPostings[0].body).toEqual({text: "child"});
    expect(result.data.stories[0].posting.linkedPostings[0].linkedPostings[0].body).toEqual({text: "grandchild"});
    expect(typeof child.body).toBe("string");
});

test("rejects invalid linked postings", () => {
    const {id, ...child} = posting("child");
    const parent = {...posting("parent"), linkedPostings: [child]};

    expect(safeValidate({schemaName: "PostingInfo", data: parent, decodeBodies: false}).valid).toBe(false);
});

test("accepts missing, null and empty linked postings", () => {
    expect(safeValidate({schemaName: "PostingInfo", data: posting("parent"), decodeBodies: true}).valid).toBe(true);
    for (const linkedPostings of [null, []]) {
        const parent = {...posting("parent"), linkedPostings};
        const result = safeValidate({schemaName: "PostingInfo", data: parent, decodeBodies: true});
        expect(result.valid).toBe(true);
        expect(result.data.linkedPostings).toEqual(linkedPostings);
    }
});
