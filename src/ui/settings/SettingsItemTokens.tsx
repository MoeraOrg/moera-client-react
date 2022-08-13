import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format, fromUnixTime } from 'date-fns';

import { TokenInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { settingsTokensDelete, settingsTokensDialogOpen } from "state/settings/actions";
import { confirmBox } from "state/confirmbox/actions";
import { Button, Loading } from "ui/control";
import TokenDialog from "ui/settings/TokenDialog";
import NewTokenDialog from "ui/settings/NewTokenDialog";
import "./SettingsItemTokens.css";
import { getHomeToken } from "state/home/selectors";

type Props = ConnectedProps<typeof connector>;

function SettingsItemTokens({loading, loaded, tokens, homeToken, settingsTokensDialogOpen, settingsTokensDelete,
                             confirmBox}: Props) {
    const [expanded, setExpanded] = useState<string | null>(null);

    const onClick = (id: string) => () => setExpanded(expanded !== id ? id : null);

    const onEdit = (token: TokenInfo) => () => settingsTokensDialogOpen(token);

    const onDelete = (token: TokenInfo) => () => {
        confirmBox(`Do you really want to delete the token "${getName(token)}"?`, "Delete", "Cancel",
            settingsTokensDelete(token.id), null, "danger");
    }

    return (
        <>
            <Loading active={loading}/>
            {loaded &&
                <Button variant="primary" onClick={() => settingsTokensDialogOpen(null)}>Create a Token</Button>
            }
            <br/>
            <br/>
            {tokens.map(t =>
                <div className="token-info" key={t.id}>
                    <FontAwesomeIcon icon="key" className="icon"/>
                    <Button variant="link" onClick={onClick(t.id)}>{getName(t)}</Button>
                    {!isHomeToken(t, homeToken) ?
                        <>
                            <button className="token-button" title="Rename" onClick={onEdit(t)}>
                                <FontAwesomeIcon icon="pen"/>
                            </button>
                            <button className="token-button red" title="Delete" onClick={onDelete(t)}>
                                <FontAwesomeIcon icon="trash-can"/>
                            </button>
                        </>
                    :
                        <span className="current">Current</span>
                    }
                    {expanded === t.id &&
                        <div className="details">
                            {t.pluginName != null &&
                                <span className="item">
                                    <em>Used by plugin:</em>{t.pluginName}
                                </span>
                            }
                            <span className="item">
                                <em>Created at:</em>{format(fromUnixTime(t.createdAt), "yyyy-MM-dd HH:mm:ss")}
                            </span>
                            {t.deadline != null &&
                                <span className="item">
                                    <em>Expires:</em>{format(fromUnixTime(t.deadline), "yyyy-MM-dd HH:mm:ss")}
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
    { settingsTokensDialogOpen, settingsTokensDelete, confirmBox }
);

export default connector(SettingsItemTokens);
