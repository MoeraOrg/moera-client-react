import Quill, { Range } from 'quill';
import Emitter from 'quill/core/emitter';
import LinkBlot from 'quill/formats/link';
import { BaseTooltip } from 'quill/themes/base';
import i18n from 'i18next';

// Copy of SnowTooltip from https://github.com/slab/quill/blob/main/packages/quill/src/themes/snow.ts

export default class LinkTooltip extends BaseTooltip {

    static TEMPLATE = [
        '<span class="title"></span>',
        '<a class="ql-preview" rel="noopener noreferrer" target="_blank" href="about:blank"></a>',
        '<input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL">',
        '<a class="ql-action"></a>',
        '<a class="ql-remove"></a>',
    ].join('');

    preview = this.root.querySelector('a.ql-preview');

    constructor(quill: Quill, boundsContainer: HTMLElement) {
        super(quill, boundsContainer);
        this.localize();
    }

    listen() {
        super.listen();
        // @ts-expect-error Fix me later
        this.root
            .querySelector("a.ql-action")
            .addEventListener("click", (event) => {
                if (this.root.classList.contains("ql-editing")) {
                    this.save();
                } else {
                    // @ts-expect-error Fix me later
                    this.edit("link", this.preview.textContent);
                }
                event.preventDefault();
            });
        // @ts-expect-error Fix me later
        this.root
            .querySelector("a.ql-remove")
            .addEventListener("click", (event) => {
                if (this.linkRange != null) {
                    const range = this.linkRange;
                    this.restoreFocus();
                    this.quill.formatText(range, "link", false, Emitter.sources.USER);
                    delete this.linkRange;
                }
                event.preventDefault();
                this.hide();
            });
        this.quill.on(
            Emitter.events.SELECTION_CHANGE,
            (range, oldRange, source) => {
                if (range == null) return;
                if (range.length === 0 && source === Emitter.sources.USER) {
                    const [link, offset] = this.quill.scroll.descendant(
                        LinkBlot,
                        range.index,
                    );
                    if (link != null) {
                        this.linkRange = new Range(range.index - offset, link.length());
                        const preview = LinkBlot.formats(link.domNode);
                        // @ts-expect-error Fix me later
                        this.preview.textContent = preview;
                        // @ts-expect-error Fix me later
                        this.preview.setAttribute('href', preview);
                        this.show();
                        const bounds = this.quill.getBounds(this.linkRange);
                        if (bounds != null) {
                            this.position(bounds);
                        }
                        return;
                    }
                } else {
                    delete this.linkRange;
                }
                this.hide();
            },
        );
    }

    localize() {
        this.assignText(".title", i18n.t("open-link"));
        this.assignText(".ql-action", i18n.t("edit"));
        this.assignText(".ql-remove", i18n.t("delete"));
    }

    assignText(query: string, text: string) {
        const element = this.root.querySelector(query);
        if (element) {
            element.textContent = text;
        }
    }

    show() {
        super.show();
        this.root.removeAttribute("data-mode");
    }

}
