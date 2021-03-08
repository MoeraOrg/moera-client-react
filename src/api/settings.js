export const PREFIX = "client.mercy.";

export const META = [
    {
        name: "invitation.addon.shown-at",
        type: "timestamp",
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
        modifiers: {}
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
        }
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
        name: "posting.time.relative",
        type: "bool",
        defaultValue: "false",
        title: "Show relative time in posts",
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
        title: "Post font size",
        modifiers: {
            min: 15,
            max: 300,
            step: 5,
            format: "percentage"
        }
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
    }
];

export function buildMetaMap() {
    let metadata = new Map();
    META.forEach(meta => metadata.set(PREFIX + meta.name, {name: PREFIX + meta.name, ...meta}));
    return metadata;
}
