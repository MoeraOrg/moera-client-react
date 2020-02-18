import React from 'react';
import PropType from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "./Twemoji.css";

const CACHED = new Set(["23f3", "2694", "2708", "1f379", "1f37f", "1f381", "1f3a9", "1f44d", "1f44e", "1f47f",
                        "1f48e", "1f494", "1f4a1", "1f4a4", "1f4a9", "1f4af", "1f600", "1f60d", "1f61c", "1f620",
                        "1f622", "1f62b", "1f62d", "1f62e", "1f64f", "1f921", "1f926", "1f92e", "1f9f8"]);

export const Twemoji = ({code, title = ""}) => {
    const emoji = typeof(code) === "string" ? code : Number(code).toString(16);
    switch (emoji) {
        case "1f44d":
            return <FontAwesomeIcon icon="thumbs-up" color="#2078f4" title={title}/>;
        case "1f44e":
            return <FontAwesomeIcon icon="thumbs-down" color="#2078f4" title={title}/>;
        default: {
            const src = CACHED.has(emoji)
                ? `twemoji/${emoji}.svg` : `https://twemoji.maxcdn.com/v/latest/svg/${emoji}.svg`;
            return <img className="emoji" src={src} alt={title} title={title}/>
        }
    }
};

Twemoji.propTypes = {
    code: PropType.any
};
