import { RefObject, useCallback, useState } from 'react';

import { useIntersect } from "ui/hook";

interface Props {
    margin?: number;
}

interface ScrollShadow {
    shadow: boolean;
    sentinel: RefObject<any>;
}

export function useScrollShadow({margin = 0}: Props = {}): ScrollShadow {
    const [shadow, setShadow] = useState<boolean>(false);

    const onIntersect = useCallback(
        (intersecting: boolean) => setShadow(!intersecting),
        [setShadow]
    );

    const sentinel = useIntersect(onIntersect, {rootMargin: `${-margin}px 0px 0px 0px`});

    return {shadow, sentinel};
}
