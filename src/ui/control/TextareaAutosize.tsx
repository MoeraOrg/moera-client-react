import React, { ForwardedRef, forwardRef, useEffect, useRef } from 'react';
import autosize from 'autosize';
import composeRefs from '@seznam/compose-react-refs';

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

function TextareaAutosizeImpl(props: Props, ref: ForwardedRef<HTMLTextAreaElement>) {
    const ownRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const dom = ownRef.current;
        if (dom != null) {
            autosize(dom);
            return () => {
                autosize.destroy(dom);
            }
        }
    }, []);

    useEffect(() => {
        if (ownRef.current != null) {
            autosize.update(ownRef.current);
        }
    }, [props.value]);

    return <textarea ref={composeRefs(ownRef, ref)} {...props}/>
}

const TextareaAutosize = forwardRef(TextareaAutosizeImpl);

export { TextareaAutosize };
