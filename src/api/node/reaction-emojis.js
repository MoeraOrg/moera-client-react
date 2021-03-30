export const REACTION_EMOJIS = {
    positive: {
        // Main
        0x1f4a1: {
            title: "Hmm",
            color: "#ffcc4d"
        },
        0x1f44d: {
            title: "Like",
            color: "#2078f4"
        },
        0x1f4af: {
            title: "Super",
            color: "#bb1a34"
        },
        0x1f60d: {
            title: "Love",
            color: "#dd2e44"
        },
        0x1f600: {
            title: "Ha-ha",
            color: "#ffcc4d"
        },
        0x1f926: {
            title: "Facepalm",
            color: "#ffcc4d"
        },
        0x1f62e: {
            title: "Wow",
            color: "#ffcc4d"
        },
        0x1f622: {
            title: "Sad",
            color: "#5dadec"
        },
        0x1f620: {
            title: "Angry",
            color: "#ffcc4d"
        },
        0x1f92e: {
            title: "Disgust",
            color: "#77af57"
        },
        // Additional
        0x1f48e: {
            title: "Brilliant",
            color: "#8ccaf7"
        },
        0x1f37f: {
            title: "Popcorn",
            color: "#ffcc4d"
        },
        0x1f62b: {
            title: "Damn",
            color: "#664500"
        },
        0x1f49d: {
            title: "Congrats",
            color: "#dd2944"
        },
        0x1f62d: {
            title: "Cry",
            color: "#5dadec"
        },
        0x1f9f8: {
            title: "Get well",
            color: "#a0041e"
        },
        0x2708: {
            title: "Good trip",
            color: "#55acee"
        },
        0x1f379: {
            title: "Enjoy",
            color: "#f4900c"
        },
        0x1f64f: {
            title: "Hope",
            color: "#ffcc4d"
        },
        0x1f60c: {
            title: "Keep calm",
            color: "#ffcc4d"
        },
        0x1fac2: {
            title: "Hug",
            color: "#55acee"
        },
        0x1f525: {
            title: "Hot",
            color: "#f4900c"
        },
        0x1f923: {
            title: "LOL",
            color: "#ffcb4c"
        },
        0x1f970: {
            title: "Sweet",
            color: "#dd2e44"
        }
    },
    negative: {
        0x1f4a4: {
            title: "Boring",
            color: "#4289c1"
        },
        0x1f44e: {
            title: "Dislike",
            color: "#2078f4"
        },
        0x1f4a9: {
            title: "Dirt",
            color: "#bf6952"
        },
        0x2694: {
            title: "Disagree",
            color: "#9aaab4"
        },
        0x23f3: {
            title: "Too long",
            color: "#ffac33"
        },
        0x1f3a9: {
            title: "Arrogant",
            color: "#744eaa"
        },
        0x1f643: {
            title: "Absurd",
            color: "#ffcc4d"
        },
        0x1f61c: {
            title: "Be-be",
            color: "#ffcb4c"
        },
        0x1f494: {
            title: "Hurt",
            color: "#dd2e44"
        },
        0x1f47f: {
            title: "Hostile",
            color: "#aa8dd8"
        }
    }
};

export const MAIN_POSITIVE_REACTIONS = [
    0x1f4a1, 0x1f44d, 0x1f4af, 0x1f60d, 0x1f600, 0x1f926, 0x1f62e, 0x1f622, 0x1f620, 0x1f92e
];
export const MAIN_POSITIVE_REACTIONS_SET = new Set(MAIN_POSITIVE_REACTIONS);

export const MAIN_NEGATIVE_REACTIONS = [
    0x1f4a4, 0x1f44e, 0x1f4a9, 0x2694, 0x23f3, 0x1f3a9, 0x1f643, 0x1f61c, 0x1f494, 0x1f47f
];
export const MAIN_NEGATIVE_REACTIONS_SET = new Set(MAIN_NEGATIVE_REACTIONS);
