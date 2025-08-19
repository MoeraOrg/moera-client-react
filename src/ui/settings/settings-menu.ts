import { ComponentType } from 'react';

import { CLIENT_SETTINGS_PLUGIN_PREFIX, CLIENT_SETTINGS_PREFIX, PluginInfo } from "api";
import { SettingsTabId } from "state/settings/state";
import SettingsItemPassword from "ui/settings/SettingsItemPassword";
import SettingsItemMnemonic from "ui/settings/SettingsItemMnemonic";
import SettingsItemGrants from "ui/settings/SettingsItemGrants";
import SettingsItemTokens from "ui/settings/SettingsItemTokens";

interface Sheet {
    type: "sheet";
    name: string;
    children: Item[];
    navClass: string | undefined;
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

function sheet(name: string, children: Item[] = [], navClass?: string): Sheet {
    return {type: "sheet", name, children, navClass};
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
    "profile": [
        sheet("profile"),
        sheet("language", [
            option(CLIENT_SETTINGS_PREFIX + "language"),
        ]),
    ],
    "node": [
        sheet("posting", [
            chapter("general", null, [
                option("posting.subject.present"),
                option("posting.max-size"),
                option("posting.published.notification.age"),
                option("posting.revealed.notification.age"),
            ]),
            chapter("media", null, [
                option("media.max-size"),
                option("posting.media.max-size"),
                option("posting.image.recommended-size"),
                option("posting.image.recommended-pixels"),
            ]),
        ]),
        sheet("news", [
            chapter("general", null, [
                option("news.lifetime"),
                option("news.purge-pinned"),
                option("posting.picked.hide-on-delete"),
            ]),
            chapter("recommendations", null, [
                option("recommendations.frequency"),
                option("recommendations.safe"),
            ]),
        ]),
        sheet("security", [
            chapter("password", null, [
                component(SettingsItemPassword),
            ]),
            component(SettingsItemMnemonic),
            chapter("subscribers-and-subscriptions", null, [
                option("subscribers.view", 0),
                option("subscribers.view-total", 0),
                option("subscriptions.view", 0),
                option("subscriptions.view-total", 0),
                option("friends.view", 0),
                option("friends.view-total", 0),
                option("friend-ofs.view", 0),
                option("friend-ofs.view-total", 0),
                option("blocked-users.view", 0),
                option("blocked-by-users.view"),
            ]),
            chapter("subscription-friend-requests", null, [
                option("ask.subscribe.allowed", 0),
                option("ask.friend.allowed"),
                option("ask.interval"),
                option("ask.total.max"),
            ]),
        ]),
        sheet("moderation", [
            option("sheriffs.timeline"),
        ]),
        sheet("webui", [
            option("webui.enabled"),
            option("webui.redirect-to-client"),
            option("feed.width"),
            option("posting.time.relative"),
            option("webui.allow-indexing"),
            option("webui.head.top.html"),
            option("webmaster.name"),
            option("webmaster.email"),
        ]),
        sheet("applications", [
            chapter("grants", null, [
                component(SettingsItemGrants),
            ]),
            chapter("tokens", null, [
                component(SettingsItemTokens),
            ]),
        ]),
        sheet("addons"),
        sheet("other"),
        sheet("removal", undefined, "nav-danger mt-4"),
    ],
    "client": [
        sheet("appearance", [
            option(CLIENT_SETTINGS_PREFIX + "language"),
            option(CLIENT_SETTINGS_PREFIX + "posting.body.font-magnitude"),
            option(CLIENT_SETTINGS_PREFIX + "feed.width"),
            option(CLIENT_SETTINGS_PREFIX + "avatar.shape"),
            option(CLIENT_SETTINGS_PREFIX + "full-name.display", 4),
            option(CLIENT_SETTINGS_PREFIX + "entry.gallery.loop"),
        ]),
        sheet("notifications", [
            option(CLIENT_SETTINGS_PREFIX + "instants.number.mode"),
            option(CLIENT_SETTINGS_PREFIX + "instants.profile-link"),
            option(CLIENT_SETTINGS_PREFIX + "news-button.target-story"),
            option(CLIENT_SETTINGS_PREFIX + "mobile.notifications.enabled", 0),
            option(CLIENT_SETTINGS_PREFIX + "mobile.notifications.news.enabled"),
        ]),
        sheet("posting", [
            chapter("general", null, [
                option(CLIENT_SETTINGS_PREFIX + "posting.visibility.default"),
                option(CLIENT_SETTINGS_PREFIX + "posting.feed.news.enabled", 0),
                option(CLIENT_SETTINGS_PREFIX + "posting.media.compress.default", 0),
                option(CLIENT_SETTINGS_PREFIX + "posting.smileys.enabled", 0),
                option(CLIENT_SETTINGS_PREFIX + "posting.time.relative"),
                option(CLIENT_SETTINGS_PREFIX + "rich-text-editor.link-previews.max-automatic"),
            ]),
            chapter("comments", null, [
                option(CLIENT_SETTINGS_PREFIX + "posting.comments.visibility.default", 0),
                option(CLIENT_SETTINGS_PREFIX + "posting.comments.addition.default", 2),
                option(CLIENT_SETTINGS_PREFIX + "posting.comments.hide.default"),
            ]),
            chapter("reactions", null, [
                option(CLIENT_SETTINGS_PREFIX + "posting.reactions.enabled.default", 1),
                option(CLIENT_SETTINGS_PREFIX + "posting.reactions-disabled.positive.default", 4),
                option(CLIENT_SETTINGS_PREFIX + "posting.reactions.negative.enabled.default", 1),
                option(CLIENT_SETTINGS_PREFIX + "posting.reactions-disabled.negative.default", 4),
                option(CLIENT_SETTINGS_PREFIX + "posting.reactions.self.enabled", 0),
                option(CLIENT_SETTINGS_PREFIX + "posting.reactions.totals-visible.default", 0),
                option(CLIENT_SETTINGS_PREFIX + "posting.reactions.visible.default"),
            ]),
            chapter("replies", null, [
                option(CLIENT_SETTINGS_PREFIX + "posting.reply.subject-prefix"),
                option(CLIENT_SETTINGS_PREFIX + "posting.reply.preamble"),
                option(CLIENT_SETTINGS_PREFIX + "posting.reply.preamble-html"),
                option(CLIENT_SETTINGS_PREFIX + "posting.reply.quote-all"),
            ])
        ]),
        sheet("comment", [
            chapter("general", null, [
                option(CLIENT_SETTINGS_PREFIX + "comment.replied-to.glance.enabled", 0),
                option(CLIENT_SETTINGS_PREFIX + "comment.smileys.enabled"),
                option(CLIENT_SETTINGS_PREFIX + "comment.submit-key"),
            ]),
            chapter("reactions", null, [
                option(CLIENT_SETTINGS_PREFIX + "comment.reactions-disabled.positive.default"),
                option(CLIENT_SETTINGS_PREFIX + "comment.reactions-disabled.negative.default", 4),
                option(CLIENT_SETTINGS_PREFIX + "comment.reactions.self.enabled"),
            ]),
        ]),
        sheet("reactions", [
            option(CLIENT_SETTINGS_PREFIX + "reactions.positive.disabled"),
            option(CLIENT_SETTINGS_PREFIX + "reactions.negative.disabled"),
            option(CLIENT_SETTINGS_PREFIX + "reactions.expand-all"),
        ]),
        sheet("other"),
    ],
}

export function getSheets(tab: SettingsTabId): Sheet[] {
    return MENU_ITEMS[tab];
}

export function getSheet(tab: SettingsTabId, sheetName: string): Sheet | null {
    const sheets = getSheets(tab);
    return sheets.find(sh => sh.name === sheetName) ?? null;
}

export function getActualTab(tab: SettingsTabId): SettingsTabId {
    return MENU_ITEMS[tab] ? tab : "profile";
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
        if (!used.has(name) && !name.startsWith(CLIENT_SETTINGS_PLUGIN_PREFIX)) {
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
