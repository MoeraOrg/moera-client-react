export default class EmojiList {

    _other: boolean;
    _included: number[];
    _includedSet: Set<number>;
    _recommended: number[];
    _recommendedSet: Set<number>;

    constructor(str: string) {
        const list = str ? str.split(",").map(s => s.trim()) : [];
        this._other = list.includes("*");
        this._included = list.filter(s => s !== "*").map(v => parseInt(v));
        this._includedSet = new Set(this._included);
        this._recommended = list.filter(s => s.startsWith("+")).map(v => parseInt(v));
        this._recommendedSet = new Set(this._recommended);
    }

    other(): boolean {
        return this._other;
    }

    included(): number[] {
        return this._included;
    }

    includes(emoji: number): boolean {
        return this._other || this._includedSet.has(emoji);
    }

    includesExplicitly(emoji: number): boolean {
        return this._includedSet.has(emoji);
    }

    recommended(): number[] {
        return this._recommended;
    }

    recommends(emoji: number): boolean {
        return this._recommendedSet.has(emoji);
    }

}
