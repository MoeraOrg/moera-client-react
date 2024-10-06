import ListItem from 'quill/formats/list';

export default class QuotableListItem extends ListItem {

    format(name: string, value: string): void {
        if (name === "blockquote") {
            this.wrap(name);
        } else {
            super.format(name, value);
        }
    }

}
