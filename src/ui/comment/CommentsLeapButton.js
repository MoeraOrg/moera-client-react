import React from 'react';
import PropType from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class CommentsLeapButton extends React.PureComponent {

    static propTypes = {
        end: PropType.bool
    };

    onClick = () => {
        const rect = document.getElementById("comments").getBoundingClientRect();
        const y = this.props.end ? rect.top : rect.bottom;
        window.scrollBy(0, y - 50);
    }

    render() {
        const {end} = this.props;

        return (
            <button className="comments-rewind" title={end ? "Go to the top" : "Go to the bottom"}
                    onClick={this.onClick}>
                <FontAwesomeIcon icon={end ? "arrow-up" : "arrow-down"}/>
            </button>
        )
    }

}

export default CommentsLeapButton;
