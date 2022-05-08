import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "./Principal.css";

interface Props {
    value: string | null | undefined;
    long?: boolean | null;
}

export function Principal({value, long}: Props) {
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
    if (long) {
        return (
            <span className="principal">
                <FontAwesomeIcon icon={icon}/> <span className="caption">{title}</span>
            </span>
        );
    } else {
        return <span className="principal" title={title}><FontAwesomeIcon icon={icon}/></span>;
    }
}
