import React from 'react';
import PropType from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "./Twemoji.css";

export const Twemoji = ({code, title = ""}) => {
    const emoji = typeof(code) === "string" ? code : Number(code).toString(16);
    switch (emoji) {
        case "1f44d":
            return <FontAwesomeIcon icon="thumbs-up" color="#2078f4" title={title}/>;
        case "1f44e":
            return <FontAwesomeIcon icon="thumbs-down" color="#2078f4" title={title}/>;
        default:
            return <img className="emoji" src={`https://twemoji.maxcdn.com/v/latest/svg/${emoji}.svg`}
                        alt={title} title={title}/>
    }
};

Twemoji.propTypes = {
    code: PropType.any
};
