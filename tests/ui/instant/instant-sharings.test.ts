import { describe, expect, jest, test } from '@jest/globals';
import { createInstance, ResourceLanguage } from 'i18next';
import ICU from 'i18next-icu';

import { buildPostingReferredSummary, buildPostingSharedSummary } from "ui/instant/instant-summaries";
import en from "i18n/locales/en/message.json";
import pl from "i18n/locales/pl/message.json";
import ru from "i18n/locales/ru/message.json";
import uk from "i18n/locales/uk/message.json";

jest.mock("ui/feed/feeds", () => ({getFeedTitle: (feed: string) => feed}));
jest.mock("i18n", () => ({tGender: (gender: string | null | undefined) => gender ?? ""}));
jest.mock("util/html", () => ({htmlEntities: (value: string | null | undefined) => value ?? ""}));
jest.mock("api", () => ({NodeName: {shorten: (value: string | null | undefined) => value}}));

describe("sharing instant summary", () => {
    test.each(Object.entries({en, pl, ru, uk}))("renders groups in %s", async (
        language: string, messages: ResourceLanguage
    ) => {
        const i18n = createInstance();
        await i18n.use(ICU).init({
            resources: {[language]: {translation: messages}},
            lng: language,
            interpolation: {escapeValue: false}
        });
        const summary = buildPostingSharedSummary({
            sharings: [
                {ownerName: "alice", ownerFullName: "Alice", ownerGender: "female"},
                {ownerName: "bob", ownerFullName: "Bob"}
            ],
            totalSharings: 4,
            posting: {heading: "Sharing example"}
        }, i18n.t);
        expect(summary).toContain("Alice");
        expect(summary).toContain("Bob");
        expect(summary).toContain("Sharing example");
        expect(summary).toContain("2");
        expect(summary).not.toContain("{count");
    });

    test("uses singular gender and tolerates missing optional data", async () => {
        const i18n = createInstance();
        await i18n.use(ICU).init({resources: {ru: {translation: ru}}, lng: "ru"});
        expect(buildPostingSharedSummary({
            sharings: [{ownerName: "alice", ownerGender: "female"}], totalSharings: 1
        }, i18n.t)).toContain("поделилась");
        expect(buildPostingSharedSummary({}, i18n.t)).not.toContain("undefined");
    });
});

describe("reference instant summary", () => {
    test.each([
        ["en", en, "mentioned your post"],
        ["pl", pl, "wspomniała"],
        ["ru", ru, "упомянула ваш пост"],
        ["uk", uk, "згадала ваш допис"]
    ] as const)("renders references in %s", async (language, messages, wording) => {
        const i18n = createInstance();
        await i18n.use(ICU).init({resources: {[language]: {translation: messages}}, lng: language});
        const summary = buildPostingReferredSummary({
            sharings: [{ownerName: "alice", ownerFullName: "Alice", ownerGender: "female"}],
            totalSharings: 1,
            posting: {heading: "Referenced example"},
            references: [{ownerName: "alice", heading: "Source example"}]
        }, i18n.t);
        expect(summary).toContain("Alice");
        expect(summary).toContain("Referenced example");
        expect(summary).toContain("Source example");
        expect(summary).toContain(wording);
        expect(buildPostingReferredSummary({}, i18n.t)).not.toContain("undefined");
    });

    describe.each([
        ["en", en, "in their posts"],
        ["pl", pl, "w swoich wpisach"],
        ["ru", ru, "в своих постах"],
        ["uk", uk, "у своїх дописах"]
    ] as const)("grouped references in %s", (language, messages, wording) => {
        test.each([2, 4])("omits source headings for %i references", async totalSharings => {
            const i18n = createInstance();
            await i18n.use(ICU).init({resources: {[language]: {translation: messages}}, lng: language});
            const summary = buildPostingReferredSummary({
                sharings: [{ownerName: "alice", ownerFullName: "Alice"}, {ownerName: "bob", ownerFullName: "Bob"}],
                totalSharings,
                references: [{heading: "Alice source"}, {heading: "Bob source"}],
                posting: {heading: "Referenced example"}
            }, i18n.t);
            expect(summary).toContain("Alice");
            expect(summary).toContain("Bob");
            expect(summary).toContain("Referenced example");
            expect(summary.endsWith(wording)).toBe(true);
            expect(summary).not.toContain("Alice source");
            expect(summary).not.toContain("Bob source");
            if (totalSharings === 4) {
                expect(summary).toContain("2");
            }
            if (language === "ru" && totalSharings === 2) {
                expect(summary.replace(/<[^>]*>/g, "")).toBe(
                    'Alice и Bob упомянули ваш пост "Referenced example" в своих постах'
                );
            }
        });
    });
});
