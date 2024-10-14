import Delta, { Op } from 'quill-delta';

type ReplacementFunction = (match: string, ...groups: string[]) => string;

export function deltaReplace(document: Delta, pattern: RegExp, replacer: ReplacementFunction): Delta {
    const delta: Delta = new Delta();

    for (const op of document.ops) {
        if (op.insert == null) {
            console.error("deltaReplace(): Argument is not a document");
            return delta;
        }
        if (typeof op.insert !== "string") {
            delta.retain(Op.length(op));
            continue;
        }

        let next = 0;
        while (true) {
            const match = pattern.exec(op.insert);
            if (match == null) {
                delta.retain(op.insert.length - next);
                break;
            }
            delta.retain(match.index - next);
            next += match.index + match[0].length;

            const replacement = replacer(match[0], ...match.slice(1));
            if (replacement === match[0]) {
                delta.retain(replacement.length);
            } else {
                delta.delete(match[0].length).insert(replacement);
            }
        }
    }

    return delta;
}

export function deltaEmpty(delta: Delta | null | undefined): boolean {
    return delta == null
        || delta.ops.length === 0
        || (delta.ops.length === 1 && delta.ops[0].retain != null && delta.ops[0].attributes == null);
}

export function deltaFindInsert(delta: Delta, filter: (text: string) => boolean): number | null {
    let index = 0;
    for (const op of delta.ops) {
        if (op.insert && typeof op.insert === "string" && filter(op.insert)) {
            return index + op.insert.length - 1;
        } else {
            index += Op.length(op);
        }
    }
    return null;
}
