// Copied from react-katex

import React from 'react';

import createMathComponent from "ui/katex/create-math-component";

interface Props {
    html: string;
}

const BlockMath = ({html}: Props) => (
    <div dangerouslySetInnerHTML={{__html: html}}/>
);

export default createMathComponent(BlockMath, {displayMode: true});
