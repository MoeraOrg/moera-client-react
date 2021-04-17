import React from 'react';
import PropType from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button } from "ui/control";

export default class Rotate extends React.PureComponent {

    static propTypes = {
        value: PropType.number,
        onChange: PropType.func
    }

    onClick = sign => () => {
        const {value, onChange} = this.props;

        if (onChange) {
            onChange((value + sign * 90) % 360);
        }
    }

    render() {
        return (
            <div className="btn-group">
                <Button variant="light" size="sm" onClick={this.onClick(-1)}>
                    <FontAwesomeIcon icon="undo-alt"/>
                </Button>
                <Button variant="light" size="sm" onClick={this.onClick(1)}>
                    <FontAwesomeIcon icon="redo-alt"/>
                </Button>
            </div>
        )
    }

}
