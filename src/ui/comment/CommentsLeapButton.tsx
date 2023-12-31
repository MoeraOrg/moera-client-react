import React from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getCommentsState } from "state/detailedposting/selectors";

interface Props {
    end: boolean;
}

export default function CommentsLeapButton({end}: Props) {
    const loadedCount = useSelector((state: ClientState) => getCommentsState(state).comments.length);
    const {t} = useTranslation();

    if (loadedCount === 0) {
        return null;
    }

    const onClick = () => {
        setTimeout(() => {
            const rect = document.getElementById("comments")!.getBoundingClientRect();
            const y = end ? rect.top : rect.bottom;
            window.scrollBy(0, y - 50);
        });
    }

    return (
        <button className="comments-rewind" title={end ? t("go-top") : t("go-bottom")} onClick={onClick}>
            <FontAwesomeIcon icon={end ? faArrowUp : faArrowDown}/>
        </button>
    );
}
