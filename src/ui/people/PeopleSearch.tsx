import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { peopleSetSearchPrefix } from "state/people/actions";
import { Icon, msCancelFilled, msSearch } from "ui/material-symbols";
import "./PeopleSearch.css";

export default function PeopleSearch() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [clear, setClear] = React.useState<boolean>(false);
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const onClear = () => {
        setClear(false);
        if (inputRef.current != null) {
            inputRef.current.value = "";
        }
        dispatch(peopleSetSearchPrefix(""));
    }

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Escape" || event.key === "Esc") {
            onClear();
        }
    };

    const onChange = () => {
        const prefix = inputRef.current?.value ?? "";
        setClear(prefix.length > 0);
        dispatch(peopleSetSearchPrefix(prefix));
    }

    return (
        <div className="search">
            <div className="input-group input-group-sm">
                <span className="input-group-text"><Icon icon={msSearch} size={16}/></span>
                {clear &&
                    <button className="cancel" title={t("clear")} onClick={onClear}>
                        <Icon icon={msCancelFilled} size={20}/>
                    </button>
                }
                <input type="text" className="form-control" onKeyDown={onKeyDown} onChange={onChange} ref={inputRef}/>
            </div>
        </div>
    );
}
