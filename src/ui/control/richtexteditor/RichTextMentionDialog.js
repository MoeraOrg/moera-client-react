import React from 'react';
import PropType from 'prop-types';
import cx from 'classnames';
import scrollIntoView from 'scroll-into-view-if-needed';

import { ModalDialog } from "ui/control/ModalDialog";
import { mentionName } from "util/misc";
import { NodeName } from "api";
import "./RichTextMentionDialog.css";

const NAMES = [
    {nodeName: "alice_0", fullName: "Alice Melamud"},
    {nodeName: "balu_0", fullName: "Shmuel Melamud"},
    {nodeName: "carol_0"},
    {nodeName: "eugene_0", fullName: "Eugene Melamud"},
    {nodeName: "nelly_0", fullName: "Nelly Brover"},
    {nodeName: "tigra_0", fullName: "Alexey Tigarev"},
    {nodeName: "unicorn_0", fullName: "Victor Dragomiretsky"},
    {nodeName: "witch_0", fullName: "Anna Scherbakova"},
];

export default class RichTextMentionDialog extends React.PureComponent {

    static propTypes = {
        show: PropType.bool,
        onSubmit: PropType.func
    }

    state = {
        selectedIndex: 0
    }

    #inputDom;

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.show && this.props.show !== prevProps.show && this.#inputDom) {
            this.#inputDom.focus();
            this.selectIndex(0);
        }
    }

    selectIndex(index) {
        index = Math.max(0, Math.min(index, NAMES.length - 1));
        this.setState({selectedIndex: index});
        const item = document.getElementById(`mention-item-${index}`);
        if (item != null) {
            scrollIntoView(item, {scrollMode: "if-needed", block: "nearest"});
        }
    }

    onKeyDown = event => {
        const {selectedIndex} = this.state;

        switch (event.key) {
            case "Escape":
            case "Esc":
                this.onClose();
                break;
            case "ArrowUp":
                this.selectIndex(selectedIndex - 1);
                break;
            case "ArrowDown":
                this.selectIndex(selectedIndex + 1);
                break;
            case "Home":
                this.selectIndex(0);
                break;
            case "End":
                this.selectIndex(NAMES.length - 1);
                break;
            case "Enter":
                this.props.onSubmit(true, NAMES[selectedIndex]);
                break;
            default:
                return;
        }
        event.preventDefault();
    }

    onClick = index => () => {
        this.props.onSubmit(true, NAMES[index]);
    }

    onClose = () => {
        this.props.onSubmit(false, {});
    }

    render() {
        const {show} = this.props;
        const {selectedIndex} = this.state;

        if (!show) {
            return null;
        }

        return (
            <ModalDialog title="Insert a mention" onClose={this.onClose}>
                <div className="modal-body">
                    <input type="text" className="form-control" ref={dom => this.#inputDom = dom}
                           onKeyDown={this.onKeyDown}/>
                    <div className="mention-select">
                        {NAMES.map((item, index) =>
                            <div key={index} id={`mention-item-${index}`}
                                 className={cx("item", {"selected": index === selectedIndex})}
                                 onClick={this.onClick(index)}>
                                <div className="full-name">{item.fullName ?? NodeName.shorten(item.nodeName)}</div>
                                <div className="name">{mentionName(item.nodeName)}</div>
                            </div>
                        )}
                    </div>
                </div>
            </ModalDialog>
        );
    }

}
