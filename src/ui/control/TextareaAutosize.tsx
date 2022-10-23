import React, { useEffect, useRef } from 'react';
import autosize from 'autosize';

type Props = {
    innerRef?: React.RefObject<HTMLTextAreaElement>;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextareaAutosize({innerRef, ...props}: Props) {
    const ownRef = useRef<HTMLTextAreaElement>(null);
    const textarea = innerRef ?? ownRef;

    useEffect(() => {
        if (textarea.current != null) {
            const dom = textarea.current;
            autosize(dom);
            return () => {
                autosize.destroy(dom);
            }
        }
    }, [textarea]);

    useEffect(() => {
        if (textarea.current != null) {
            autosize.update(textarea.current);
        }
    }, [textarea, props.value]);

    return <textarea ref={textarea} {...props}/>
}
