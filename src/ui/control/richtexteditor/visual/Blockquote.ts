import Quill from 'quill';
import Block from 'quill/blots/block';
import Container from 'quill/blots/container';
import { ListContainer } from 'quill/formats/list';
import Header from 'quill/formats/header';

class BlockquoteContainer extends Container {

    static blotName = "blockquote-container";
    static tagName = "BLOCKQUOTE";

}

class Blockquote extends Block {

    static blotName = "blockquote";
    static tagName = "DIV";
    static className = "quoted-text";
    static requiredContainer = BlockquoteContainer;

    static register() {
        Quill.register(BlockquoteContainer, true);
    }

}

BlockquoteContainer.allowedChildren = [Blockquote, ListContainer, Header];

export {BlockquoteContainer, Blockquote as default};
