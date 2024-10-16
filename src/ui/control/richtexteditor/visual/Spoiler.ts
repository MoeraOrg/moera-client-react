import Inline from 'quill/blots/inline';

export default class Spoiler extends Inline {

    static blotName = "spoiler";
    static tagName = "SPAN";
    static className = "spoiler";

    static create(value: string) {
        const node = super.create(value) as HTMLElement;
        node.setAttribute("data-message", value);
        return node;
    }

    static formats(domNode: HTMLElement) {
        return domNode.getAttribute("data-message");
    }

    format(name: string, value: string) {
        if (name !== this.statics.blotName || !value) {
            super.format(name, value);
        } else {
            this.domNode.setAttribute("data-message", value);
        }
    }

}
