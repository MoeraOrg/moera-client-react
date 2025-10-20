import React, { useEffect } from 'react';
import { differenceInSeconds, isFuture } from 'date-fns';

export function useWaitTill(time: Date): string {
    const [info, setInfo] = React.useState<string>("");

    useEffect(() => {
        if (isFuture(time)) {
            const interval = setInterval(() => {
                const wait = differenceInSeconds(time, Date.now());
                if (wait > 0) {
                    const mins = Math.trunc(wait / 60).toString().padStart(2, "0");
                    const secs = (wait % 60).toString().padStart(2, "0");
                    setInfo(`(${mins}:${secs})`);
                } else {
                    setInfo("");
                    clearInterval(interval);
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [time]);

    return info;
}
