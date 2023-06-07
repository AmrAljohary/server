const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

const roles = {
    User: "User",
    Admin: "Admin",
    HR: "HR",
};

const auth = (data) => {
    return async(req, res, next) => {
        const HeaderToken = req.headers["authorization"];
        if (!HeaderToken ||
            HeaderToken == undefined ||
            HeaderToken == null ||
            !HeaderToken.startsWith("Bearer")
        ) {
            res.status(403).json({ message: "IN_Valid Token" });
        } else {
            const token = HeaderToken.split(" ")[1];
            const decoded = jwt.verify(token, process.env.SECRETKEY);
            const user = await userModel.findOne({ _id: decoded.id });
            if (!user) {
                res.status(403).json({ message: "IN_Valid Token DATA" });
            } else {
                if (data.includes(user.role)) {
                    req.user = user;
                    next();
                } else {
                    res
                        .status(401)
                        .json({ message: "sorry you not authrized to be here" });
                }
            }
        }
    };
};

module.exports = {
    auth,
    roles,
};