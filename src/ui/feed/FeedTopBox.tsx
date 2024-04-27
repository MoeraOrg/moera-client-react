import { ReactNode } from 'react';

import "./FeedTopBox.css";

interface Props {
    children?: ReactNode;
}

const FeedTopBox = ({children}: Props) => (
    <div className="feed-top-box">
        {children}
    </div>
);

export default FeedTopBox;
