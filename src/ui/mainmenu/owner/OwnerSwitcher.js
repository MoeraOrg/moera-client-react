import React from 'react';
import { connect } from 'react-redux';

import OwnerName from "ui/mainmenu/owner/OwnerName";
import OwnerNavigator from "ui/mainmenu/owner/OwnerNavigator";
import { ownerSwitchClose, ownerSwitchOpen } from "state/owner/actions";
import "./OwnerSwitcher.css";

class OwnerSwitcher extends React.PureComponent {

    #startedInner;

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.showNavigator && this.props.showNavigator) {
            document.addEventListener("click", this.outerClick);
            document.addEventListener("mousedown", this.mouseDown);
        }
        if (prevProps.showNavigator && !this.props.showNavigator) {
            document.removeEventListener("click", this.outerClick);
            document.removeEventListener("mousedown", this.mouseDown);
        }
    }

    nameClick = () => {
        const {showNavigator, ownerSwitchOpen} = this.props;

        if (!showNavigator) {
            ownerSwitchOpen();
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
        const {showNavigator} = this.props;

        return (
            <div id="owner-switcher" onClick={this.nameClick}>
                {showNavigator ?
                    <OwnerNavigator/>
                :
                    <OwnerName/>
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
