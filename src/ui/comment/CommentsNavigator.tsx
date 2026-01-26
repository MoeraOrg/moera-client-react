import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { commentsScrollToAnchor } from "state/detailedposting/actions";
import { Icon, msArrowDownward, msArrowUpward } from "ui/material-symbols";
import "./CommentsNavigator.css";

interface Props {
    from: number;
    to: number;
    total: number;
}

export default function CommentsNavigator({from, to, total}: Props) {
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onRewindUp = () => dispatch(commentsScrollToAnchor(Number.MIN_SAFE_INTEGER + 1));

    const onRewindDown = () => dispatch(commentsScrollToAnchor(Number.MAX_SAFE_INTEGER));

    const range = from !== to ? `${from + 1}—${to + 1}` : from + 1;

    return (
        <div className="comments-navigator">
            {from > 0 &&
                <button type="button" className="rewind up" onClick={onRewindUp}>
                    <Icon icon={msArrowUpward} size={16}/>
                </button>
            }
            <div className="counter">{t("of", {part: range, total})}</div>
            {to < total - 1 &&
                <button type="button" className="rewind down" onClick={onRewindDown}>
                    <Icon icon={msArrowDownward} size={16}/>
                </button>
            }
        </div>
    );
}
