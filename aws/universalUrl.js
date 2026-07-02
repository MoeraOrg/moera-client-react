function handler(event) {
    var request = event.request;
    if (request.uri.startsWith("/.well-known/change-password")) {
        return {
            statusCode: 302,
            statusDescription: "Found",
            headers: {
                "location": {
                    value: "https://web.moera.org/@/~/change-password"
                }
            }
        }
    }
    var hostAndLocation = getUniversalHostAndLocation(request.uri);
    var userAgent = request.headers["user-agent"] != null ? request.headers["user-agent"].value : null;
    if (hostAndLocation != null && !isModernBrowser(userAgent)) {
        return {
            statusCode: 301,
            statusDescription: "Moved Permanently",
            headers: {
                "location": {
                    value: "https://" + hostAndLocation.host + "/moera/" + hostAndLocation.location
                        + getQueryString(request.querystring)
                }
            }
        }
    }
    if (request.uri === "/" || request.uri.startsWith("/@")) {
        request.uri = "/index.html";
    }
    return request;
}

function getUniversalHostAndLocation(uri) {
    if (!uri.startsWith("/@")) {
        return null;
    }

    var path = uri.split("/");
    if (path.length < 3 || path[2] === "" || path[2] === "~") {
        return null;
    }

    return {
        host: path[2],
        location: path.slice(3).join("/")
    };
}

function getQueryString(querystring) {
    if (querystring == null) {
        return "";
    }

    var query = [];
    for (var name in querystring) {
        if (querystring.hasOwnProperty(name)) {
            appendQueryParameter(query, name, querystring[name]);
        }
    }

    return query.length !== 0 ? "?" + query.join("&") : "";
}

function appendQueryParameter(query, name, parameter) {
    if (parameter.multiValue != null) {
        for (var i = 0; i < parameter.multiValue.length; i++) {
            appendQueryValue(query, name, parameter.multiValue[i].value);
        }
    } else {
        appendQueryValue(query, name, parameter.value);
    }
}

function appendQueryValue(query, name, value) {
    query.push(encodeURIComponent(name) + (value !== "" ? "=" + encodeURIComponent(value) : ""));
}

function isModernBrowser(userAgent) {
    if (userAgent == null || userAgent === "") {
        return false;
    }

    if (userAgent.indexOf("Firefox") >= 0) {
        return true;
    } else if (userAgent.indexOf("Opera") >= 0) {
        return false;
    } else if (userAgent.indexOf("Googlebot") >= 0) {
        return false;
    } else if (userAgent.indexOf("bingbot") >= 0) {
        return false;
    } else if (userAgent.indexOf("yandex.com/bots") >= 0) {
        return false;
    } else if (userAgent.indexOf("PetalBot") >= 0) {
        return false;
    } else if (userAgent.indexOf("SemrushBot") >= 0) {
        return false;
    } else if (userAgent.indexOf("MJ12bot") >= 0) {
        return false;
    } else if (userAgent.indexOf("Amazonbot") >= 0) {
        return false;
    } else if (userAgent.indexOf("OAI-SearchBot") >= 0) {
        return false;
    } else if (userAgent.indexOf("Applebot") >= 0) {
        return false;
    } else if (userAgent.indexOf("Chrome") >= 0) {
        if (userAgent.indexOf("YaBrowser") >= 0) {
            return true;
        } else if (userAgent.indexOf("Brave") >= 0) {
            return true;
        } else if (userAgent.indexOf("Vivaldi") >= 0) {
            return true;
        } else if (userAgent.indexOf("Edge") >= 0) {
            return true;
        } else if (userAgent.indexOf("OPR") >= 0) {
            return true;
        } else {
            return true;
        }
    } else if (userAgent.indexOf("Safari") >= 0) {
        return true;
    } else if (userAgent.indexOf("MSIE") >= 0) {
        return false;
    } else if (userAgent.indexOf("Dolphin") >= 0) {
        return true;
    }

    return false;
}
