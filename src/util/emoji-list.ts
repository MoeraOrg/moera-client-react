export default class EmojiList {

    #other: boolean;
    #included: Set<number>;

    constructor(str: string | null | undefined) {
        const list = str ? str.split(" ").map(s => s.trim()).filter(s => !!s) : [];
        this.#other = list.includes("*");
        this.#included = new Set(list.filter(s => s !== "*").map(v => parseInt("0x" + v)));
    }

    other(): boolean {
        return this.#other;
    }

    included(): Set<number> {
        return this.#included;
    }

    includes(emoji: number): boolean {
        return this.#included.has(emoji);
    }

}
