import React from 'react';

interface Props {
    element?: string;
    className?: string;
    children: any;
}

export const Wrapper = ({element = "div", className, children}: Props) =>
    className ? React.createElement(element, {className}, children) : children;
