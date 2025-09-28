import React, { ForwardedRef, forwardRef } from 'react';
import { useSelector } from 'react-redux';

import { NodeName } from "api";
import { getOwnerAvatar, getOwnerFullName, getOwnerName } from "state/node/selectors";
import { Avatar } from "ui/control";
import Jump from "ui/navigation/Jump";
import { useSandwich } from "ui/mainmenu/sandwich/sandwich-context";
import { REL_HOME } from "util/rel-node-name";
import "./SandwichMenu.css";

interface Props {
}

function SandwichMenu(_: Props, ref: ForwardedRef<HTMLDivElement>) {
    const nodeName = useSelector(getOwnerName);
    const fullName = useSelector(getOwnerFullName);
    const avatar = useSelector(getOwnerAvatar);
    const {hide} = useSandwich();

    const onJump = (_: string, performJump: () => void) => {
        hide();
        performJump();
    }

    return (
        <div className="offcanvas-body sandwich-menu" ref={ref}>
            {nodeName &&
                <>
                    <Jump nodeName={REL_HOME} href="/" className="profile" onNear={onJump} onFar={onJump}>
                        <Avatar avatar={avatar} ownerName={nodeName} size={40}/>
                        <div className="full-name">
                            {fullName || NodeName.shorten(nodeName)}
                        </div>
                        <div className="name">{NodeName.shorten(nodeName)}</div>
                    </Jump>
                    <hr/>
                </>
            }
        </div>
    );
}

export default forwardRef(SandwichMenu);
