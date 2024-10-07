import { Blot } from 'parchment';
import Quill from 'quill';
import ListItem, { ListContainer } from 'quill/formats/list';

import * as QuoteStyle from "ui/control/richtexteditor/visual/QuoteStyle";

export class QuotableListContainer extends ListContainer {

    appendChild(other: Blot) {
        super.appendChild(other);
        if (other instanceof QuotableListItem) {
            other.runPostponedQuoteFormat();
        }
    }

    formatQuote(value: string) {
        this.wrap("blockquote");
        QuoteStyle.assignStyle(this.domNode, value);
        this.attachUI(QuoteStyle.createUI(value));

        this.children.forEach(child => {
            if (child instanceof QuotableListItem && child.domNode.getAttribute("data-quote-level") !== value) {
                child.format("quote-level", value);
            }
        })
    }

}

export default class QuotableListItem extends ListItem {

    private postponedQuoteValue: string | null = null;

    format(name: string, value: string): void {
        if ((name === "blockquote" || name === "quote-level") && value) {
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
