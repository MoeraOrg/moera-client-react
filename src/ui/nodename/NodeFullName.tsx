import { NameDisplayMode } from "ui/types";
import { formatFullName } from "util/names";

interface Props {
    nodeName?: string | null;
    fullName?: string | null;
    mode?: NameDisplayMode;
}

const NodeFullName = ({nodeName, fullName, mode = "full-name"}: Props) =>
    <>{formatFullName(nodeName, fullName, mode)}</>;

export default NodeFullName;
