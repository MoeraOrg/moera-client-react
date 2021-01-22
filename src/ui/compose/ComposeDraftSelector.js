import React from 'react';
import { connect } from 'react-redux';
import { Manager, Popper, Reference } from 'react-popper';
import cx from 'classnames';

import { Loading, LoadingInline } from "ui/control";
import { composeDraftListItemDelete, composeDraftSelect } from "state/compose/actions";
import ComposeDraftItem from "ui/compose/ComposeDraftItem";

class ComposeDraftSelector extends React.PureComponent {

    constructor(props, context) {
        super(props, context);

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

    onSelect = id => {
        if (id === this.props.draftId) {
            return;
        }
        this.props.composeDraftSelect(id);
    };

    onDelete = id => {
        this.props.composeDraftListItemDelete(id);
    };

    render() {
        const {postingId, draftId, draftList, loadingDraftList, loadedDraftList} = this.props;
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
                                {visible &&
                                    <Popper placement="bottom-start">
                                        {({ref, style, placement}) => (
                                            <div ref={ref} style={style} x-placement={placement} className={cx(
                                                "fade",
                                                "dropdown-menu",
                                                "shadow-sm",
                                                {"show": visible}
                                            )}>
                                                {draftList.map(draft =>
                                                    <ComposeDraftItem key={draft.id} draft={draft}
                                                                      current={draftId === draft.id}
                                                                      onSelect={this.onSelect}
                                                                      onDelete={this.onDelete}/>
                                                )}
                                            </div>
                                        )}
                                    </Popper>
                                }
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
        draftId: state.compose.draftId,
        draftList: state.compose.draftList,
        loadingDraftList: state.compose.loadingDraftList,
        loadedDraftList: state.compose.loadedDraftList,
        pulse: state.pulse.pulse // To force re-rendering only
    }),
    { composeDraftSelect, composeDraftListItemDelete }
)(ComposeDraftSelector);
