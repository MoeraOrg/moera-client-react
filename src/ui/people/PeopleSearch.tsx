import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { peopleSetSearchPrefix } from "state/people/actions";

type Props = ConnectedProps<typeof connector>;

function PeopleSearch({peopleSetSearchPrefix}: Props) {
    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Escape") {
            (event.currentTarget as HTMLInputElement).value = "";
            peopleSetSearchPrefix("");
        }
    };

    const onChange = (event: React.ChangeEvent) =>
        peopleSetSearchPrefix((event.currentTarget as HTMLInputElement).value);

    return (
        <div className="mt-1 row">
            <div className="ms-auto col-md-3 col-6">
                <div className="input-group input-group-sm">
                    <span className="input-group-text" id="inputGroup-sizing-sm">
                        <FontAwesomeIcon icon="magnifying-glass"/>
                    </span>
                    <input type="text" className="form-control" onKeyDown={onKeyDown} onChange={onChange}/>
                </div>
            </div>
        </div>
    );
}

const connector = connect(
    null,
    { peopleSetSearchPrefix }
);

export default connector(PeopleSearch);
