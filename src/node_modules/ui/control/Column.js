import React from 'react';

export const Column = ({className, children}) => (
    className ? <div className={className}>{children}</div> : children
);
