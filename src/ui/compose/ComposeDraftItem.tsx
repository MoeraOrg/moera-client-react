import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
// @ts-ignore
import LinesEllipsis from 'react-lines-ellipsis';
import { formatDistanceToNow, fromUnixTime } from 'date-fns';

import { ExtDraftInfo } from "state/compose/state";
import "./ComposeDraftItem.css";

interface Props {
    draft: ExtDraftInfo;
    current: boolean;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
}

class ComposeDraftItem extends React.PureComponent<Props> {

    onSelect = (e: React.MouseEvent) => {
        const {draft} = this.props;

        if ((e.target as HTMLDivElement).closest(".delete") != null) {
            return;
        }
        this.props.onSelect(draft.id);
    };

    onDelete = (e: React.MouseEvent) => {
        const {draft} = this.props;

        this.props.onDelete(draft.id);
        e.preventDefault();
    };

    render() {
        const {draft, current} = this.props;

        return (
            <div key={draft.id} className={cx("dropdown-item", {"current": current})}
                 onClick={this.onSelect}>
                <div className="draft-info">
                    <div className="content">
                        {draft.subject && <b>{draft.subject} </b>}
                        <LinesEllipsis text={draft.text} maxLine="3"/>
                    </div>
                    <div className="edited">
                        {formatDistanceToNow(fromUnixTime(draft.editedAt ?? draft.createdAt))}
                    </div>
                </div>
                <div className="draft-delete" title="Delete draft" onClick={this.onDelete}>
                    <FontAwesomeIcon icon="trash-alt"/>
                </div>
            </div>
        );
    }

}

export default ComposeDraftItem;
