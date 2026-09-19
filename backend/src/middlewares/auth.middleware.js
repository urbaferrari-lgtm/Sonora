const jwt = require("jsonwebtoken");

function getTokenFromRequest(req) {
    const cookieToken = req.cookies?.token;
    if (cookieToken) return cookieToken;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.split(" ")[1];
    }

    return null;
}

async function authArtist(req, res, next) {
    const token = getTokenFromRequest(req);
    if (!token) {
        return res.status(401).json({ message: "Artist token required. Register/login with role 'artist' and send Authorization: Bearer <token>" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "artist") {
            return res.status(403).json({ message: "You don't have access to create album" });
        }

        req.user = { ...decoded, _id: decoded.id };
        return next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: "Invalid or expired artist token" });
    }
}

async function authUser(req, res, next) {
    const token = getTokenFromRequest(req);
    if (!token) {
        return res.status(401).json({ message: "Login token required. Send Authorization: Bearer <token>" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "user" && decoded.role !== "artist") {
            return res.status(403).json({ message: "You don't have access" });
        }

        req.user = { ...decoded, _id: decoded.id };
        return next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: "Invalid or expired login token" });
    }
}

module.exports = { authArtist, authUser };