const { roles } = require("../Middleware/auth");

const endPoint = {
    profile: [roles.Admin, roles.User],
    signup: [roles.Admin, roles.User],
    uploadPIC: [roles.Admin, roles.User],
    coverPic: [roles.Admin, roles.User],
    alluser: [roles.Admin],
};

module.exports = {
    endPoint,
};