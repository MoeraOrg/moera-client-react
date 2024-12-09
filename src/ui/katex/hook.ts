import { useMemo } from 'react';
import KaTeX from 'katex';

export const useMath = (math: string): string => (
    useMemo(() => KaTeX.renderToString(math, {throwOnError: false}), [math])
);
