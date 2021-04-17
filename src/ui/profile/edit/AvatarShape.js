import React from 'react';
import PropType from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import "./AvatarShape.css";

export default class AvatarShape extends React.PureComponent {

    static propTypes = {
        value: PropType.string,
        onChange: PropType.func
    }

    onClick = shape => () => {
        const {onChange} = this.props;

        if (onChange) {
            onChange(shape);
        }
    }

    render() {
        const {value} = this.props;

        return (
            <div className="avatar-shape" title="Avatar shape">
                {["circle", "square"].map(shape =>
                    <button className={cx({"active" : value === shape})} onClick={this.onClick(shape)} key={shape}>
                        <FontAwesomeIcon icon={["far", shape]}/>
                    </button>
                )}
            </div>
        )
    }

}
