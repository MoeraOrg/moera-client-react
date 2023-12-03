import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

export default function SettingsItemTokens() {
    const loading = useSelector((state: ClientState) => state.settings.tokens.loading);
    const loaded = useSelector((state: ClientState) => state.settings.tokens.loaded);
    const tokens = useSelector((state: ClientState) => state.settings.tokens.tokens);
    const homeToken = useSelector(getHomeToken);
    const showTokenDialog = useSelector((state: ClientState) => state.settings.tokens.dialog.show);
    const showNewTokenDialog = useSelector((state: ClientState) => state.settings.tokens.dialog.newToken != null);
    const dispatch = useDispatch();

    const [expanded, setExpanded] = useState<string | null>(null);
    const {t} = useTranslation();

    const onClick = (id: string) => (e: React.MouseEvent) => {
        setExpanded(expanded !== id ? id : null);
        e.preventDefault();
    }

    const onEdit = (token: TokenInfo) => (e: React.MouseEvent) => {
        dispatch(settingsTokensDialogOpen(token));
        e.preventDefault();
    }

    const onDelete = (token: TokenInfo) => (e: React.MouseEvent) => {
        dispatch(confirmBox(t("want-delete-token", {name: getName(token)}), t("delete"), t("cancel"),
            settingsTokensDelete(token.id), null, "danger"));
        e.preventDefault();
    }

    return (
        <>
            {loading && <Loading/>}
            {loaded &&
                <Button variant="primary" onClick={() => dispatch(settingsTokensDialogOpen(null))}>
                    {t("create-token")}
                </Button>
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
            {showTokenDialog && <TokenDialog/>}
            {showNewTokenDialog && <NewTokenDialog/>}
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
