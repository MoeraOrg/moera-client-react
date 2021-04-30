import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import { Avatar, Loading } from "ui/control";
import "./AvatarSelector.css";

const AvatarSelector = ({loaded, loading, avatars, active, rootPage, onSelect, onNew}) => (
    <div className="avatar-selector">
        {loaded ?
            <>
                <div className="item">
                    <div className="create" onClick={onNew}>
                        <FontAwesomeIcon icon="plus"/><br/>New
                    </div>
                </div>
                {avatars.map(avatar =>
                    <div key={avatar.id} className={cx("item", {"active": active && avatar.id === active.id})}>
                        <div className="delete" title="Delete"><FontAwesomeIcon icon="times-circle"/></div>
                        <Avatar avatar={avatar} size={100} rootPage={rootPage} onClick={() => onSelect(avatar)}/>
                    </div>
                )}
            </>
        :
            <Loading active={loading}/>
        }
    </div>
);

export default AvatarSelector;
