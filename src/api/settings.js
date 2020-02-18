export const PREFIX = "client.mercy.";

export const META = [
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
        defaultValue: "+0x1f4a4,+0x1f44e,+0x1f4a9,+0x2694,+0x23f3,+0x1f3a9,+0x1f921,+0x1f61c,+0x1f494,+0x1f47f",
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
        name: "reactions.positive.available",
        type: "string",
        defaultValue: "+0x1f4a1,+0x1f44d,+0x1f4af,+0x1f60d,+0x1f600,+0x1f926,+0x1f62e,+0x1f622,+0x1f620,+0x1f92e,"
            + "0x1f48e,0x1f37f,0x1f62b,0x1f381,0x1f62d,0x1f9f8,0x2708,0x1f379,0x1f64f",
        title: "Usable \"Support\" reactions",
        modifiers: {
            format: "emoji-list-positive-advanced"
        }
    },
    {
        name: "reactions.negative.available",
        type: "string",
        defaultValue: "+0x1f4a4,+0x1f44e,+0x1f4a9,+0x2694,+0x23f3,+0x1f3a9,+0x1f921,+0x1f61c,+0x1f494,+0x1f47f",
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
