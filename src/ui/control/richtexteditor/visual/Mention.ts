import Inline from 'quill/blots/inline';

export default class Mention extends Inline {

    static blotName = "mention";
    static tagName = "SPAN";
    static className = "mention";

    static create(value: string) {
        const node = super.create(value) as HTMLElement;
        node.setAttribute("data-node-name", value);
        return node;
    }

    static formats(domNode: HTMLElement) {
        return domNode.getAttribute("data-node-name");
    }

    format(name: string, value: string) {
        if (name !== this.statics.blotName || !value) {
            super.format(name, value);
        } else {
            this.domNode.setAttribute("data-node-name", value);
        }
    }

}
