import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { ownerSwitchClose, ownerSwitchOpen } from "state/node/actions";
import OwnerName from "ui/mainmenu/owner/OwnerName";
import OwnerNavigator from "ui/mainmenu/owner/OwnerNavigator";
import "./OwnerSwitcher.css";

type Props = ConnectedProps<typeof connector>;

class OwnerSwitcher extends React.PureComponent<Props> {

    #startedInner: boolean = false;

    componentDidUpdate(prevProps: Readonly<Props>) {
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

    mouseDown = (e: MouseEvent) => {
        this.#startedInner = this.isInner(e);
    }

    outerClick = (e: MouseEvent) => {
        if (this.#startedInner) {
            return;
        }

        if (e.detail > 0 /* Not a simulated button click caused by Enter key */ && !this.isInner(e)) {
            this.props.ownerSwitchClose();
        }
    };

    isInner(e: MouseEvent) {
        const ownerArea = document.getElementById("owner-switcher")!.getBoundingClientRect();
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

const connector = connect(
    (state: ClientState) => ({
        showNavigator: state.node.owner.showNavigator
    }),
    { ownerSwitchOpen, ownerSwitchClose }
);

export default connector(OwnerSwitcher);
