import React from 'react';
import { connect } from 'react-redux';
import { Manager, Popper, Reference } from 'react-popper';
import cx from 'classnames';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Loading, LoadingInline } from "ui/control";
import { composeDraftListItemDelete, composeDraftSelect } from "state/compose/actions";
import "./ComposeDraftSelector.css";

class ComposeDraftSelector extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {visible: false};
    }

    onToggle = () => {
        if (!this.state.visible) {
            this.onShow();
        } else {
            this.onHide();
        }
    };

    onShow = () => {
        this.setState({visible: true});
        document.addEventListener("click", this.onHide);
    };

    onHide = () => {
        this.setState({visible: false});
        document.removeEventListener("click", this.onHide);
    };

    onSelect = (id) => (e) => {
        if (e.target.closest(".delete") != null) {
            return;
        }
        this.props.composeDraftSelect(id);
    };

    onDelete = (id) => (e) => {
        this.props.composeDraftListItemDelete(id);
        e.preventDefault();
    };

    render() {
        const {postingId, draftList, loadingDraftList, loadedDraftList} = this.props;
        const {visible} = this.state;

        if (postingId != null) {
            return null;
        }
        if (loadedDraftList && draftList.length > 0) {
            return (
                <Manager>
                    <Reference>
                        {({ref}) => (
                            <div ref={ref} className={cx("draft-selector", "btn-group", "dropdown", {"show": visible})}>
                                <button type="button" className="btn btn-info dropdown-toggle" onClick={this.onToggle}>
                                    Drafts{" "}
                                    {loadingDraftList ?
                                        <LoadingInline active={loadingDraftList}/>
                                        :
                                        <span className="badge badge-light">{draftList.length}</span>
                                    }
                                </button>
                                <Popper placement="bottom-start">
                                    {({ref, style, placement}) => (
                                        <div ref={ref} style={style} x-placement={placement} className={cx(
                                            "fade",
                                            "dropdown-menu",
                                            "shadow-sm",
                                            {"show": visible}
                                        )}>
                                            {draftList.map(draft => (
                                                <div className="dropdown-item" key={draft.id}
                                                     onClick={this.onSelect(draft.id)}
                                                >
                                                    <div className="info">
                                                        <div className="content">
                                                            <div className="fader">&nbsp;</div>
                                                            {draft.subject && <b>{draft.subject} </b>}
                                                            {draft.text}
                                                        </div>
                                                        <div className="edited">
                                                            {moment.unix(draft.editedAt).fromNow()}
                                                        </div>
                                                    </div>
                                                    <div className="delete" title="Delete draft"
                                                         onClick={this.onDelete(draft.id)}
                                                    >
                                                        <FontAwesomeIcon icon="trash-alt"/>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Popper>
                            </div>
                        )}
                    </Reference>
                </Manager>
            );
        } else {
            return <Loading active={loadingDraftList}/>;
        }
    }

}

export default connect(
    state => ({
        postingId: state.compose.postingId,
        draftList: state.compose.draftList,
        loadingDraftList: state.compose.loadingDraftList,
        loadedDraftList: state.compose.loadedDraftList
    }),
    { composeDraftSelect, composeDraftListItemDelete }
)(ComposeDraftSelector);
