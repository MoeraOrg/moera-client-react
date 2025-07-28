export default class EmojiList {

    #other: boolean;
    #included: number[];
    #includedSet: Set<number>;

    constructor(str: string) {
        const list = str ? str.split(" ").map(s => s.trim()) : [];
        this.#other = list.includes("*");
        this.#included = list.filter(s => s !== "*").map(v => parseInt("0x" + v));
        this.#includedSet = new Set(this.#included);
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

}

export function parseRejectedList(rejected: string | null | undefined): number[] {
    if (!rejected) {
        return [];
    }
    return rejected.split(" ").map(s => s.trim()).filter(s => !!s && s !== "*").map(s => parseInt("0x" + s));
}
