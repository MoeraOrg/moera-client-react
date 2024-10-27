import Quill from 'quill';

import QuotableListItem, { QuotableListContainer } from "ui/control/richtexteditor/visual/QuotableList";
import { SpoilerContainer } from "ui/control/richtexteditor/visual/SpoilerBlock";
import { Blot } from "parchment";

export class SpoilerableListContainer extends QuotableListContainer {

    appendChild(other: Blot): void {
        super.appendChild(other);
        if (other instanceof SpoilerableListItem) {
            other.runPostponedSpoilerFormat();
        }
    }

    formatSpoiler(value: string): void {
        if (value) {
            this.domNode.setAttribute("data-spoiler-message", value);
        }

        this.children.forEach(child => {
            if (!(child instanceof SpoilerableListItem)) {
                return;
            }

            const childMessage = child.domNode.getAttribute("data-spoiler-message");
            if (childMessage !== value) {
                child.format("spoiler-item", value);
            }
        });

        // if (!value) { TODO
        //     removeContainerOf(this);
        // }
    }

    public optimize(_context: { [key: string]: any }): void {
        const spoilerMessage = this.domNode.getAttribute("data-spoiler-message");
        if (spoilerMessage && !(this.parent instanceof SpoilerContainer)) {
            this.wrap("spoiler-container", spoilerMessage);
        }
        super.optimize(_context);
    }

}

export default class SpoilerableListItem extends QuotableListItem {

    static requiredContainer = SpoilerableListContainer;

    private postponedSpoilerValue: string | null = null;

    format(name: string, value: string): void {
        if (name === "spoiler-block" || name === "spoiler-item") {
            this.formatParentSpoiler(value);
        } else {
            super.format(name, value);
        }
    }

    private formatParentSpoiler(value: string): void {
        const parent = this.parent;
        if (parent instanceof SpoilerableListContainer) {
            super.format("spoiler-item", value);
            parent.formatSpoiler(value);
        } else {
            this.postponedSpoilerValue = value;
        }
    }

    public runPostponedSpoilerFormat(): void {
        if (this.postponedSpoilerValue != null) {
            this.formatParentSpoiler(this.postponedSpoilerValue);
        }
    }

    static register(): void {
        Quill.register(SpoilerableListContainer, true);
    }

}
