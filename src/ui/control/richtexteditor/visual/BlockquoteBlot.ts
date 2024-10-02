import Quill from 'quill';
import Block from 'quill/blots/block';
import Container from 'quill/blots/container';

class BlockquoteContainer extends Container {

    static blotName = "blockquote-container";
    static tagName = "BLOCKQUOTE";

}

class BlockquoteBlot extends Block {

    static blotName = "blockquote";
    static tagName = "P";
    static requiredContainer = BlockquoteContainer;

    static register() {
        Quill.register(BlockquoteContainer, true);
    }

}

BlockquoteContainer.allowedChildren = [BlockquoteBlot];

export {BlockquoteContainer, BlockquoteBlot as default};
