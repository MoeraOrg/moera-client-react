import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { StoryInfo, StorySummaryEntry } from "api";
import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { ActionContext } from "state/action-types";
import { feedPastSliceSet } from "state/feeds/actions";
import feedsReducer from "state/feeds/reducer";
import InstantHtml from "ui/instant/InstantHtml";
import i18n from "i18n";

jest.mock("api", () => ({NodeName: jest.requireActual("api/node-name").NodeName}));
jest.mock("ui/browser", () => ({}));
jest.mock("util/media-images", () => ({}));
jest.mock('title-case', () => ({titleCase: (text: string) => text}));
jest.mock("ui/nodename/hooks", () => ({useNameDisplayMode: () => "full-name"}));
jest.mock("ui/instant/buttons/InstantStorySubscribeButtons", () => ({}));
jest.mock("ui/instant/buttons/InstantStoryFriendButtons", () => ({}));
jest.mock("ui/instant/buttons/InstantStoryFriendGroupButtons", () => ({}));
jest.mock("ui/instant/buttons/InstantStoryBlockedButtons", () => ({}));
jest.mock("ui/instant/buttons/InstantStorySheriffOrderButtons", () => ({}));
jest.mock("ui/instant/buttons/InstantStoryDefrostingButtons", () => ({}));

const context = {
    ownerNameOrUrl: "author_0", homeOwnerName: "author_0", homeOwnerNameOrUrl: "author_0", searchName: "search_0"
} as ActionContext;

const story: StoryInfo = {
    id: "reference-instant", feedName: "instant", storyType: "posting-referred", createdAt: 100,
    publishedAt: 100, moment: 200, postingId: "local-post", summaryNodeName: "alice_0",
    remoteNodeName: "alice_0", remotePostingId: "source-post",
    summaryData: {
        sharings: [{ownerName: "alice_0", ownerFullName: "Alice", ownerGender: "female"}],
        totalSharings: 1,
        references: [{ownerName: "alice_0", heading: "Source example", sheriffs: [], sheriffMarks: []}],
        posting: {ownerName: "author_0", heading: "Referenced example", sheriffs: [], sheriffMarks: []}
    }
};

describe("sharing instant rendering", () => {
    beforeEach(async () => {await i18n.changeLanguage("en");});

    test.each([
        ["posting-referred", undefined, "mentioned your post"],
        ["posting-referred", null, "mentioned your post"],
        ["posting-shared", undefined, "shared your post"],
        ["posting-shared", null, "shared your post"]
    ] as const)("renders %s from structured data with summary %p", (storyType, summary, wording) => {
        const received = JSON.parse(JSON.stringify({...story, storyType, summary})) as StoryInfo;
        const original = JSON.parse(JSON.stringify(received));
        const action = Object.assign(feedPastSliceSet(
            "author_0", "instant", [received], Number.MAX_SAFE_INTEGER, 0, 0, 0
        ), {context});
        const state = feedsReducer(undefined, action);
        const renderedStory = state.author_0!.instant!.stories[0];
        const html = renderToStaticMarkup(<InstantHtml story={renderedStory}/>);
        const element = document.createElement("div");
        element.innerHTML = html;

        expect(element.textContent).toContain("Alice");
        expect(element.textContent).toContain(wording);
        expect(element.textContent).toContain("Referenced example");
        if (storyType === "posting-referred") {
            expect(element.textContent).toContain('in their post "Source example"');
        }
        expect(received).toEqual(original);
    });

    test("does not cache computed translations in an API story reused after a language change", async () => {
        const received = JSON.parse(JSON.stringify(story)) as StoryInfo;
        const action = Object.assign(feedPastSliceSet(
            "author_0", "instant", [received], Number.MAX_SAFE_INTEGER, 0, 0, 0
        ), {context});

        const english = feedsReducer(undefined, action).author_0!.instant!.stories[0];
        expect(english.summary).toContain("mentioned your post");

        await i18n.changeLanguage("ru");
        const russian = feedsReducer(undefined, action).author_0!.instant!.stories[0];
        expect(russian.summary).toContain("упомянула ваш пост");
        expect(received).not.toHaveProperty("summary");
    });

    test.each([
        ["governed source", {sheriffs: [SHERIFF_GOOGLE_PLAY_TIMELINE], sheriffMarks: []}, false],
        ["marked source", {
            sheriffs: [SHERIFF_GOOGLE_PLAY_TIMELINE],
            sheriffMarks: [{sheriffName: SHERIFF_GOOGLE_PLAY_TIMELINE}]
        }, true],
        ["source without governance", {sheriffs: [], sheriffMarks: []}, true],
        ["source without metadata", {}, true]
    ] as [string, StorySummaryEntry, boolean][])("checks moderation for %s", (_, source, hidden) => {
        const received: StoryInfo = {
            ...story,
            summaryData: {
                ...story.summaryData,
                posting: {heading: "Referenced example", sheriffs: [SHERIFF_GOOGLE_PLAY_TIMELINE], sheriffMarks: []},
                references: [{heading: "Source example", ...source}]
            }
        };
        const action = Object.assign(feedPastSliceSet(
            "author_0", "instant", [received], Number.MAX_SAFE_INTEGER, 0, 0, 0
        ), {context});

        const rendered = feedsReducer(undefined, action).author_0!.instant!.stories[0];

        expect(rendered.hideSheriffMarked).toBe(hidden);
    });

    test.each([2, 4])("shows a group of %i without source headings or their moderation marks", totalSharings => {
        const received: StoryInfo = {
            ...story,
            summaryData: {
                ...story.summaryData,
                totalSharings,
                sharings: [{ownerName: "alice_0", ownerFullName: "Alice"}, {ownerName: "bob_0", ownerFullName: "Bob"}],
                posting: {heading: "Referenced example", sheriffs: [SHERIFF_GOOGLE_PLAY_TIMELINE], sheriffMarks: []},
                references: [
                    {heading: "Marked source", sheriffs: [SHERIFF_GOOGLE_PLAY_TIMELINE],
                        sheriffMarks: [{sheriffName: SHERIFF_GOOGLE_PLAY_TIMELINE}]},
                    {heading: "Ungoverned source"}
                ]
            }
        };
        const action = Object.assign(feedPastSliceSet(
            "author_0", "instant", [received], Number.MAX_SAFE_INTEGER, 0, 0, 0
        ), {context});
        const rendered = feedsReducer(undefined, action).author_0!.instant!.stories[0];
        const element = document.createElement("div");
        element.innerHTML = renderToStaticMarkup(<InstantHtml story={rendered}/>);

        expect(element.textContent).toContain('mentioned your post "Referenced example" in their posts');
        expect(element.textContent).not.toContain("Marked source");
        expect(element.textContent).not.toContain("Ungoverned source");
        expect(rendered.hideSheriffMarked).toBe(false);
    });

});
