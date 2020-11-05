import React from 'react';

export const Wrapper = ({className, children}) => (
    className ? <div className={className}>{children}</div> : children
);
