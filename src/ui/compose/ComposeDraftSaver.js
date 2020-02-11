import React from 'react';
import { connect } from 'react-redux';
import { connect as connectFormik } from 'formik';
import debounce from 'lodash.debounce';
import deepEqual from 'react-fast-compare';

import composePageLogic from "ui/compose/compose-page-logic";

function postingText(props) {
    return composePageLogic.mapValuesToPostingText(props.formik.values, props);
}

function isEmpty(postingText) {
    return composePageLogic.isPostingTextEmpty(postingText);
}

class ComposeDraftSaver extends React.PureComponent {

    onSave = debounce(() => {
        if (this.props.formik.status === "submitted") {
            return;
        }
        const thisText = postingText(this.props);
        if (isEmpty(thisText)) {
            return;
        }
        console.log(postingText(this.props));
    }, 2000);

    componentWillUnmount() {
        this.onSave.cancel();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {editing} = this.props;

        const prevText = postingText(prevProps);
        const thisText = postingText(this.props);
        if (!deepEqual(prevText, thisText) && (!editing || !isEmpty(prevText))) {
            this.onSave();
        }
    }

    render() {
        return null;
    }

}

export default connectFormik(ComposeDraftSaver);
