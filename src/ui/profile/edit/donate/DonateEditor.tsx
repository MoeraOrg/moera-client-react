import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as immutable from 'object-path-immutable';

import { FundraiserInfo } from "api/node/api-types";
import FundraiserDialog from "ui/profile/edit/donate/FundraiserDialog";
import "./DonateEditor.css";

interface Props {
    value: FundraiserInfo[];
    setValue: (value: FundraiserInfo[]) => void;
}

export default function DonateEditor({value, setValue}: Props) {
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [selected, setSelected] = useState<number | null>(null);

    const onClick = (index: number | null) => (e: React.MouseEvent) => {
        setSelected(index);
        setShowDialog(true);
        e.preventDefault();
    }

    const onSubmitDialog = (fundraiser: FundraiserInfo) => {
        if (selected != null) {
            setValue(immutable.set(value, [selected], fundraiser));
        } else {
            setValue([...value, fundraiser]);
        }
        setShowDialog(false);
    }

    const onCancelDialog = () => {
        setShowDialog(false);
    }

    const onDelete = () => {
        if (selected != null) {
            setValue(immutable.del(value, [selected]));
        }
        setShowDialog(false);
    }

    return (
        <div className="donate-editor">
            {value.map((fundraiser, index) =>
                <button key={index} className="fundraiser" onClick={onClick(index)}>
                    {fundraiser.title}
                    <FontAwesomeIcon className="icon" icon="pen"/>
                </button>
            )}
            <button className="new-fundraiser" onClick={onClick(null)}>
                <FontAwesomeIcon className="icon" icon="plus"/>
                Add donation
            </button>
            <FundraiserDialog show={showDialog} fundraiser={selected != null ? value[selected] : null}
                              onSubmit={onSubmitDialog} onCancel={onCancelDialog} onDelete={onDelete}/>
        </div>
    );
}
