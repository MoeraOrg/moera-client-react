// Copied from react-katex

import React from 'react';
import PropTypes from 'prop-types';

import createMathComponent from "ui/katex/create-math-component";

const InlineMath = ({html}) => (
    <span dangerouslySetInnerHTML={{__html: html}}/>
);

InlineMath.propTypes = {
    html: PropTypes.string.isRequired
};

export default createMathComponent(InlineMath, {displayMode: false});
