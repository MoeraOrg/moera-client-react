import twemojiData from "util/twemoji-data.json";

export function twemojiUrl(emoji: string): string {
    return `https://cdnjs.cloudflare.com/ajax/libs/twemoji/${twemojiData.version}/svg/${emoji}.svg`;
}
