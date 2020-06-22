import React from 'react';
import * as ReactDOM from 'react-dom';
import { Manager, Popper, Reference } from 'react-popper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import debounce from 'lodash.debounce';

import Jump from "ui/navigation/Jump";
import "./PostingSource.css";
import PostingSources from "ui/posting/PostingSources";

class PostingSource extends React.PureComponent {

    constructor(props, context) {
        super(props, context);

        this.state = {hover: false, popup: false};
    }

    documentClick = () => {
        this.hide();
    };

    buttonEnter = () => {
        this.setHover(true);
    };

    buttonLeave = () => {
        if (this.state.hover) {
            this.setHover(false);
        }
    };

    setHover(hover) {
        const changed = this.state.hover !== hover;
        this.setState({hover});
        if (changed) {
            this.onTimeout();
        }
    }

    onTimeout = debounce(() => {
        if (this.state.hover) {
            this.show();
        }
    }, 1500);

    show() {
        this.setState({popup: true});
        document.addEventListener("click", this.documentClick);
    }

    hide() {
        this.setState({popup: false});
        document.removeEventListener("click", this.documentClick);
    }

    render() {
        const {posting} = this.props;

        if (posting.receiverName == null) {
            return null;
        }

        return (
            <Manager>
                <Reference>
                    {({ref}) =>
                        <span className="posting-source" ref={ref}
                              onMouseEnter={this.buttonEnter} onMouseLeave={this.buttonLeave}>
                            <Jump nodeName={posting.receiverName} href={`/post/${posting.receiverPostingId}`}>
                                <FontAwesomeIcon icon="retweet"/>
                            </Jump>
                        </span>
                    }
                </Reference>
                {ReactDOM.createPortal(
                    (this.state.popup || this.state.hover) &&
                        <Popper placement="bottom-start">
                            {({ref, style, placement}) => (
                                <div ref={ref} style={style} className={cx(
                                    "popover",
                                    `bs-popover-${placement}`,
                                    "shadow",
                                    "fade",
                                    {"show": this.state.popup}
                                )}>
                                    <div className="popover-body">
                                        <PostingSources posting={posting}/>
                                    </div>
                                </div>
                            )}
                        </Popper>,
                    document.querySelector("#modal-root")
                )}
            </Manager>
        );
    }

}

export default PostingSource;
