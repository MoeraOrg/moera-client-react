import { ComponentType } from 'react';

import { PLUGIN_PREFIX, PREFIX } from "api/settings";
import { PluginInfo } from "api/node/api-types";
import { SettingsTabId } from "state/settings/state";
import SettingsItemPassword from "ui/settings/SettingsItemPassword";
import SettingsItemTokens from "ui/settings/SettingsItemTokens";

interface Sheet {
    type: "sheet";
    name: string;
    children: Item[];
}

interface Chapter {
    type: "chapter";
    name: string;
    description: string | null;
    children: Item[];
    controls?: ComponentType<any>;
    controlsParameters?: {};
}

interface Option {
    type: "option";
    name: string;
    children: null;
    marginBottom: number | undefined;
}

interface Component {
    type: "component";
    element: ComponentType;
    children: null;
    marginBottom: number | undefined;
}

interface Text {
    type: "text";
    title: string;
    children: null;
    marginBottom: number | undefined;
}

export type Item = Chapter | Option | Component | Text;

function sheet(name: string, children: Item[] = []): Sheet {
    return {type: "sheet", name, children};
}

function chapter<CP extends {}>(name: string, description: string | null, children: (Option | Component | Text)[],
                                controls?: ComponentType<CP>, controlsParameters?: CP): Chapter {
    return {type: "chapter", name, description, children, controls, controlsParameters};
}

export function option(name: string, marginBottom?: number): Option {
    return {type: "option", name, children: null, marginBottom};
}

export function component(element: ComponentType, marginBottom?: number): Component {
    return {type: "component", element, children: null, marginBottom};
}

export function text(text: string, marginBottom?: number): Text {
    return {type: "text", title: text, children: null, marginBottom};
}

const MENU_ITEMS: Record<SettingsTabId, Sheet[]> = {
    "node": [
        sheet("posting", [
            chapter("general", null, [
                option("posting.subject.present"),
                option("posting.max-size"),
                option("posting.revealed.notification.age")
            ]),
            chapter("media", null, [
                option("media.max-size"),
                option("posting.media.max-size"),
                option("posting.image.recommended-size"),
                option("posting.image.recommended-pixels")
            ])
        ]),
        sheet("news", [
            option("news.lifetime"),
            option("news.purge-pinned"),
            option("posting.picked.hide-on-delete")
        ]),
        sheet("security", [
            chapter("password", null, [
                component(SettingsItemPassword)
            ]),
            chapter("subscribers-and-subscriptions", null, [
                option("subscribers.view", 0),
                option("subscribers.view-total", 0),
                option("subscriptions.view", 0),
                option("subscriptions.view-total")
            ]),
            chapter("tokens", null, [
                component(SettingsItemTokens)
            ])
        ]),
        sheet("webui", [
            option("webui.enabled"),
            option("webui.redirect-to-client"),
            option("feed.width"),
            option("posting.time.relative"),
            option("webui.allow-indexing"),
            option("webui.head.top.html"),
            option("webmaster.name"),
            option("webmaster.email")
        ]),
        sheet("addons"),
        sheet("other")
    ],
    "client": [
        sheet("appearance", [
            option(PREFIX + "language"),
            option(PREFIX + "posting.body.font-magnitude"),
            option(PREFIX + "feed.width"),
            option(PREFIX + "avatar.shape"),
            option(PREFIX + "full-name.display", 4),
            option(PREFIX + "entry.gallery.loop")
        ]),
        sheet("notifications", [
            option(PREFIX + "instants.number.mode"),
            option(PREFIX + "instants.profile-link"),
            option(PREFIX + "news-button.target-story"),
            option(PREFIX + "mobile.notifications.enabled", 0),
            option(PREFIX + "mobile.notifications.news.enabled")
        ]),
        sheet("posting", [
            chapter("general", null, [
                option(PREFIX + "posting.visibility.default"),
                option(PREFIX + "posting.feed.news.enabled", 0),
                option(PREFIX + "posting.media.compress.default", 0),
                option(PREFIX + "posting.smileys.enabled", 0),
                option(PREFIX + "posting.time.relative"),
                option(PREFIX + "rich-text-editor.link-previews.max-automatic")
            ]),
            chapter("comments", null, [
                option(PREFIX + "posting.comments.visibility.default", 0),
                option(PREFIX + "posting.comments.addition.default", 2),
                option(PREFIX + "posting.comments.hide.default")
            ]),
            chapter("reactions", null, [
                option(PREFIX + "posting.reactions.enabled.default", 1),
                option(PREFIX + "posting.reactions.positive.default", 4),
                option(PREFIX + "posting.reactions.negative.enabled.default", 1),
                option(PREFIX + "posting.reactions.negative.default", 4),
                option(PREFIX + "posting.reactions.self.enabled", 0),
                option(PREFIX + "posting.reactions.totals-visible.default", 0),
                option(PREFIX + "posting.reactions.visible.default")
            ]),
            chapter("replies", null, [
                option(PREFIX + "posting.reply.subject-prefix"),
                option(PREFIX + "posting.reply.preamble"),
                option(PREFIX + "posting.reply.quote-all")
            ])
        ]),
        sheet("comment", [
            chapter("general", null, [
                option(PREFIX + "comment.replied-to.glance.enabled", 0),
                option(PREFIX + "comment.smileys.enabled"),
                option(PREFIX + "comment.submit-key")
            ]),
            chapter("reactions", null, [
                option(PREFIX + "comment.reactions.positive.default"),
                option(PREFIX + "comment.reactions.negative.default", 4),
                option(PREFIX + "comment.reactions.self.enabled")
            ]),
        ]),
        sheet("reactions", [
            option(PREFIX + "reactions.positive.available"),
            option(PREFIX + "reactions.negative.available")
        ]),
        sheet("other")
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
        if (!used.has(name) && !name.startsWith(PLUGIN_PREFIX)) {
            other.push(option(name));
        }
    }
    return other.sort();
}

export interface PluginProps {
    plugin: PluginInfo;
}

export function getPluginsItems(plugins: PluginInfo[], controls: ComponentType<PluginProps>): Item[] {
    return plugins.map(p =>
        chapter(
            p.title ?? p.name,
            p.description ?? null,
            p.settings?.map(st => option(st.name)) ?? [],
            controls,
            {plugin: p}
        )
    );
}
