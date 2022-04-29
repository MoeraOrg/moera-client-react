import { Principal } from "ui/control";

import "./PostingVisibility.css";

interface Props {
    principal: string | null | undefined;
}

const PostingVisibility = ({principal}: Props) => (
    <span className="visibility">
        &middot;
        <Principal value={principal}/>
    </span>
);

export default PostingVisibility;
