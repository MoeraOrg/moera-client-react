import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format, fromUnixTime } from 'date-fns';

import { TokenInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { settingsTokensDialogOpen } from "state/settings/actions";
import { Button, Loading } from "ui/control";
import TokenDialog from "ui/settings/TokenDialog";
import NewTokenDialog from "ui/settings/NewTokenDialog";
import "./SettingsItemTokens.css";

type Props = ConnectedProps<typeof connector>;

function SettingsItemTokens({loading, loaded, tokens, settingsTokensDialogOpen}: Props) {
    const [expanded, setExpanded] = useState<string | null>(null);

    const onClick = (id: string) => () => setExpanded(expanded !== id ? id : null);

    return (
        <>
            <Loading active={loading}/>
            {tokens.map(t =>
                <div className="token-info" key={t.id}>
                    <FontAwesomeIcon icon="key" className="icon"/>
                    <Button variant="link" onClick={onClick(t.id)}>{getName(t)}</Button>
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
            <br/>
            {loaded &&
                <Button variant="primary" onClick={() => settingsTokensDialogOpen(null)}>Create a Token</Button>
            }
            <TokenDialog/>
            <NewTokenDialog/>
        </>
    );
}

function getName(info: TokenInfo): string {
    return info.name ?? info.pluginName ?? info.token;
}

const connector = connect(
    (state: ClientState) => ({
        loading: state.settings.tokens.loading,
        loaded: state.settings.tokens.loaded,
        tokens: state.settings.tokens.tokens
    }),
    { settingsTokensDialogOpen }
);

export default connector(SettingsItemTokens);
