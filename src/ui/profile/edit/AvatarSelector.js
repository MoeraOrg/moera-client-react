import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Loading } from "ui/control";
import AvatarSelectorItem from "ui/profile/edit/AvatarSelectorItem";
import "./AvatarSelector.css";

const AvatarSelector = ({loaded, loading, avatars, active, rootPage, onSelect, onNew, onDelete}) => (
    <div className="avatar-selector">
        {loaded ?
            <>
                <div className="item">
                    <div className="create" onClick={onNew}>
                        <FontAwesomeIcon icon="plus"/><br/>New
                    </div>
                </div>
                {avatars.map(avatar =>
                    <AvatarSelectorItem key={avatar.id} avatar={avatar} active={active} rootPage={rootPage}
                                        onSelect={onSelect} onDelete={onDelete}/>
                )}
            </>
        :
            <Loading active={loading}/>
        }
    </div>
);

export default AvatarSelector;
