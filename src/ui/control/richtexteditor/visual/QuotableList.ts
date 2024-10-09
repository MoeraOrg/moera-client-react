import { Blot } from 'parchment';
import Quill from 'quill';
import ListItem, { ListContainer } from 'quill/formats/list';

import * as QuoteStyle from "ui/control/richtexteditor/visual/QuoteStyle";
import { removeContainerOf } from "ui/control/richtexteditor/visual/QuoteStyle";

export class QuotableListContainer extends ListContainer {

    appendChild(other: Blot) {
        super.appendChild(other);
        if (other instanceof QuotableListItem) {
            other.runPostponedQuoteFormat();
        }
    }

    formatQuote(value: string) {
        if (value) {
            this.wrap("blockquote");
            QuoteStyle.assignStyle(this.domNode, value);
            this.attachUI(QuoteStyle.createUI(value));
        }

        this.children.forEach(child => {
            if (!(child instanceof QuotableListItem)) {
                return;
            }

            const childLevel = child.domNode.getAttribute("data-quote-level") || "0";
            const targetLevel = value || "0";
            if (childLevel !== targetLevel) {
                child.format("quote-level", value);
            }
        });

        if (!value) {
            removeContainerOf(this);
        }
    }

}

export default class QuotableListItem extends ListItem {

    private postponedQuoteValue: string | null = null;

    format(name: string, value: string): void {
        if (name === "blockquote" || name === "quote-level") {
            this.formatParent(value);
        } else {
            super.format(name, value);
        }
    }

    private formatParent(value: string): void {
        const parent = this.parent;
        if (parent instanceof QuotableListContainer) {
            super.format("quote-level", value);
            parent.formatQuote(value);
        } else {
            this.postponedQuoteValue = value;
        }
    }

    public runPostponedQuoteFormat(): void {
        if (this.postponedQuoteValue != null) {
            this.formatParent(this.postponedQuoteValue);
        }
    }

    static register(): void {
        Quill.register(QuotableListContainer, true);
    }

}
