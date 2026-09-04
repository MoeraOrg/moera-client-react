import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { NodeSourceUri } from "util/node-source-uri";

interface Props {
    nodeSourceUri: string | null;
    title: string;
}

export default function ProfileSourceDisclaimer({nodeSourceUri, title}: Props) {
    const {t} = useTranslation();

    if (!nodeSourceUri) {
        return null;
    }

    const source = NodeSourceUri.parse(nodeSourceUri);
    const service = source.getService();
    const email = source.getParameter(NodeSourceUri.VIA_EMAIL);

    const sourceText = t("profile-mirrors.source" + (service ? "." + service : ""));
    const channelText = t("profile-mirrors.channel" + (service ? "." + service : ""));

    console.log(nodeSourceUri, source.uri)
    return (
        <p>
            <b>
                <Trans i18nKey="profile-mirrors" values={{source: sourceText, title}}>
                    {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
                    <a href={source.uri}/>
                </Trans>
            </b>
            {email &&
                <>
                    {" "}
                    <Trans i18nKey="profile-mirrors-order" values={{channel: channelText, contact: email}}>
                        {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
                        <a href={`mailto:${email}`}/>
                    </Trans>
                </>
            }
        </p>
    );
}
