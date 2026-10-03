import React from 'react';
import { useTranslation } from 'react-i18next';

import { PostingInfo } from "api";
import NodeName from "ui/nodename/NodeName";
import PostingVerifyButton from "ui/posting/PostingVerifyButton";
import "./PostingOwner.css";

interface Props {
    posting: PostingInfo;
}

export default function PostingOwner({posting}: Props) {
    const {t} = useTranslation();

    const source = posting.receiverName != null
        && posting.sources != null
        && posting.sources.length > 0
        && posting.sources.every(s => s.nodeName !== posting.receiverName) ? posting.sources[0] : null;
    const sourceCount = posting.sources?.length ?? 0;

    return (
        <span className="owner">
            {source != null &&
                <>
                    <NodeName name={source.nodeName} fullName={source.fullName} sourceUri={source.nodeSourceUri}
                              avatar={source.avatar}/>
                    {sourceCount > 1 ? ", …" : ""}
                    <span className="shared">{t("user-shared", {count: sourceCount})}</span>
                </>
            }
            <NodeName name={posting.ownerName} fullName={posting.ownerFullName} sourceUri={posting.ownerSourceUri}
                      avatar={posting.ownerAvatar}/>
            {" "}<PostingVerifyButton id={posting.id}/>
            {posting.receiverName && posting.receiverName !== posting.ownerName &&
                <>
                    <span className="arrow">{" "}&#x25b8;{" "}</span>
                    <NodeName name={posting.receiverName} fullName={posting.receiverFullName}
                              sourceUri={posting.receiverSourceUri} avatar={posting.receiverAvatar}/>
                </>
            }
        </span>
    );
}
