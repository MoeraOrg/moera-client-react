import React from 'react';

interface Props {
    className?: string;
    children: any;
}

export const Wrapper = ({className, children}: Props) => (
    className ? <div className={className}>{children}</div> : children
);
