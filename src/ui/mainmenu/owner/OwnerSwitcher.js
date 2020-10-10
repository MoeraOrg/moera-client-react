import React from 'react';
import { connect } from 'react-redux';

import OwnerName from "ui/mainmenu/owner/OwnerName";
import OwnerNavigator from "ui/mainmenu/owner/OwnerNavigator";
import { ownerSwitchClose, ownerSwitchOpen } from "state/owner/actions";

class OwnerSwitcher extends React.PureComponent {

    #startedInner;

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.showNavigator && this.props.showNavigator) {
            document.addEventListener("click", this.outerClick);
            document.getElementById("ownerName").select();
            document.addEventListener("mousedown", this.mouseDown);
        }
        if (prevProps.showNavigator && !this.props.showNavigator) {
            document.removeEventListener("click", this.outerClick);
            document.removeEventListener("mousedown", this.mouseDown);
        }
    }

    mouseDown = e => {
        this.#startedInner = this.isInner(e);
    }

    outerClick = e => {
        if (this.#startedInner) {
            return;
        }

        if (e.detail > 0 /* Not a simulated button click caused by Enter key */ && !this.isInner(e)) {
            this.props.ownerSwitchClose();
        }
    };

    isInner(e) {
        const ownerArea = document.getElementById("owner-switcher").getBoundingClientRect();
        return e.clientY >= ownerArea.top && e.clientY < ownerArea.bottom
            && e.clientX >= ownerArea.left && e.clientX < ownerArea.right;
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
