export default class EmojiList {

    #other: boolean;
    #included: number[];
    #includedSet: Set<number>;
    #recommended: number[];
    #recommendedSet: Set<number>;

    constructor(str: string) {
        const list = str ? str.split(",").map(s => s.trim()) : [];
        this.#other = list.includes("*");
        this.#included = list.filter(s => s !== "*").map(v => parseInt(v));
        this.#includedSet = new Set(this.#included);
        this.#recommended = list.filter(s => s.startsWith("+")).map(v => parseInt(v));
        this.#recommendedSet = new Set(this.#recommended);
    }

    other(): boolean {
        return this.#other;
    }

    included(): number[] {
        return this.#included;
    }

    includes(emoji: number): boolean {
        return this.#other || this.#includedSet.has(emoji);
    }

    includesExplicitly(emoji: number): boolean {
        return this.#includedSet.has(emoji);
    }

    recommended(): number[] {
        return this.#recommended;
    }

    recommends(emoji: number): boolean {
        return this.#recommendedSet.has(emoji);
    }

}
