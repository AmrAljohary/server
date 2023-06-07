const HandelValidation = require("../Middleware/HandelValidation");
const { signUPValidation } = require("../user/user.validation");
const { auth } = require("../Middleware/auth");
const {
    signup,
    confirmEmail,
    signin,
    resendconfirmation,
    loginWithGmail,
    searchuser,
} = require("../user/controller/user.controller");
const { endPoint } = require("../user/endPoint");

const router = require("express").Router();

router.post("/user/signup", HandelValidation(signUPValidation), signup);
router.get(`/user/confirm/:token`, confirmEmail);
router.get(`/user/email/resend/:token`, resendconfirmation);
router.post(`/user/signin`, signin);
router.post(`/loginWithGmail`, loginWithGmail);

router.get(`/user/search/:searchkey`, searchuser);

module.exports = router;