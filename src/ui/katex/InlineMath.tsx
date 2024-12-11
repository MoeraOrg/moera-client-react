import React from 'react';

import { useMath } from "ui/katex/hook";

export interface InlineMathProps {
    math: string;
}

export default function InlineMath({math}: InlineMathProps) {
    const html = useMath(math, {displayMode: false, throwOnError: false});
    return <span dangerouslySetInnerHTML={{__html: html}}/>;
}
