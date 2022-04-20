import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "./PostingVisibility.css";

interface Props {
    principal: string | null | undefined;
}

export default function PostingVisibility({principal}: Props) {
    let icon: IconProp = "globe";
    let title: string = "Public";
    switch (principal) {
        case "signed":
            icon = "shield-halved";
            title = "Signed";
            break;

        case "private":
        case "owner":
        case "admin":
            icon = "lock";
            title = "Only me";
            break;
    }
    return (
        <span className="visibility">
            &middot;
            <span className="principal" title={title}><FontAwesomeIcon icon={icon}/></span>
        </span>
    );
}
