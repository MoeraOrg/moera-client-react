import React from 'react';
import PropType from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ReactComponent as Twemoji23f3 } from "ui/twemoji/23f3.svg";
import { ReactComponent as Twemoji2694 } from "ui/twemoji/2694.svg";
import { ReactComponent as Twemoji2708 } from "ui/twemoji/2708.svg";
import { ReactComponent as Twemoji1f379 } from "ui/twemoji/1f379.svg";
import { ReactComponent as Twemoji1f37f } from "ui/twemoji/1f37f.svg";
import { ReactComponent as Twemoji1f381 } from "ui/twemoji/1f381.svg";
import { ReactComponent as Twemoji1f3a9 } from "ui/twemoji/1f3a9.svg";
import { ReactComponent as Twemoji1f44d } from "ui/twemoji/1f44d.svg";
import { ReactComponent as Twemoji1f44e } from "ui/twemoji/1f44e.svg";
import { ReactComponent as Twemoji1f47f } from "ui/twemoji/1f47f.svg";
import { ReactComponent as Twemoji1f48e } from "ui/twemoji/1f48e.svg";
import { ReactComponent as Twemoji1f494 } from "ui/twemoji/1f494.svg";
import { ReactComponent as Twemoji1f4a1 } from "ui/twemoji/1f4a1.svg";
import { ReactComponent as Twemoji1f4a4 } from "ui/twemoji/1f4a4.svg";
import { ReactComponent as Twemoji1f4a9 } from "ui/twemoji/1f4a9.svg";
import { ReactComponent as Twemoji1f4af } from "ui/twemoji/1f4af.svg";
import { ReactComponent as Twemoji1f525 } from "ui/twemoji/1f525.svg";
import { ReactComponent as Twemoji1f600 } from "ui/twemoji/1f600.svg";
import { ReactComponent as Twemoji1f60c } from "ui/twemoji/1f60c.svg";
import { ReactComponent as Twemoji1f60d } from "ui/twemoji/1f60d.svg";
import { ReactComponent as Twemoji1f61c } from "ui/twemoji/1f61c.svg";
import { ReactComponent as Twemoji1f620 } from "ui/twemoji/1f620.svg";
import { ReactComponent as Twemoji1f622 } from "ui/twemoji/1f622.svg";
import { ReactComponent as Twemoji1f62b } from "ui/twemoji/1f62b.svg";
import { ReactComponent as Twemoji1f62d } from "ui/twemoji/1f62d.svg";
import { ReactComponent as Twemoji1f62e } from "ui/twemoji/1f62e.svg";
import { ReactComponent as Twemoji1f64f } from "ui/twemoji/1f64f.svg";
import { ReactComponent as Twemoji1f917 } from "ui/twemoji/1f917.svg";
import { ReactComponent as Twemoji1f921 } from "ui/twemoji/1f921.svg";
import { ReactComponent as Twemoji1f926 } from "ui/twemoji/1f926.svg";
import { ReactComponent as Twemoji1f92e } from "ui/twemoji/1f92e.svg";
import { ReactComponent as Twemoji1f9f8 } from "ui/twemoji/1f9f8.svg";

import "./Twemoji.css";

const CACHED = new Map([
    ["23f3", Twemoji23f3],
    ["2694", Twemoji2694],
    ["2708", Twemoji2708],
    ["1f379", Twemoji1f379],
    ["1f37f", Twemoji1f37f],
    ["1f381", Twemoji1f381],
    ["1f3a9", Twemoji1f3a9],
    ["1f44d", Twemoji1f44d],
    ["1f44e", Twemoji1f44e],
    ["1f47f", Twemoji1f47f],
    ["1f48e", Twemoji1f48e],
    ["1f494", Twemoji1f494],
    ["1f4a1", Twemoji1f4a1],
    ["1f4a4", Twemoji1f4a4],
    ["1f4a9", Twemoji1f4a9],
    ["1f4af", Twemoji1f4af],
    ["1f525", Twemoji1f525],
    ["1f600", Twemoji1f600],
    ["1f60c", Twemoji1f60c],
    ["1f60d", Twemoji1f60d],
    ["1f61c", Twemoji1f61c],
    ["1f620", Twemoji1f620],
    ["1f622", Twemoji1f622],
    ["1f62b", Twemoji1f62b],
    ["1f62d", Twemoji1f62d],
    ["1f62e", Twemoji1f62e],
    ["1f64f", Twemoji1f64f],
    ["1f917", Twemoji1f917],
    ["1f921", Twemoji1f921],
    ["1f926", Twemoji1f926],
    ["1f92e", Twemoji1f92e],
    ["1f9f8", Twemoji1f9f8]
]);

const Twemoji = ({code, title = ""}) => {
    const emoji = typeof(code) === "string" ? code : Number(code).toString(16);
    switch (emoji) {
        case "1f44d":
            return <FontAwesomeIcon icon="thumbs-up" color="#2078f4" title={title}/>;
        case "1f44e":
            return <FontAwesomeIcon icon="thumbs-down" color="#2078f4" title={title}/>;
        default:
            if (CACHED.has(emoji)) {
                return React.createElement(CACHED.get(emoji), {title, className: "twemoji"});
            } else {
                return <img className="twemoji" src={`https://twemoji.maxcdn.com/v/latest/svg/${emoji}.svg`}
                            alt={title} title={title}/>
            }
    }
};

Twemoji.propTypes = {
    code: PropType.any
};

export default Twemoji;
