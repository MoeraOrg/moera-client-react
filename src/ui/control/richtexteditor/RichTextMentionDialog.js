import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames';
import scrollIntoView from 'scroll-into-view-if-needed';
import deepEqual from 'react-fast-compare';

import { ModalDialog } from "ui/control/ModalDialog";
import { mentionName } from "util/misc";
import { NodeName } from "api";
import { getNamesInComments } from "state/detailedposting/selectors";
import "./RichTextMentionDialog.css";

class RichTextMentionDialog extends React.PureComponent {

    static propTypes = {
        show: PropType.bool,
        onSubmit: PropType.func
    }

    state = {
        selectedIndex: 0,
        names: [],
        query: ""
    }

    #inputDom;

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.show && this.props.show !== prevProps.show) {
            if (this.#inputDom) {
                this.#inputDom.focus();
            }
            this.selectIndex(0);
            this.refreshNames("");
        }
        if (!deepEqual(this.props.names, prevProps.names)) {
            this.refreshNames(this.state.query);
        }
    }

    refreshNames(query) {
        this.setState({query});
        const regexes = query.trim().split(/\s+/).map(prefix => RegExp("(^|\\s)" + prefix, "i"));
        const names = this.props.names.filter(item => this.constructor.itemMatch(item, regexes));
        this.setState({names, selectedIndex: 0});
    }

    static itemMatch(item, regexes) {
        const haystack = item.fullName ? item.fullName + " " + item.nodeName : item.nodeName;
        return regexes.every(regex => regex.test(haystack));
    }

    selectIndex(index) {
        const {names} = this.state;

        index = names.length > 0 ? Math.max(0, Math.min(index, names.length - 1)) : 0;
        this.setState({selectedIndex: index});
        const item = document.getElementById(`mention-item-${index}`);
        if (item != null) {
            scrollIntoView(item, {scrollMode: "if-needed", block: "nearest"});
        }
    }

    onKeyDown = event => {
        const {names, selectedIndex} = this.state;

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
                this.selectIndex(names.length - 1);
                break;
            case "Enter":
                if (names.length > 0) {
                    this.onSubmit(selectedIndex);
                } else {
                    this.onClose();
                }
                break;
            default:
                return;
        }
        event.preventDefault();
    }

    onChange = event => {
        this.refreshNames(event.target.value);
    }

    onClick = index => () => {
        this.onSubmit(index);
    }

    onSubmit(index) {
        this.props.onSubmit(true, this.state.names[index]);
    }

    onClose = () => {
        this.props.onSubmit(false, {nodeName: this.state.query});
    }

    render() {
        const {show} = this.props;
        const {names, selectedIndex, query} = this.state;

        if (!show) {
            return null;
        }

        return (
            <ModalDialog title="Insert a mention" onClose={this.onClose}>
                <div className="modal-body">
                    <input type="text" className="form-control" value={query} ref={dom => this.#inputDom = dom}
                           onKeyDown={this.onKeyDown} onChange={this.onChange}/>
                    <div className="mention-select">
                        {names.map((item, index) =>
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

export default connect(
    state => ({
        names: getNamesInComments(state)
    })
)(RichTextMentionDialog);