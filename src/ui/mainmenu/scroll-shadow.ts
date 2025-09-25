import { RefObject, useCallback, useState } from "react";
import { useIntersect } from "ui/hook";

interface ScrollShadow {
    shadow: boolean;
    sentinel: RefObject<any>;
}

export function useScrollShadow(): ScrollShadow {
    const [shadow, setShadow] = useState<boolean>(false);

    const onIntersect = useCallback(
        (intersecting: boolean) => setShadow(!intersecting),
        [setShadow]
    );

    const sentinel = useIntersect(onIntersect);

    return {shadow, sentinel};
}
