import React from 'react';
import { connect } from 'react-redux';

import { closeReactionsDialog } from "state/reactionsdialog/actions";
import { isPermitted } from "state/node/selectors";
import { getPosting } from "state/postings/selectors";
import { ModalDialog } from "ui/control";
import ReactionsListView from "ui/reactionsdialog/ReactionsListView";
import ReactionsChartView from "ui/reactionsdialog/ReactionsChartView";
import "./ReactionsDialog.css";

class ReactionsDialog extends React.PureComponent {
    #itemsDom;

    constructor(props, context) {
        super(props, context);

        this.state = {chartView: false};
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (((!prevProps.show && this.props.show)
            || prevProps.activeTab !== this.props.activeTab
            || prevState.chartView !== this.state.chartView)
            && this.#itemsDom) {

            this.#itemsDom.focus();
        }
    }

    onSwitchView = () => {
        this.setState(prev => ({chartView: !prev.chartView}));
    };

    render() {
        const {show, postingId, reactionsVisible, closeReactionsDialog} = this.props;

        if (!show) {
            return null;
        }

        return (
            <ModalDialog onClose={closeReactionsDialog}>
                <div className="reactions-dialog modal-body">
                    {this.state.chartView || !reactionsVisible ?
                        <ReactionsChartView itemsRef={dom => {this.#itemsDom = dom}}
                                            onSwitchView={reactionsVisible ? this.onSwitchView : null}/>
                    :
                        <ReactionsListView postingId={postingId} itemsRef={dom => {this.#itemsDom = dom}}
                                           onSwitchView={this.onSwitchView}/>
                    }
                </div>
            </ModalDialog>
        );
    }

}

export default connect(
    state => ({
        show: state.reactionsDialog.show,
        postingId: state.reactionsDialog.postingId,
        reactionsVisible: isPermitted("reactions", getPosting(state, state.reactionsDialog.postingId), state)
    }),
    { closeReactionsDialog }
)(ReactionsDialog);
