import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { PrincipalValue } from "api";
import { getNodeFriendGroups } from "state/node/selectors";
import { getPrincipalDisplay } from "ui/control/principal-display";
import "./Principal.css";

interface Props {
    value: PrincipalValue | null | undefined;
    defaultValue?: PrincipalValue | null;
    long?: boolean | null;
    className?: string | null;
    comment?: string | null;
    icons?: Partial<Record<PrincipalValue, IconProp>> | null;
    titles?: Partial<Record<PrincipalValue, string>> | null;
}

export function Principal({value, defaultValue, long, className, comment, icons, titles}: Props) {
    const friendGroups = useSelector(getNodeFriendGroups);
    const {t} = useTranslation();

    if (defaultValue != null && value === defaultValue) {
        return null;
    }

    let {icon, title} = getPrincipalDisplay(value, friendGroups, t);
    if (value != null) {
        icon = icons?.[value] ?? icon;
        title = titles?.[value] ?? title;
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
