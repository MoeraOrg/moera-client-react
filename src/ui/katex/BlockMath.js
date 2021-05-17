// Copied from react-katex

import React from 'react';
import PropTypes from 'prop-types';

import createMathComponent from "ui/katex/create-math-component";

const BlockMath = ({html}) => (
    <div dangerouslySetInnerHTML={{__html: html}}/>
);

BlockMath.propTypes = {
    html: PropTypes.string.isRequired
};

export default createMathComponent(BlockMath, {displayMode: true});
