import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/*
 * Emoji graphics by Twemoji https://twemoji.twitter.com/
 *
 * Copyright 2020 Twitter, Inc and other contributors
 * Code licensed under the MIT License: http://opensource.org/licenses/MIT
 * Graphics licensed under CC-BY 4.0: https://creativecommons.org/licenses/by/4.0/
 */

import { faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';

import { ReactComponent as Twemoji23f3 } from "./23f3.isvg";
import { ReactComponent as Twemoji2694 } from "./2694.isvg";
import { ReactComponent as Twemoji2708 } from "./2708.isvg";
import { ReactComponent as Twemoji1f379 } from "./1f379.isvg";
import { ReactComponent as Twemoji1f37f } from "./1f37f.isvg";
import { ReactComponent as Twemoji1f381 } from "./1f381.isvg";
import { ReactComponent as Twemoji1f3a9 } from "./1f3a9.isvg";
import { ReactComponent as Twemoji1f44d } from "./1f44d.isvg";
import { ReactComponent as Twemoji1f44e } from "./1f44e.isvg";
import { ReactComponent as Twemoji1f47f } from "./1f47f.isvg";
import { ReactComponent as Twemoji1f48e } from "./1f48e.isvg";
import { ReactComponent as Twemoji1f494 } from "./1f494.isvg";
import { ReactComponent as Twemoji1f49d } from "./1f49d.isvg";
import { ReactComponent as Twemoji1f4a1 } from "./1f4a1.isvg";
import { ReactComponent as Twemoji1f4a4 } from "./1f4a4.isvg";
import { ReactComponent as Twemoji1f4a9 } from "./1f4a9.isvg";
import { ReactComponent as Twemoji1f4af } from "./1f4af.isvg";
import { ReactComponent as Twemoji1f525 } from "./1f525.isvg";
import { ReactComponent as Twemoji1f600 } from "./1f600.isvg";
import { ReactComponent as Twemoji1f60c } from "./1f60c.isvg";
import { ReactComponent as Twemoji1f60d } from "./1f60d.isvg";
import { ReactComponent as Twemoji1f61c } from "./1f61c.isvg";
import { ReactComponent as Twemoji1f620 } from "./1f620.isvg";
import { ReactComponent as Twemoji1f622 } from "./1f622.isvg";
import { ReactComponent as Twemoji1f62b } from "./1f62b.isvg";
import { ReactComponent as Twemoji1f62d } from "./1f62d.isvg";
import { ReactComponent as Twemoji1f62e } from "./1f62e.isvg";
import { ReactComponent as Twemoji1f643 } from "./1f643.isvg";
import { ReactComponent as Twemoji1f64f } from "./1f64f.isvg";
import { ReactComponent as Twemoji1f917 } from "./1f917.isvg";
import { ReactComponent as Twemoji1f921 } from "./1f921.isvg";
import { ReactComponent as Twemoji1f923 } from "./1f923.isvg";
import { ReactComponent as Twemoji1f926 } from "./1f926.isvg";
import { ReactComponent as Twemoji1f92c } from "./1f92c.isvg";
import { ReactComponent as Twemoji1f92e } from "./1f92e.isvg";
import { ReactComponent as Twemoji1f970 } from "./1f970.isvg";
import { ReactComponent as Twemoji1f971 } from "./1f971.isvg";
import { ReactComponent as Twemoji1f9f8 } from "./1f9f8.isvg";
import { ReactComponent as Twemoji1fac2 } from "./1fac2.isvg";

import { twemojiUrl } from "util/twemoji";
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
    ["1f49d", Twemoji1f49d],
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
    ["1f643", Twemoji1f643],
    ["1f64f", Twemoji1f64f],
    ["1f917", Twemoji1f917],
    ["1f921", Twemoji1f921],
    ["1f923", Twemoji1f923],
    ["1f926", Twemoji1f926],
    ["1f92c", Twemoji1f92c],
    ["1f92e", Twemoji1f92e],
    ["1f970", Twemoji1f970],
    ["1f971", Twemoji1f971],
    ["1f9f8", Twemoji1f9f8],
    ["1fac2", Twemoji1fac2]
]);

interface Props {
    code: string | number;
    title?: string;
}

export default function Twemoji({code, title = ""}: Props) {
    let emoji = typeof(code) === "string" ? code : Number(code).toString(16);
    switch (emoji) {
        case "1f44d":
            return <FontAwesomeIcon icon={faThumbsUp} color="#2078f4" title={title}/>;
        case "1f44e":
            return <FontAwesomeIcon icon={faThumbsDown} color="#2078f4" title={title}/>;
        case "1f620":
            emoji = "1f92c";
    }
    if (CACHED.has(emoji)) {
        return React.createElement(CACHED.get(emoji)!, {title, className: "twemoji"});
    } else {
        return <img className="twemoji" src={twemojiUrl(emoji)} alt={title} title={title}/>
    }
}
