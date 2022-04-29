import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "./Principal.css";

interface Props {
    value: string | null | undefined;
}

export function Principal({value}: Props) {
    let icon: IconProp = "globe";
    let title: string = "Public";
    switch (value) {
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
        <span className="principal" title={title}><FontAwesomeIcon icon={icon}/></span>
    );
}
