import React from "react";
import "./OwnerName.css";

const OwnerName = ({name, generation}) => {
    if (name) {
        return (
            <span className="owner-name">{name}<span className="generation">{generation}</span></span>
        );
    } else {
        return null;
    }
};

export default OwnerName;
