interface ReactionEmoji {
    title: string;
    color: string;
}

interface ReactionEmojis {
    positive: Partial<Record<number, ReactionEmoji>>;
    negative: Partial<Record<number, ReactionEmoji>>;
}

export const REACTION_EMOJIS: ReactionEmojis = {
    positive: {
        // Main
        0x1f4a1: {
            title: "reaction-title.hmm",
            color: "#ffcc4d"
        },
        0x1f44d: {
            title: "reaction-title.like",
            color: "#2078f4"
        },
        0x1f4af: {
            title: "reaction-title.super",
            color: "#bb1a34"
        },
        0x1f60d: {
            title: "reaction-title.love",
            color: "#dd2e44"
        },
        0x1f600: {
            title: "reaction-title.haha",
            color: "#ffcc4d"
        },
        0x1f926: {
            title: "reaction-title.facepalm",
            color: "#ffcc4d"
        },
        0x1f62e: {
            title: "reaction-title.wow",
            color: "#ffcc4d"
        },
        0x1f622: {
            title: "reaction-title.sad",
            color: "#5dadec"
        },
        0x1f620: {
            title: "reaction-title.angry",
            color: "#da2f47"
        },
        // Additional
        0x1f92e: {
            title: "reaction-title.disgust",
            color: "#77af57"
        },
        0x1f48e: {
            title: "reaction-title.brilliant",
            color: "#8ccaf7"
        },
        0x1f37f: {
            title: "reaction-title.popcorn",
            color: "#ffcc4d"
        },
        0x1f62b: { // deprecated
            title: "reaction-title.damn",
            color: "#664500"
        },
        0x1f49d: {
            title: "reaction-title.congrats",
            color: "#dd2944"
        },
        0x1f62d: {
            title: "reaction-title.cry",
            color: "#5dadec"
        },
        0x1f9f8: {
            title: "reaction-title.get-well",
            color: "#a0041e"
        },
        0x2708: { // deprecated
            title: "reaction-title.good-trip",
            color: "#55acee"
        },
        0x1f379: {
            title: "reaction-title.enjoy",
            color: "#f4900c"
        },
        0x1f64f: {
            title: "reaction-title.hope",
            color: "#ffcc4d"
        },
        0x1f60c: {
            title: "reaction-title.keep-calm",
            color: "#ffcc4d"
        },
        0x1fac2: {
            title: "reaction-title.hug",
            color: "#55acee"
        },
        0x1f525: {
            title: "reaction-title.hot",
            color: "#f4900c"
        },
        0x1f923: {
            title: "reaction-title.lol",
            color: "#ffcb4c"
        },
        0x1f970: {
            title: "reaction-title.sweet",
            color: "#dd2e44"
        },
        0x1f971: {
            title: "reaction-title.tired",
            color: "#ffcc4d"
        },
        0x1f631: {
            title: "reaction-title.horror",
            color: "#bdddf4"
        },
    },
    negative: {
        // Main
        0x2694: {
            title: "reaction-title.disagree",
            color: "#9aaab4"
        },
        0x1f44e: {
            title: "reaction-title.dislike",
            color: "#2078f4"
        },
        0x1f4a9: {
            title: "reaction-title.dirt",
            color: "#bf6952"
        },
        0x1f643: {
            title: "reaction-title.absurd",
            color: "#e8c580"
        },
        0x1f61c: {
            title: "reaction-title.bebe",
            color: "#ffcb4c"
        },
        0x1f4a4: {
            title: "reaction-title.boring",
            color: "#4289c1"
        },
        0x1f3a9: {
            title: "reaction-title.arrogant",
            color: "#744eaa"
        },
        0x1f47f: {
            title: "reaction-title.hostile",
            color: "#aa8dd8"
        },
        0x1f986: {
            title: "reaction-title.fake",
            color: "#c1694f"
        },
        // Additional
        0x274c: {
            title: "reaction-title.wrong",
            color: "#dd2e44"
        },
        0x1f984: {
            title: "reaction-title.naive",
            color: "#60379a"
        },
        0x1f9ef: {
            title: "reaction-title.chill-out",
            color: "#dd2e44"
        },
        0x1f494: {
            title: "reaction-title.hurt",
            color: "#dd2e44"
        },
        0x1f595: {
            title: "reaction-title.get-lost",
            color: "#ffdc5d"
        },
        0x23f3: { // deprecated
            title: "reaction-title.too-long",
            color: "#ffac33"
        },
    }
};

export const MAIN_POSITIVE_REACTIONS: number[] = [
    0x1f4a1, 0x1f44d, 0x1f4af, 0x1f60d, 0x1f600, 0x1f926, 0x1f62e, 0x1f622, 0x1f620,
];
export const ADDITIONAL_POSITIVE_REACTIONS: number[] = [
    0x1f92e, 0x1f37f, 0x1f525, 0x1f48e, 0x1f970, 0x1f923, 0x1fac2, 0x1f971, 0x1f631, 0x1f64f, 0x1f62d, 0x1f49d, 0x1f9f8,
    0x1f379, 0x1f60c,
];
export const POSITIVE_REACTIONS: number[] = MAIN_POSITIVE_REACTIONS.concat(ADDITIONAL_POSITIVE_REACTIONS);
export const MAIN_NEGATIVE_REACTIONS: number[] = [
    0x2694, 0x1f44e, 0x1f4a9, 0x1f643, 0x1f61c, 0x1f4a4, 0x1f3a9, 0x1f47f, 0x1f986,
];
export const ADDITIONAL_NEGATIVE_REACTIONS: number[] = [
    0x274c, 0x1f984, 0x1f9ef, 0x1f494, 0x1f595,
];
export const NEGATIVE_REACTIONS: number[] = MAIN_NEGATIVE_REACTIONS.concat(ADDITIONAL_NEGATIVE_REACTIONS);
