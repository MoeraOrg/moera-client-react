import Quill from 'quill';
import Block from 'quill/blots/block';
import Container from 'quill/blots/container';
import { ListContainer } from 'quill/formats/list';
import Header from 'quill/formats/header';
import Scroll from 'quill/blots/scroll';

import * as QuoteStyle from "ui/control/richtexteditor/visual/QuoteStyle";

class BlockquoteContainer extends Container {

    static blotName = "blockquote-container";
    static tagName = "BLOCKQUOTE";

}

class Blockquote extends Block {

    static blotName = "blockquote";
    static tagName = "DIV";
    static className = "quoted-text";
    static requiredContainer = BlockquoteContainer;

    constructor(scroll: Scroll, domNode: HTMLElement) {
        super(scroll, domNode);
        this.format("quote-level", "1");
    }

    format(name: string, value: string) {
        if ((name === "blockquote" || name === "quote-level") && value) {
            super.format("quote-level", value);
            QuoteStyle.assignStyle(this.domNode, value);
            this.attachUI(QuoteStyle.createUI(value));
        } else {
            super.format(name, value);
        }
    }

    static register() {
        Quill.register(BlockquoteContainer, true);
    }

}

BlockquoteContainer.allowedChildren = [Blockquote, ListContainer, Header];

export {BlockquoteContainer, Blockquote as default};
