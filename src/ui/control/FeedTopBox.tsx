import { ReactNode } from 'react';

import "./FeedTopBox.css";

interface Props {
    children?: ReactNode;
}

export const FeedTopBox = ({children}: Props) => (
    <div className="feed-top-box">
        {children}
    </div>
);
