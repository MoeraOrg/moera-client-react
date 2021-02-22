import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { NodeName } from "api";
import { Button, NameSelector } from "ui/control";
import { ownerSwitch, ownerSwitchClose } from "state/owner/actions";
import "./OwnerNavigator.css";

class OwnerNavigator extends React.Component {

    static propTypes = {
        switching: PropTypes.bool,
        ownerSwitch: PropTypes.func,
        ownerSwitchClose: PropTypes.func
    }

    state = {
        query: ""
    }

    onChange = query => {
        this.setState({query});
    }

    onSubmit = (success, {nodeName}) => {
        if (success && nodeName) {
            this.props.ownerSwitch(nodeName);
        } else {
            this.props.ownerSwitchClose();
        }
    }

    onButtonClick = () => {
        this.onSubmit(true, {nodeName: this.state.query});
    }

    render() {
        const {ownerName, switching} = this.props;

        return (
            <div id="owner-navigator">
                <NameSelector id="ownerName" defaultQuery={NodeName.shorten(ownerName)} onChange={this.onChange}
                              onSubmit={this.onSubmit}/>
                <Button variant="secondary" size="sm" loading={switching} onClick={this.onButtonClick}>Go</Button>
            </div>
        );
    }

}

export default connect(
    state => ({
        ownerName: state.owner.name,
        switching: state.owner.switching
    }),
    { ownerSwitch, ownerSwitchClose }
)(OwnerNavigator);
