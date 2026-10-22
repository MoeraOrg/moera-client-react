import { describe, expect, jest, test } from '@jest/globals';

import { StoryInfo } from "api";
import { getInstantTarget } from "ui/instant/instant-types";

jest.mock("ui/instant/instant-summaries", () => ({}));
jest.mock("ui/instant/buttons/InstantStorySubscribeButtons", () => ({}));
jest.mock("ui/instant/buttons/InstantStoryFriendButtons", () => ({}));
jest.mock("ui/instant/buttons/InstantStoryFriendGroupButtons", () => ({}));
jest.mock("ui/instant/buttons/InstantStoryBlockedButtons", () => ({}));
jest.mock("ui/instant/buttons/InstantStorySheriffOrderButtons", () => ({}));
jest.mock("ui/instant/buttons/InstantStoryDefrostingButtons", () => ({}));

const story: StoryInfo = {
    id: "sharing-instant",
    feedName: "instant",
    storyType: "posting-shared",
    createdAt: 100,
    publishedAt: 100,
    moment: 200,
    summaryNodeName: "Drakoniha",
    postingId: "shared-posting"
};

describe("sharing instant target", () => {
    test.each([
        {remoteStoryMoment: 123456789, href: "/?before=123456789"},
        {remoteStoryMoment: 0, href: "/?before=0"}
    ])("links to the remote story at moment $remoteStoryMoment", ({remoteStoryMoment, href}) => {
        expect(getInstantTarget({...story, remoteStoryMoment})).toEqual({
            nodeName: "Drakoniha",
            href
        });
    });
});
