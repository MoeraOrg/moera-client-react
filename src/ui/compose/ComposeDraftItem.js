import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import LinesEllipsis from 'react-lines-ellipsis';
import { formatDistanceToNow, fromUnixTime } from 'date-fns';

import { Browser } from "ui/browser";
import "./ComposeDraftItem.css";

class ComposeDraftItem extends React.PureComponent {

    onSelect = e => {
        const {draft} = this.props;

        if (e.target.closest(".delete") != null) {
            return;
        }
        this.props.onSelect(draft.id);
    };

    onDelete = e => {
        const {draft} = this.props;

        this.props.onDelete(draft.id);
        e.preventDefault();
    };

    render() {
        const {draft, current} = this.props;

        return (
            <div key={draft.id} className={cx("dropdown-item", {"current": current, "touch": Browser.isTouchScreen()})}
                 onClick={this.onSelect}>
                <div className="info">
                    <div className="content">
                        {draft.subject && <b>{draft.subject} </b>}
                        <LinesEllipsis text={draft.text} maxLine="3"/>
                    </div>
                    <div className="edited">
                        {formatDistanceToNow(fromUnixTime(draft.editedAt))}
                    </div>
                </div>
                <div className="delete" title="Delete draft" onClick={this.onDelete}>
                    <FontAwesomeIcon icon="trash-alt"/>
                </div>
            </div>
        );
    }

}

export default ComposeDraftItem;
