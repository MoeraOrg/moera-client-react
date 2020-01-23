import React from 'react';
import { connect } from 'react-redux';

import OwnerName from "ui/mainmenu/owner/OwnerName";
import OwnerNavigator from "ui/mainmenu/owner/OwnerNavigator";
import { ownerSwitchClose, ownerSwitchOpen } from "state/owner/actions";

class OwnerSwitcher extends React.PureComponent {

    constructor(props) {
        super(props);
        this.outerClick = this.outerClick.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.showNavigator && this.props.showNavigator) {
            document.addEventListener("click", this.outerClick);
        }
        if (prevProps.showNavigator && !this.props.showNavigator) {
            document.removeEventListener("click", this.outerClick);
        }
    }

    outerClick(e) {
        const ownerArea = document.getElementById("owner-switcher").getBoundingClientRect();
        if (e.detail > 0 /* Not a simulated button click caused by Enter key */
            && (e.clientY < ownerArea.top || e.clientY >= ownerArea.bottom
            || e.clientX < ownerArea.left || e.clientX >= ownerArea.right)) {

            this.props.ownerSwitchClose();
        }
    }

    render() {
        const {showNavigator, ownerSwitchOpen} = this.props;

        return (
            <div id="owner-switcher">
                {showNavigator ?
                    <OwnerNavigator/>
                :
                    <OwnerName onClick={() => ownerSwitchOpen()}/>
                }
            </div>
        );
    }

}

export default connect(
    state => ({
        showNavigator: state.owner.showNavigator
    }),
    { ownerSwitchOpen, ownerSwitchClose }
)(OwnerSwitcher);
