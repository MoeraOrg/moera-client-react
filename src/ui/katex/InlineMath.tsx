// Copied from react-katex

import React from 'react';

import createMathComponent from "ui/katex/create-math-component";

interface Props {
    html: string;
}

const InlineMath = ({html}: Props) => (
    <span dangerouslySetInnerHTML={{__html: html}}/>
);

export default createMathComponent(InlineMath, {displayMode: false});
