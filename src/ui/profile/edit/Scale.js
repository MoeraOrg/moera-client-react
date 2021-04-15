import React from 'react';
import PropType from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "./Scale.css";

class Scale extends React.PureComponent {

    static propTypes = {
        max: PropType.number,
        value: PropType.number,
        onChange: PropType.func
    }

    static defaultProps = {
        max: 1
    }

    onClick = sign => () => {
        if (this.props.onChange) {
            let value = this.props.value + sign * (this.props.max - 1) / 100;
            value = Math.max(Math.min(value, this.props.max), 1)
            if (value !== this.props.value) {
                this.props.onChange(value);
            }
        }
    }

    onScaleChange = event => {
        if (this.props.onChange) {
            this.props.onChange(event.target.value);
        }
    }

    render() {
        const {max, value} = this.props;

        return (
            <div className="scale">
                <button className="btn btn-light btn-sm" onClick={this.onClick(-1)} disabled={value === 1}>
                    <FontAwesomeIcon icon="minus"/>
                </button>
                <input type="range" className="form-control-range" min={1} max={max} step="any" value={value}
                       onChange={this.onScaleChange}/>
                <button className="btn btn-light btn-sm" onClick={this.onClick(1)} disabled={value === max}>
                    <FontAwesomeIcon icon="plus"/>
                </button>
            </div>
        );
    }

}

export default Scale;
