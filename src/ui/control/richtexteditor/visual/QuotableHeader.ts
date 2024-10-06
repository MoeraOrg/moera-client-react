import Header from "quill/formats/header";

export default class QuotableHeader extends Header {

    format(name: string, value: string): void {
        if (name === "blockquote") {
            this.wrap(name);
        } else {
            super.format(name, value);
        }
    }

}
