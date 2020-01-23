import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames';

import "./ErrorPane.css";

class ErrorPane extends React.PureComponent {

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.visible && (this.props.message !== prevProps.message || !prevProps.visible)) {
            console.error(this.props.messageVerbose);
        }
    }

    render() {
        const {message, visible} = this.props;
        return (
            <div className={
                cx(
                    "alert",
                    "alert-danger",
                    "error-pane", {
                        "error-pane-visible": visible,
                        "error-pane-hidden": !visible
                    }
                )
            }>
                {message}
            </div>
        );
    }
}

ErrorPane.propTypes = {
    message: PropType.string,
    messageVerbose: PropType.string,
    visible: PropType.bool
};

export default connect(
    state => state.error
)(ErrorPane);
