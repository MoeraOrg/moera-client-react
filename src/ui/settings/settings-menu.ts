import { ElementType } from 'react';

import { PREFIX } from "api/settings";
import { SettingsTabId } from "state/settings/state";
import SettingsItemPassword from "ui/settings/SettingsItemPassword";

interface Sheet {
    type: "sheet";
    name: string;
    title: string;
    children: Item[];
}

interface Chapter {
    type: "chapter";
    name: null;
    title: string;
    children: Item[];
    marginBottom: null;
}

interface Option {
    type: "option";
    name: string;
    title: null;
    children: null;
    marginBottom: number | undefined;
}

interface Component {
    type: "component";
    name: null;
    title: null;
    element: ElementType;
    children: null;
    marginBottom: number | undefined;
}

export type Item = Chapter | Option | Component;

function sheet(name: string, title: string, children: Item[] = []): Sheet {
    return {type: "sheet", name, title, children};
}

function chapter(title: string, children: (Option | Component)[]): Chapter {
    return {type: "chapter", name: null, title, children, marginBottom: null};
}

export function option(name: string, marginBottom?: number): Option {
    return {type: "option", name, title: null, children: null, marginBottom};
}

export function component(element: ElementType, marginBottom?: number): Component {
    return {type: "component", name: null, title: null, element, children: null, marginBottom};
}

const MENU_ITEMS: Record<SettingsTabId, Sheet[]> = {
    "node": [
        sheet("posting", "Post", [
            chapter("General", [
                option("posting.subject.present"),
                option("posting.max-size"),
                option("posting.revealed.notification.age")
            ]),
            chapter("Media", [
                option("media.max-size"),
                option("posting.media.max-size"),
                option("posting.image.recommended-size"),
                option("posting.image.recommended-pixels")
            ])
        ]),
        sheet("news", "News", [
            option("news.lifetime"),
            option("news.purge-pinned"),
            option("posting.picked.hide-on-delete")
        ]),
        sheet("security", "Security", [
            chapter("Password", [
                component(SettingsItemPassword)
            ]),
            chapter("Subscribers & Subscriptions", [
                option("subscribers.view", 0),
                option("subscribers.view-total", 0),
                option("subscriptions.view", 0),
                option("subscriptions.view-total")
            ])
        ]),
        sheet("webui", "Web UI", [
            option("webui.enabled"),
            option("webui.redirect-to-client"),
            option("feed.width"),
            option("posting.time.relative"),
            option("webui.allow-indexing"),
            option("webui.head.top.html"),
            option("webmaster.name"),
            option("webmaster.email")
        ]),
        sheet("other", "Other")
    ],
    "client": [
        sheet("appearance", "Appearance", [
            option(PREFIX + "posting.body.font-magnitude"),
            option(PREFIX + "feed.width"),
            option(PREFIX + "avatar.shape"),
            option(PREFIX + "full-name.display", 4),
            option(PREFIX + "entry.gallery.loop")
        ]),
        sheet("notifications", "Notifications", [
            option(PREFIX + "instants.number.mode"),
            option(PREFIX + "instants.profile-link"),
            option(PREFIX + "news-button.target-story"),
            option(PREFIX + "mobile.notifications.enabled", 0),
            option(PREFIX + "mobile.notifications.news.enabled")
        ]),
        sheet("posting", "Post", [
            chapter("General", [
                option(PREFIX + "posting.visibility.default"),
                option(PREFIX + "posting.feed.news.enabled", 0),
                option(PREFIX + "posting.media.compress.default", 0),
                option(PREFIX + "posting.smileys.enabled", 0),
                option(PREFIX + "posting.time.relative"),
                option(PREFIX + "rich-text-editor.link-previews.max-automatic")
            ]),
            chapter("Comments", [
                option(PREFIX + "posting.comments.visibility.default", 0),
                option(PREFIX + "posting.comments.addition.default", 2),
                option(PREFIX + "posting.comments.hide.default")
            ]),
            chapter("Reactions", [
                option(PREFIX + "posting.reactions.enabled.default", 1),
                option(PREFIX + "posting.reactions.positive.default", 4),
                option(PREFIX + "posting.reactions.negative.enabled.default", 1),
                option(PREFIX + "posting.reactions.negative.default", 4),
                option(PREFIX + "posting.reactions.self.enabled", 0),
                option(PREFIX + "posting.reactions.totals-visible.default", 0),
                option(PREFIX + "posting.reactions.visible.default")
            ]),
            chapter("Replies", [
                option(PREFIX + "posting.reply.subject-prefix"),
                option(PREFIX + "posting.reply.preamble"),
                option(PREFIX + "posting.reply.quote-all")
            ])
        ]),
        sheet("comment", "Comment", [
            chapter("General", [
                option(PREFIX + "comment.replied-to.glance.enabled", 0),
                option(PREFIX + "comment.smileys.enabled"),
                option(PREFIX + "comment.submit-key")
            ]),
            chapter("Reactions", [
                option(PREFIX + "comment.reactions.positive.default"),
                option(PREFIX + "comment.reactions.negative.default", 4),
                option(PREFIX + "comment.reactions.self.enabled")
            ]),
        ]),
        sheet("reactions", "Reactions", [
            option(PREFIX + "reactions.positive.available"),
            option(PREFIX + "reactions.negative.available")
        ]),
        sheet("other", "Other")
    ]
}

export function getSheets(tab: SettingsTabId): Sheet[] {
    return MENU_ITEMS[tab];
}

export function getSheet(tab: SettingsTabId, sheetName: string): Sheet | null {
    const sheets = getSheets(tab);
    return sheets.find(sh => sh.name === sheetName) ?? null;
}

export function getActualTab(tab: SettingsTabId): SettingsTabId {
    return MENU_ITEMS[tab] ? tab : "node";
}

export function getActualSheetName(tab: SettingsTabId, sheetName: string): string {
    const sheets = getSheets(getActualTab(tab));
    return sheets.some(sh => sh.name === sheetName) ? sheetName : sheets[0].name;
}

function collectUsedOptions(items: Item[] | Sheet[] | null, used: Set<string>): void {
    if (items == null || items.length === 0) {
        return;
    }
    items.forEach(item => {
        if (item.type === "option") {
            used.add(item.name);
        } else {
            collectUsedOptions(item.children, used);
        }
    })
}

export function getOtherOptions(tab: SettingsTabId, allNames: Iterable<string>): Option[] {
    const used = new Set<string>();
    collectUsedOptions(getSheets(tab), used);
    const other = [];
    for (const name of allNames) {
        if (!used.has(name)) {
            other.push(option(name));
        }
    }
    return other.sort();
}
