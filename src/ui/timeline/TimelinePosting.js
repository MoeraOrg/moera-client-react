import React from 'react';
import { connect } from 'react-redux';

import { goToPosting } from "state/navigation/actions";
import { isPermitted } from "state/node/selectors";
import PostingMenu from "ui/posting/PostingMenu";
import PostingPin from "ui/posting/PostingPin";
import PostingDate from "ui/posting/PostingDate";
import PostingUpdated from "ui/posting/PostingUpdated";
import PostingDeleting from "ui/posting/PostingDeleting";
import PostingOwner from "ui/posting/PostingOwner";
import PostingSubject from "ui/posting/PostingSubject";
import PostingReactions from "ui/posting/PostingReactions";
import PostingButtons from "ui/posting/PostingButtons";
import { isConnectedToHome } from "state/home/selectors";
import "ui/posting/Posting.css";

const Content = ({posting, href, onClick}) => {
    if (posting.bodyPreview.text) {
        return (
            <div className="content">
                <div dangerouslySetInnerHTML={{__html: posting.bodyPreview.text}} />
                <a href={href} onClick={onClick}>Continue Reading &rarr;</a>
            </div>
        );
    } else {
        return (
            <div className="content" dangerouslySetInnerHTML={{__html: posting.body.previewText}} />
        );
    }
};

class TimelinePosting extends React.PureComponent {

    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        this.props.goToPosting(this.props.posting.id);
        e.preventDefault();
    }

    render() {
        const {posting, deleting, isPermitted, rootLocation, connectedToHome} = this.props;

        const href = `${rootLocation}/post/${posting.id}`;
        return (
            <div className="posting" data-moment={posting.moment}>
                {deleting ?
                    <PostingDeleting/>
                :
                    <>
                        <PostingMenu posting={posting} isPermitted={isPermitted}/>
                        <PostingPin posting={posting}/>
                        <div className="owner-line">
                            <PostingOwner posting={posting}/>
                            <PostingDate posting={posting}/>
                            <PostingUpdated posting={posting}/>
                        </div>
                        <PostingSubject posting={posting} preview={true}/>
                        <Content posting={posting} href={href} onClick={this.onClick}/>
                        <PostingReactions posting={posting}/>
                        {connectedToHome && <PostingButtons posting={posting}/>}
                    </>
                }
            </div>
        );
    }

}

export default connect(
    state => ({
        rootLocation: state.node.root.location,
        connectedToHome: isConnectedToHome(state),
        isPermitted: (operation, posting) => isPermitted(operation, posting, state)
    }),
    { goToPosting }
)(TimelinePosting);
