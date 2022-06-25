import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { PrincipalValue } from "api/node/api-types";
import { getPrincipalDisplay } from "ui/control/principal-display";
import "./Principal.css";

interface Props {
    value: PrincipalValue | null | undefined;
    long?: boolean | null;
    className?: string | null;
    comment?: string | null;
    icons?: Partial<Record<PrincipalValue, IconProp>> | null;
}

export function Principal({value, long, className, comment, icons}: Props) {
    let {icon, title} = getPrincipalDisplay(value);
    if (value != null) {
        const ic = icons?.[value];
        if (ic != null) {
            icon = ic;
        }
    }
    if (comment != null) {
        title = `${title} (${comment})`;
    }
    if (long) {
        return (
            <span className={cx("principal", className)}>
                <FontAwesomeIcon icon={icon}/> <span className="caption">{title}</span>
            </span>
        );
    } else {
        return (
            <span className={cx("principal", className)} title={title}>
                <FontAwesomeIcon icon={icon}/>
            </span>
        );
    }
}
