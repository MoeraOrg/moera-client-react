import { PrincipalFlag, SettingType } from "api/node/api-types";
import * as Browser from "ui/browser";

export const PREFIX = "client.mercy.";
export const PLUGIN_PREFIX = "plugin.";

interface Choice {
    value: string;
    title: string;
}

export interface ClientSettingTypeModifiers {
    format?: string;
    min?: number;
    max?: number;
    step?: number;
    multiline?: boolean;
    never?: boolean;
    always?: boolean;
    items?: Choice[];
    principals?: PrincipalFlag[];
}

export type ClientSettingScope = "desktop" | "mobile" | "android" | "device";

export interface ClientSettingMetaInfo {
    name: string;
    type: SettingType;
    defaultValue?: string;
    devDefaultValue?: string;
    title?: string;
    internal?: boolean;
    modifiers?: ClientSettingTypeModifiers;
    scope?: ClientSettingScope;
}

const META: ClientSettingMetaInfo[] = [
    {
        name: "language",
        type: "string",
        defaultValue: "auto",
        modifiers: {
            format: "select",
            items: [
                {
                    title: "Automatically",
                    value: "auto"
                },
                {
                    title: "English",
                    value: "en"
                },
                {
                    title: "Polski",
                    value: "pl"
                },
                {
                    title: "Русский",
                    value: "ru"
                },
                {
                    title: "Українська",
                    value: "uk"
                }
            ]
        }
    },
    {
        name: "invitation.addon.shown-at",
        type: "Timestamp",
        defaultValue: "0",
        internal: true
    },
    {
        name: "invitation.quick-tips.shown",
        type: "bool",
        defaultValue: "false",
        internal: true
    },
    {
        name: "instants.number.mode",
        type: "string",
        defaultValue: "not-viewed",
        modifiers: {
            format: "select",
            items: [
                {
                    title: "Not viewed",
                    value: "not-viewed"
                },
                {
                    title: "Not read",
                    value: "not-read"
                }
            ]
        }
    },
    {
        name: "instants.profile-link",
        type: "bool",
        defaultValue: "false",
        modifiers: {}
    },
    {
        name: "comment.reactions.positive.default",
        type: "string",
        defaultValue: "+0x1f4a1,+0x1f44d,+0x1f4af,+0x1f60d,+0x1f600,+0x1f926,+0x1f62e,+0x1f622,+0x1f620,+0x1f92e,*",
        modifiers: {
            format: "emoji-list-positive"
        }
    },
    {
        name: "comment.reactions.negative.default",
        type: "string",
        defaultValue: "+0x1f4a4,+0x1f44e,+0x1f4a9,+0x2694,+0x23f3,+0x1f3a9,+0x1f643,+0x1f61c,+0x1f494,+0x1f47f",
        modifiers: {
            format: "emoji-list-negative"
        }
    },
    {
        name: "comment.reactions.self.enabled",
        type: "bool",
        defaultValue: "false",
        modifiers: {}
    },
    {
        name: "comment.body-src-format.default",
        type: "string",
        defaultValue: "markdown",
        modifiers: {
            format: "select",
            items: [
                {
                    title: "No formatting",
                    value: "plain-text"
                },
                {
                    title: "HTML",
                    value: "html"
                },
                {
                    title: "Markdown",
                    value: "markdown"
                },
                {
                    title: "Visual editor",
                    value: "html/visual"
                }
            ]
        }
    },
    {
        name: "comment.submit-key",
        type: "string",
        defaultValue: "enter",
        modifiers: {
            format: "select",
            items: [
                {
                    title: "Enter",
                    value: "enter"
                },
                {
                    title: "Ctrl-Enter",
                    value: "ctrl-enter"
                }
            ]
        }
    },
    {
        name: "comment.replied-to.glance.enabled",
        type: "bool",
        defaultValue: "true",
        modifiers: {},
        scope: "desktop"
    },
    {
        name: "comment.smileys.enabled",
        type: "bool",
        defaultValue: "true",
        modifiers: {}
    },
    {
        name: "feed.width",
        type: "int",
        defaultValue: "900",
        modifiers: {
            min: 100,
            max: 10000
        },
        scope: "desktop"
    },
    {
        name: "full-name.display",
        type: "string",
        defaultValue: "full-name",
        modifiers: {
            format: "select",
            items: [
                {
                    title: "Nickname only",
                    value: "name"
                },
                {
                    title: "Full name only",
                    value: "full-name"
                },
                {
                    title: "Both",
                    value: "both"
                }
            ]
        }
    },
    {
        name: "naming.location",
        type: "string",
        defaultValue: "https://naming.moera.org/moera-naming",
        devDefaultValue: "https://naming-dev.moera.org/moera-naming",
        modifiers: {}
    },
    {
        name: "entry.gallery.loop",
        type: "bool",
        defaultValue: "true",
        modifiers: {}
    },
    {
        name: "posting.time.relative",
        type: "bool",
        defaultValue: "false",
        modifiers: {}
    },
    {
        name: "posting.reactions.enabled.default",
        type: "bool",
        defaultValue: "true",
        modifiers: {}
    },
    {
        name: "posting.reactions.negative.enabled.default",
        type: "bool",
        defaultValue: "true",
        modifiers: {}
    },
    {
        name: "posting.reactions.positive.default",
        type: "string",
        defaultValue: "+0x1f4a1,+0x1f44d,+0x1f4af,+0x1f60d,+0x1f600,+0x1f926,+0x1f62e,+0x1f622,+0x1f620,+0x1f92e,*",
        modifiers: {
            format: "emoji-list-positive"
        }
    },
    {
        name: "posting.reactions.negative.default",
        type: "string",
        defaultValue: "+0x1f4a4,+0x1f44e,+0x1f4a9,+0x2694,+0x23f3,+0x1f3a9,+0x1f643,+0x1f61c,+0x1f494,+0x1f47f",
        modifiers: {
            format: "emoji-list-negative"
        }
    },
    {
        name: "posting.reactions.visible.default",
        type: "bool",
        defaultValue: "true",
        modifiers: {}
    },
    {
        name: "posting.reactions.totals-visible.default",
        type: "bool",
        defaultValue: "true",
        modifiers: {}
    },
    {
        name: "posting.reactions.self.enabled",
        type: "bool",
        defaultValue: "false",
        modifiers: {}
    },
    {
        name: "posting.visibility.default",
        type: "Principal",
        defaultValue: "public",
        modifiers: {
            principals: ["public", "signed", "subscribed", "friends", "private"]
        }
    },
    {
        name: "posting.comments.visibility.default",
        type: "Principal",
        defaultValue: "public",
        modifiers: {
            principals: ["public", "signed", "subscribed", "friends", "private", "none"]
        }
    },
    {
        name: "posting.comments.addition.default",
        type: "Principal",
        defaultValue: "signed",
        modifiers: {
            principals: ["signed", "subscribed", "friends", "private", "none"]
        }
    },
    {
        name: "posting.comments.hide.default",
        type: "bool",
        defaultValue: "false",
        modifiers: {}
    },
    {
        name: "posting.body-src-format.default",
        type: "string",
        defaultValue: "markdown",
        internal: true
    },
    {
        name: "posting.body-src-format.show-help",
        type: "bool",
        defaultValue: "true",
        internal: true
    },
    {
        name: "posting.body.font-magnitude",
        type: "int",
        defaultValue: "100",
        modifiers: {
            min: 15,
            max: 300,
            step: 5,
            format: "percentage"
        },
        scope: "desktop"
    },
    {
        name: "posting.body.font-magnitude.mobile",
        type: "int",
        defaultValue: "100",
        modifiers: {
            min: 15,
            max: 300,
            step: 5,
            format: "percentage"
        },
        scope: "mobile"
    },
    {
        name: "posting.reply.subject-prefix",
        type: "string",
        defaultValue: "Re:",
        modifiers: {}
    },
    {
        name: "posting.reply.preamble",
        type: "string",
        defaultValue: "Reply to [the post](%POST%) by %USER%:",
        modifiers: {}
    },
    {
        name: "posting.reply.quote-all",
        type: "bool",
        defaultValue: "true",
        modifiers: {}
    },
    {
        name: "posting.smileys.enabled",
        type: "bool",
        defaultValue: "true",
        modifiers: {}
    },
    {
        name: "posting.feed.news.enabled",
        type: "bool",
        defaultValue: "true",
        modifiers: {}
    },
    {
        name: "posting.media.compress.default",
        type: "bool",
        defaultValue: "true",
        modifiers: {}
    },
    {
        name: "reactions.positive.available",
        type: "string",
        defaultValue: "+0x1f4a1,+0x1f44d,+0x1f4af,+0x1f60d,+0x1f600,+0x1f926,+0x1f62e,+0x1f622,+0x1f620,+0x1f92e,"
            + "0x1f48e,0x1f37f,0x1f62b,0x1f49d,0x1f62d,0x1f9f8,0x2708,0x1f379,0x1f64f,0x1f60c,0x1f917,0x1f525,0x1f923,"
            + "0x1f970,0x1f971",
        modifiers: {
            format: "emoji-list-positive-advanced"
        }
    },
    {
        name: "reactions.negative.available",
        type: "string",
        defaultValue: "+0x1f4a4,+0x1f44e,+0x1f4a9,+0x2694,+0x23f3,+0x1f3a9,+0x1f643,+0x1f61c,+0x1f494,+0x1f47f",
        modifiers: {
            format: "emoji-list-negative-advanced"
        }
    },
    {
        name: "share.social-buttons.usage",
        type: "json",
        defaultValue: "{}",
        internal: true
    },
    {
        name: "rich-text-editor.paste-rich",
        type: "string",
        defaultValue: "ask",
        modifiers: {
            format: "select",
            items: [
                {
                    title: "Ask",
                    value: "ask"
                },
                {
                    title: "Paste text only",
                    value: "text"
                },
                {
                    title: "Paste with tags",
                    value: "html"
                }
            ]
        }
    },
    {
        name: "rich-text-editor.link-previews.max-automatic",
        type: "int",
        defaultValue: "2",
        modifiers: {
            min: 0,
            max: 64
        }
    },
    {
        name: "avatar.shape.default",
        type: "string",
        defaultValue: "circle",
        internal: true
    },
    {
        name: "avatar.shape",
        type: "string",
        defaultValue: "design",
        modifiers: {
            format: "select",
            items: [
                {
                    title: "As designed",
                    value: "design"
                },
                {
                    title: "Round",
                    value: "circle"
                },
                {
                    title: "Square",
                    value: "square"
                }
            ]
        }
    },
    {
        name: "news-button.target-story",
        type: "string",
        defaultValue: "earliest-new",
        modifiers: {
            format: "select",
            items: [
                {
                    title: "The earliest new post",
                    value: "earliest-new"
                },
                {
                    title: "The latest post",
                    value: "latest"
                }
            ]
        }
    },
    {
        name: "clock.offset",
        type: "int",
        defaultValue: "0",
        modifiers: {
            min: -2,
            max: 2
        },
        scope: "device"
    },
    {
        name: "fundraiser.preferred.auto",
        type: "bool",
        defaultValue: "true",
        modifiers: {}
    },
    {
        name: "fundraiser.preferred.prefix",
        type: "string",
        defaultValue: "",
        modifiers: {}
    },
    {
        name: "principal.public.disabled",
        type: "bool",
        defaultValue: "false",
        modifiers: {}
    },
    {
        name: "friends.subscribe-on-add",
        type: "string",
        defaultValue: "ask",
        modifiers: {
            format: "select",
            items: [
                {
                    title: "Ask",
                    value: "ask"
                },
                {
                    title: "Yes",
                    value: "yes"
                },
                {
                    title: "No",
                    value: "no"
                }
            ]
        }
    },
    {
        name: "blocked-users.unsubscribe-on-block",
        type: "string",
        defaultValue: "ask",
        modifiers: {
            format: "select",
            items: [
                {
                    title: "Ask",
                    value: "ask"
                },
                {
                    title: "Yes",
                    value: "yes"
                },
                {
                    title: "No",
                    value: "no"
                }
            ]
        }
    },
    {
        name: "blocked-users.unfriend-on-block",
        type: "string",
        defaultValue: "ask",
        modifiers: {
            format: "select",
            items: [
                {
                    title: "Ask",
                    value: "ask"
                },
                {
                    title: "Yes",
                    value: "yes"
                },
                {
                    title: "No",
                    value: "no"
                }
            ]
        }
    },
];

function collectMetaMap(map: Map<string, ClientSettingMetaInfo>, metadata: ClientSettingMetaInfo[]) {
    metadata
        .map(meta => meta.devDefaultValue !== undefined && Browser.isDevMode()
            ? {...meta, defaultValue: meta.devDefaultValue}
            : meta)
        .forEach(meta => map.set(PREFIX + meta.name, {...meta, name: PREFIX + meta.name}));
}

export function buildMetaMap(): Map<string, ClientSettingMetaInfo> {
    const metaMap = new Map();
    collectMetaMap(metaMap, META);
    if (window.Android) {
        const settings = JSON.parse(window.Android.loadSettingsMeta()) as ClientSettingMetaInfo[];
        const mobileMeta = settings.map(meta => ({...meta, scope: "mobile" as const}));
        collectMetaMap(metaMap, mobileMeta);
    }
    return metaMap;
}
