import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames';
import scrollIntoView from 'scroll-into-view-if-needed';
import deepEqual from 'react-fast-compare';
import debounce from 'lodash.debounce';

import { getNamesInComments } from "state/detailedposting/selectors";
import { contactsPrepare } from "state/contacts/actions";
import { ModalDialog } from "ui/control/ModalDialog";
import { mentionName } from "util/misc";
import { namesListQuery } from "util/names-list";
import { NodeName } from "api";
import "./RichTextMentionDialog.css";

class RichTextMentionDialog extends React.PureComponent {

    static propTypes = {
        show: PropType.bool,
        onSubmit: PropType.func
    }

    state = {
        selectedIndex: -1,
        names: [],
        query: ""
    }

    #inputDom;

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.show && this.props.show !== prevProps.show) {
            if (this.#inputDom) {
                this.#inputDom.focus();
            }
            this.selectIndex(-1);
            this.refreshNames("");
        }
        if (!deepEqual(this.props.names, prevProps.names)) {
            this.refreshNames(this.state.query);
        }
    }

    refreshNames(query) {
        this.setState({names: namesListQuery(this.props.names, query), query, selectedIndex: -1});
        this.loadContacts();
    }

    loadContacts = debounce(() => {
        if (this.props.show) {
            this.props.contactsPrepare(this.state.query);
        }
    }, 500)

    selectIndex(index) {
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
                this.selectIndex(Math.max(0, selectedIndex - 1));
                break;
            case "ArrowDown":
                this.selectIndex(Math.min(selectedIndex + 1, names.length - 1));
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
        const {names, query} = this.state;

        if (index >= 0 && index < names.length) {
            this.props.onSubmit(true, names[index]);
        } else {
            this.props.onSubmit(false, {nodeName: query});
        }
    }

    onClose = () => {
        this.onSubmit(-1);
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
    }),
    { contactsPrepare }
)(RichTextMentionDialog);
