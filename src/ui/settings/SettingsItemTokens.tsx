import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format, fromUnixTime } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { TokenInfo } from "api";
import { ClientState } from "state/state";
import { getHomeToken } from "state/home/selectors";
import { settingsTokensDelete, settingsTokensDialogOpen } from "state/settings/actions";
import { confirmBox } from "state/confirmbox/actions";
import { Button, Loading } from "ui/control";
import TokenDialog from "ui/settings/TokenDialog";
import NewTokenDialog from "ui/settings/NewTokenDialog";
import "./SettingsItemTokens.css";

type Props = ConnectedProps<typeof connector>;

function SettingsItemTokens({loading, loaded, tokens, homeToken, settingsTokensDialogOpen, confirmBox}: Props) {
    const [expanded, setExpanded] = useState<string | null>(null);
    const {t} = useTranslation();

    const onClick = (id: string) => (e: React.MouseEvent) => {
        setExpanded(expanded !== id ? id : null);
        e.preventDefault();
    }

    const onEdit = (token: TokenInfo) => (e: React.MouseEvent) => {
        settingsTokensDialogOpen(token);
        e.preventDefault();
    }

    const onDelete = (token: TokenInfo) => (e: React.MouseEvent) => {
        confirmBox(t("want-delete-token", {name: getName(token)}), t("delete"), t("cancel"),
            settingsTokensDelete(token.id), null, "danger");
        e.preventDefault();
    }

    return (
        <>
            <Loading active={loading}/>
            {loaded &&
                <Button variant="primary" onClick={() => settingsTokensDialogOpen(null)}>{t("create-token")}</Button>
            }
            <br/>
            <br/>
            {tokens.map(tk =>
                <div className="token-info" key={tk.id}>
                    <FontAwesomeIcon icon="key" className="icon"/>
                    <Button variant="link" onClick={onClick(tk.id)}>{getName(tk)}</Button>
                    {!isHomeToken(tk, homeToken) ?
                        <>
                            <button className="token-button" title={t("rename")} onClick={onEdit(tk)}>
                                <FontAwesomeIcon icon="pen"/>
                            </button>
                            <button className="token-button red" title={t("delete")} onClick={onDelete(tk)}>
                                <FontAwesomeIcon icon="trash-can"/>
                            </button>
                        </>
                    :
                        <span className="current">{t("current")}</span>
                    }
                    {expanded === tk.id &&
                        <div className="details">
                            {tk.pluginName != null &&
                                <span className="item">
                                    <em>{t("used-by-addon")}</em>{tk.pluginName}
                                </span>
                            }
                            {(tk.lastUsedAt != null || tk.lastUsedBrowser != null || tk.lastUsedIp != null) &&
                                <span className="item">
                                    <em>{t("last-used")}</em>
                                    {tk.lastUsedAt != null
                                        ? format(fromUnixTime(tk.lastUsedAt), "yyyy-MM-dd HH:mm:ss")
                                        : ""}
                                    {" (" + (tk.lastUsedBrowser ?? "") + " " + (tk.lastUsedIp ?? "") + ")"}
                                </span>
                            }
                            <span className="item">
                                <em>{t("created-at")}</em>{format(fromUnixTime(tk.createdAt), "yyyy-MM-dd HH:mm:ss")}
                            </span>
                            {tk.deadline != null &&
                                <span className="item">
                                    <em>{t("expires")}</em>{format(fromUnixTime(tk.deadline), "yyyy-MM-dd HH:mm:ss")}
                                </span>
                            }
                        </div>
                    }
                </div>
            )}
            <TokenDialog/>
            <NewTokenDialog/>
        </>
    );
}

function getName(info: TokenInfo): string {
    return info.name ?? info.pluginName ?? info.token;
}

function isHomeToken(info: TokenInfo, homeToken: string | null): boolean {
    if (homeToken == null) {
        return false;
    }
    return info.token.substring(0, 4) === homeToken.substring(0, 4);
}

const connector = connect(
    (state: ClientState) => ({
        loading: state.settings.tokens.loading,
        loaded: state.settings.tokens.loaded,
        tokens: state.settings.tokens.tokens,
        homeToken: getHomeToken(state)
    }),
    { settingsTokensDialogOpen, confirmBox }
);

export default connector(SettingsItemTokens);
