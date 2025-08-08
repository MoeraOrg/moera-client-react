import React from 'react';
import { useDispatch } from 'react-redux';

import { peopleSetSearchPrefix } from "state/people/actions";
import { Icon, msSearch } from "ui/material-symbols";

export default function PeopleSearch() {
    const dispatch = useDispatch();

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Escape" || event.key === "Esc") {
            (event.currentTarget as HTMLInputElement).value = "";
            dispatch(peopleSetSearchPrefix(""));
        }
    };

    const onChange = (event: React.ChangeEvent) =>
        dispatch(peopleSetSearchPrefix((event.currentTarget as HTMLInputElement).value));

    return (
        <div className="search">
            <div className="input-group input-group-sm">
                <span className="input-group-text" id="inputGroup-sizing-sm">
                    <Icon icon={msSearch} size={16}/>
                </span>
                <input type="text" className="form-control" onKeyDown={onKeyDown} onChange={onChange}/>
            </div>
        </div>
    );
}
