import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { ownerSwitchClose, ownerSwitchOpen } from "state/node/actions";
import OwnerName from "ui/mainmenu/search/OwnerName";
import Search from "ui/mainmenu/search/Search";
import "./OwnerSwitcher.css";

export default function OwnerSwitcher() {
    const showNavigator = useSelector((state: ClientState) => state.node.owner.showNavigator);
    const dispatch = useDispatch();

    const startedInner = useRef<boolean>(false);


    const mouseDown = useCallback((e: MouseEvent) => {
        startedInner.current = isInner(e);
    }, []);

    const outerClick = useCallback((e: MouseEvent) => {
        if (startedInner.current) {
            return;
        }

        if (e.detail > 0 /* Not a simulated button click caused by Enter key */ && !isInner(e)) {
            dispatch(ownerSwitchClose());
        }
    }, [dispatch]);

    useEffect(() => {
        if (showNavigator) {
            document.addEventListener("click", outerClick);
            document.addEventListener("mousedown", mouseDown);

            return () => {
                document.removeEventListener("click", outerClick);
                document.removeEventListener("mousedown", mouseDown);
            }
        }
    }, [mouseDown, outerClick, showNavigator]);

    const nameClick = () => {
        if (!showNavigator) {
            dispatch(ownerSwitchOpen());
        }
    }

    return (
        <div id="owner-switcher" onClick={nameClick}>
            {showNavigator ?
                <Search/>
            :
                <OwnerName/>
            }
        </div>
    );
}

function isInner(e: MouseEvent) {
    const ownerArea = document.getElementById("owner-switcher")!.getBoundingClientRect();
    return e.clientY >= ownerArea.top && e.clientY < ownerArea.bottom
        && e.clientX >= ownerArea.left && e.clientX < ownerArea.right;
}
