import { RefObject, useCallback, useEffect, useRef } from 'react';

export function useIntersect(callback: (intersecting: boolean) => void,
                             options?: IntersectionObserverInit): RefObject<any> {
    const element = useRef<any>(null);

    const onIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => callback(entry.isIntersecting));
    }, [callback]);

    useEffect(() => {
        if (element.current != null) {
            const observer = new IntersectionObserver(onIntersect, options);
            observer.observe(element.current);

            return () => observer.disconnect();
        }
    }, [options, onIntersect]);

    return element;
}
