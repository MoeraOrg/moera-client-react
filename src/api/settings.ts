import { Choice, PrincipalValue, SettingType } from "api/node/api-types";

export const PREFIX = "client.mercy.";
export const PLUGIN_PREFIX = "plugin.";

export interface ClientSettingTypeModifiers {
    format?: string;
    min?: number;
    max?: number;
    step?: number;
    multiline?: boolean;
    never?: boolean;
    always?: boolean;
    items?: Choice<string>[];
    principals?: PrincipalValue[];
}

export type ClientSettingScope = "desktop" | "mobile" | "android" | "device";

export interface ClientSettingMetaInfo {
    name: string;
    type: SettingType;
    defaultValue?: string;
    title?: string;
    internal?: boolean;
    modifiers?: ClientSettingTypeModifiers;
    scope?: ClientSettingScope;
}

const META: ClientSettingMetaInfo[] = [
    {
        name: "language",
        type: "string",
        defaultValue: "not-viewed",
        title: "Language",
        modifiers: {
            format: "select",
            items: [
                {
                    title: "English",
                    value: "en"
                },
                {
                    title: "Русский",
                    value: "ru"
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
        title: "Number of notifications to be displayed",
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
        title: "Click on avatar in a notification to open the user's profile",
        modifiers: {}
    },
    {
        name: "comment.reactions.positive.default",
        type: "string",
        defaultValue: "+0x1f4a1,+0x1f44d,+0x1f4af,+0x1f60d,+0x1f600,+0x1f926,+0x1f62e,+0x1f622,+0x1f620,+0x1f92e,*",
        title: "Default set of \"Support\" reactions to my comment",
        modifiers: {
            format: "emoji-list-positive"
        }
    },
    {
        name: "comment.reactions.negative.default",
        type: "string",
        defaultValue: "+0x1f4a4,+0x1f44e,+0x1f4a9,+0x2694,+0x23f3,+0x1f3a9,+0x1f643,+0x1f61c,+0x1f494,+0x1f47f",
        title: "Default set of \"Oppose\" reactions to my comment",
        modifiers: {
            format: "emoji-list-negative"
        }
    },
    {
        name: "comment.reactions.self.enabled",
        type: "bool",
        defaultValue: "false",
        title: "Allow to add reactions to your own comments",
        modifiers: {}
    },
    {
        name: "comment.body-src-format.default",
        type: "string",
        defaultValue: "markdown",
        title: "Default comment text formatting",
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
                }
            ]
        }
    },
    {
        name: "comment.submit-key",
        type: "string",
        defaultValue: "enter",
        title: "Send comment when pressed",
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
        title: "Show quick preview of the comment replied to",
        modifiers: {},
        scope: "desktop"
    },
    {
        name: "comment.smileys.enabled",
        type: "bool",
        defaultValue: "true",
        title: "Replace simple smileys with emojis",
        modifiers: {}
    },
    {
        name: "feed.width",
        type: "int",
        defaultValue: "900",
        title: "Feed width (in pixels)",
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
        title: "Displaying full names of users",
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
        title: "Naming server location",
        modifiers: {}
    },
    {
        name: "entry.gallery.loop",
        type: "bool",
        defaultValue: "true",
        title: "Loop gallery view",
        modifiers: {}
    },
    {
        name: "posting.time.relative",
        type: "bool",
        defaultValue: "false",
        title: "Show relative time in posts",
        modifiers: {}
    },
    {
        name: "posting.reactions.enabled.default",
        type: "bool",
        defaultValue: "true",
        title: "Enable reactions to my post by default",
        modifiers: {}
    },
    {
        name: "posting.reactions.negative.enabled.default",
        type: "bool",
        defaultValue: "true",
        title: "Enable \"Oppose\" reactions to my post by default",
        modifiers: {}
    },
    {
        name: "posting.reactions.positive.default",
        type: "string",
        defaultValue: "+0x1f4a1,+0x1f44d,+0x1f4af,+0x1f60d,+0x1f600,+0x1f926,+0x1f62e,+0x1f622,+0x1f620,+0x1f92e,*",
        title: "Default set of \"Support\" reactions to my post",
        modifiers: {
            format: "emoji-list-positive"
        }
    },
    {
        name: "posting.reactions.negative.default",
        type: "string",
        defaultValue: "+0x1f4a4,+0x1f44e,+0x1f4a9,+0x2694,+0x23f3,+0x1f3a9,+0x1f643,+0x1f61c,+0x1f494,+0x1f47f",
        title: "Default set of \"Oppose\" reactions to my post",
        modifiers: {
            format: "emoji-list-negative"
        }
    },
    {
        name: "posting.reactions.visible.default",
        type: "bool",
        defaultValue: "true",
        title: "Show the detailed list of reactions to my post by default",
        modifiers: {}
    },
    {
        name: "posting.reactions.totals-visible.default",
        type: "bool",
        defaultValue: "true",
        title: "Show the number of reactions to my post by default",
        modifiers: {}
    },
    {
        name: "posting.reactions.self.enabled",
        type: "bool",
        defaultValue: "false",
        title: "Allow to add reactions to your own posts",
        modifiers: {}
    },
    {
        name: "posting.visibility.default",
        type: "Principal",
        defaultValue: "public",
        title: "Post visibility by default",
        modifiers: {
            principals: ["public", "signed", "private"]
        }
    },
    {
        name: "posting.comments.visibility.default",
        type: "Principal",
        defaultValue: "public",
        title: "Comments visibility by default",
        modifiers: {
            principals: ["public", "signed", "private", "none"]
        }
    },
    {
        name: "posting.comments.addition.default",
        type: "Principal",
        defaultValue: "signed",
        title: "Commenting allowed by default",
        modifiers: {
            principals: ["signed", "private", "none"]
        }
    },
    {
        name: "posting.comments.hide.default",
        type: "bool",
        defaultValue: "false",
        title: "Automatically hide comments by default",
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
        title: "Font size",
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
        title: "Post font size",
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
        title: "Post reply title prefix",
        modifiers: {}
    },
    {
        name: "posting.reply.preamble",
        type: "string",
        defaultValue: "Reply to [the post](%POST%) by %USER%:",
        title: "Post reply preamble",
        modifiers: {}
    },
    {
        name: "posting.reply.quote-all",
        type: "bool",
        defaultValue: "true",
        title: "Quote the whole post on reply",
        modifiers: {}
    },
    {
        name: "posting.smileys.enabled",
        type: "bool",
        defaultValue: "true",
        title: "Replace simple smileys with emojis",
        modifiers: {}
    },
    {
        name: "posting.feed.news.enabled",
        type: "bool",
        defaultValue: "true",
        title: "Add your own posts to your News feed",
        modifiers: {}
    },
    {
        name: "posting.media.compress.default",
        type: "bool",
        defaultValue: "true",
        title: "Compress images in posts by default",
        modifiers: {}
    },
    {
        name: "reactions.positive.available",
        type: "string",
        defaultValue: "+0x1f4a1,+0x1f44d,+0x1f4af,+0x1f60d,+0x1f600,+0x1f926,+0x1f62e,+0x1f622,+0x1f620,+0x1f92e,"
            + "0x1f48e,0x1f37f,0x1f62b,0x1f49d,0x1f62d,0x1f9f8,0x2708,0x1f379,0x1f64f,0x1f60c,0x1f917,0x1f525,0x1f923,"
            + "0x1f970",
        title: "Usable \"Support\" reactions",
        modifiers: {
            format: "emoji-list-positive-advanced"
        }
    },
    {
        name: "reactions.negative.available",
        type: "string",
        defaultValue: "+0x1f4a4,+0x1f44e,+0x1f4a9,+0x2694,+0x23f3,+0x1f3a9,+0x1f643,+0x1f61c,+0x1f494,+0x1f47f",
        title: "Usable \"Oppose\" reactions",
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
        title: "When pasting text with formatting tags",
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
        title: "Maximal number of link previews created automatically",
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
        title: "Avatars shape",
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
        title: "\"Your news\" button opens",
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
        title: "Clock offset from the real time (in hours)",
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
        title: "Automatically set preferred donation method",
        modifiers: {}
    },
    {
        name: "fundraiser.preferred.prefix",
        type: "string",
        defaultValue: "",
        title: "Preferred donation method (scheme or domain)",
        modifiers: {}
    },
    {
        name: "principal.public.disabled",
        type: "bool",
        defaultValue: "false",
        title: "Disable \"Public\" access level",
        modifiers: {}
    }
];

function collectMetaMap(map: Map<string, ClientSettingMetaInfo>, metadata: ClientSettingMetaInfo[]) {
    metadata.forEach(meta => map.set(PREFIX + meta.name, {...meta, name: PREFIX + meta.name}));
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
