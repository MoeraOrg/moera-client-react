import Header from 'quill/formats/header';

import * as QuoteStyle from "ui/control/richtexteditor/visual/QuoteStyle";
import { removeContainerOf } from "ui/control/richtexteditor/visual/QuoteStyle";

export default class QuotableHeader extends Header {

    format(name: string, value: string): void {
        if ((name === "blockquote" || name === "quote-level") && value) {
            this.wrap("blockquote");
            super.format("quote-level", value);
            QuoteStyle.assignStyle(this.domNode, value);
            this.attachUI(QuoteStyle.createUI(value));
        } else if ((name === "blockquote" || name === "quote-level") && !value) {
            super.format("quote-level", value);
            super.format("blockquote", value);
            removeContainerOf(this);
        } else {
            super.format(name, value);
        }
    }

}
