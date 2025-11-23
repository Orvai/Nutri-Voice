const parseCookieHeader = (cookieHeader = '') => {
    const cookies = {};
    if (!cookieHeader) return cookies;

    for (const pair of cookieHeader.split(';')) {
        const index = pair.indexOf('=');
        if (index === -1) continue;

        const name = pair.slice(0, index).trim();
        if (!name) continue;

        const rawValue = pair.slice(index + 1).trim();
        try {
            cookies[name] = decodeURIComponent(rawValue);
        } catch {
            cookies[name] = rawValue;
        }
    }

    return cookies;
};

const attachCookies = (req, _res, next) => {
    if (!req.cookies) {
        req.cookies = parseCookieHeader(req.headers?.cookie || '');
    }
    next();
};

module.exports = { attachCookies };