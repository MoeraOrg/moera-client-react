import { BlockquoteContainer } from "ui/control/richtexteditor/visual/Blockquote";
import { Parent } from 'parchment';

export function assignStyle(domNode: HTMLElement, level: number | string): void {
    if (typeof level === "string") {
        level = parseInt(level);
    }

    if (level > 1) {
        domNode.style.paddingLeft = `${(level - 1) * 1.5}rem`;
        domNode.style.position = "relative";
    } else {
        domNode.style.removeProperty("padding-left");
        domNode.style.removeProperty("position");
    }
}

export function createUI(level: number | string): HTMLElement {
    if (typeof level === "string") {
        level = parseInt(level);
    }

    const ui = document.createElement("div");
    ui.style.height = "100%";
    ui.style.left = "0";
    for (let i = 1; i < level; i++) {
        const pad = document.createElement("div");
        pad.className = "inner-quote";
        ui.appendChild(pad);
    }
    return ui;
}

export function removeContainerOf(block: Parent) {
    if (block.parent instanceof BlockquoteContainer) {
        block.parent.moveChildren(block.parent.parent, block.parent);
        block.parent.remove();
    }
}
