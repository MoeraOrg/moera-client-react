import React from 'react';

import { useMath } from "ui/katex/hook";

export interface BlockMathProps {
    math: string;
}

export default function BlockMath({math}: BlockMathProps) {
    const html = useMath(math);
    return <div dangerouslySetInnerHTML={{__html: html}}/>;
}
