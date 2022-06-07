import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import { PrincipalValue } from "api/node/api-types";
import { getPrincipalDisplay } from "ui/control/principal-display";
import "./Principal.css";

interface Props {
    value: PrincipalValue | null | undefined;
    long?: boolean | null;
    className?: string | null;
    comment?: string | null;
}

export function Principal({value, long, className, comment}: Props) {
    const {icon, title} = getPrincipalDisplay(value);
    const caption = comment != null ? `${title} (${comment})` : title;
    if (long) {
        return (
            <span className={cx("principal", className)}>
                <FontAwesomeIcon icon={icon}/> <span className="caption">{caption}</span>
            </span>
        );
    } else {
        return (
            <span className={cx("principal", className)} title={caption}>
                <FontAwesomeIcon icon={icon}/>
            </span>
        );
    }
}
