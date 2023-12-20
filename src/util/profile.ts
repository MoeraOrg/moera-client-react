import { MutableRefObject, ProfilerOnRenderCallback, useRef } from 'react';
import deepEqual from 'react-fast-compare';

/*
 * Usage:
 *
 * const onRender = traceRender(
 *     useTracedValue('aValue', aValue),
 * );
 *
 * <Profiler id="some_name" onRender={onRender}>
 * </Profiler>
 */

interface TracedValue<T> {
    name: string;
    value: T;
    prevValue: MutableRefObject<T | undefined>;
}

export function useTracedValue<T>(name: string, value: T): TracedValue<T> {
    const prevValue = useRef<T | undefined>(undefined);
    return {name, value, prevValue};
}

function traceValue<T>(name: string, value: T, prevValue: MutableRefObject<T | null>): void {
    if (prevValue.current !== undefined) {
        if (!Object.is(value, prevValue.current)) {
            if (deepEqual(value, prevValue.current)) {
                console.log(`${name} reference changed`, value);
            } else {
                console.log(`${name} changed`, value, prevValue.current);
            }
        }
    } else if (value !== undefined) {
        console.log(`${name} initialized`, value);
    }
    prevValue.current = value;
}

export function traceRender(...tracedValues: TracedValue<any>[]): ProfilerOnRenderCallback {
    return (
        id: string, phase: "mount" | "update", actualDuration: number, baseDuration: number, startTime: number,
        commitTime: number
    ) => {
        console.log(id, phase, actualDuration, baseDuration, startTime, commitTime);
        tracedValues.forEach(tv => traceValue(tv.name, tv.value, tv.prevValue));
    }
}
