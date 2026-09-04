import { NameDisplayMode } from "ui/types";
import NodeSourceIcon from "ui/nodename/NodeSourceIcon";
import { formatFullName } from "util/names";

interface Props {
    nodeName?: string | null;
    fullName?: string | null;
    sourceUri?: string | null;
    mode?: NameDisplayMode;
}

const NodeFullName = ({nodeName, fullName, sourceUri, mode = "full-name"}: Props) =>
    <><NodeSourceIcon sourceUri={sourceUri}/>{formatFullName(nodeName, fullName, mode)}</>;

export default NodeFullName;
