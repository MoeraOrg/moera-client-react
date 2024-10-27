import Quill from 'quill';
import Block from 'quill/blots/block';
import Container from 'quill/blots/container';
import { ListContainer } from 'quill/formats/list';
import Header from 'quill/formats/header';
// import { ContainerBlot, BlockBlot } from 'parchment'; TODO

class SpoilerContainer extends Container {

    static blotName = "spoiler-container";
    static tagName = "DIV";
    static className = "spoiler";

    // checkMerge(): boolean { TODO
    //     if (this.next == null) {
    //         return false;
    //     }
    //     const nextMessage = getSpoilerMessage(this.next);
    //     const message = getSpoilerMessage(this);
    //     return this.next.statics.blotName === this.statics.blotName && nextMessage === message;
    // }

}

class SpoilerBlock extends Block {

    static blotName = "spoiler-block";
    static tagName = "DIV";
    static className = "spoiler-block";
    static requiredContainer = SpoilerContainer;

    static create(value: string) {
        const node = super.create(value) as HTMLElement;
        node.setAttribute("data-spoiler-message", value);
        return node;
    }

    static formats(domNode: HTMLElement) {
        return domNode.getAttribute("data-spoiler-message");
    }

    format(name: string, value: string) {
        if (name !== this.statics.blotName || !value) {
            super.format(name, value);
        } else {
            this.domNode.setAttribute("data-spoiler-message", value);
        }
    }

    static register() {
        Quill.register(SpoilerContainer, true);
    }

}

SpoilerContainer.allowedChildren = [SpoilerBlock, ListContainer, Header];

// function getSpoilerMessage(blot: ContainerBlot | BlockBlot): string | null { TODO
//     const domNode = blot.children.at(0)?.domNode;
//     return domNode instanceof Element ? domNode.getAttribute("data-spoiler-message") : null;
// }

export {SpoilerContainer, SpoilerBlock as default};
