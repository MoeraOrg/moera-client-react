import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { PrincipalValue } from "api/node/api-types";
import { getPrincipalDisplay } from "ui/control/principal-display";
import "./Principal.css";

interface Props {
    value: PrincipalValue | null | undefined;
    long?: boolean | null;
}

export function Principal({value, long}: Props) {
    const {icon, title} = getPrincipalDisplay(value);
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
