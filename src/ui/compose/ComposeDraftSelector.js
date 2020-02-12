import React from 'react';
import { connect } from 'react-redux';
import { Manager, Popper, Reference } from 'react-popper';
import cx from 'classnames';
import moment from 'moment';

import { Loading, LoadingInline } from "ui/control";
import "./ComposeDraftSelector.css";

class ComposeDraftSelector extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {visible: false};
    }

    toggle = () => {
        if (!this.state.visible) {
            this.show();
        } else {
            this.hide();
        }
    };

    show = () => {
        this.setState({visible: true});
        document.addEventListener("click", this.hide);
    };

    hide = () => {
        this.setState({visible: false});
        document.removeEventListener("click", this.hide);
    };

    render() {
        const {draftList, loadingDraftList, loadedDraftList} = this.props;
        const {visible} = this.state;

        if (loadedDraftList && draftList.length > 0) {
            return (
                <Manager>
                    <Reference>
                        {({ref}) => (
                            <div ref={ref} className={cx("draft-selector", "btn-group", "dropdown", {"show": visible})}>
                                <button type="button" className="btn btn-info dropdown-toggle" onClick={this.toggle}>
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
                                                <div className="dropdown-item" key={draft.id}>
                                                    <div className="content">
                                                        <div className="fader">&nbsp;</div>
                                                        {draft.subject && <b>{draft.subject} </b>}
                                                        {draft.text}
                                                    </div>
                                                    <div className="edited">
                                                        {moment.unix(draft.editedAt).fromNow()}
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
        draftList: state.compose.draftList,
        loadingDraftList: state.compose.loadingDraftList,
        loadedDraftList: state.compose.loadedDraftList
    })
)(ComposeDraftSelector);
