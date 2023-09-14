import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { PrincipalValue } from "api";
import { ClientState } from "state/state";
import { getNodeFriendGroups } from "state/node/selectors";
import { getPrincipalDisplay } from "ui/control/principal-display";
import "./Principal.css";

type Props = {
    value: PrincipalValue | null | undefined;
    defaultValue?: PrincipalValue | null;
    long?: boolean | null;
    className?: string | null;
    comment?: string | null;
    icons?: Partial<Record<PrincipalValue, IconProp>> | null;
    titles?: Partial<Record<PrincipalValue, string>> | null;
} & ConnectedProps<typeof connector>;

function PrincipalImpl({value, defaultValue, long, className, comment, icons, titles, friendGroups}: Props) {
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

const connector = connect(
    (state: ClientState) => ({
        friendGroups: getNodeFriendGroups(state)
    })
);

export const Principal = connector(PrincipalImpl);
