const userModel = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");
const { pagination } = require("../../Helper/Service/pagination");
const { search } = require("../../Helper/Service/search");

const signup = async(req, res) => {
    try {
        const { userName, email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (user) {
            res.status(400).json({ message: "email exist" });
        } else {
            const newUser = new userModel({ userName, email, password });
            const savedUser = await newUser.save();
            const token = jwt.sign({ id: savedUser._id, email: savedUser.email },
                process.env.SECRETKEY, { expiresIn: 60 * 60 * 24 }
            );
            const refreshtoken = jwt.sign({ id: savedUser._id, email: savedUser.email },
                process.env.SECRETKEY
            );
            const message = `<a href="${req.protocol}://${req.headers.host}/user/confirm/${token}">confirm</a> <br>
      <a href="${req.protocol}://${req.headers.host}/user/email/resend/${refreshtoken}">re-confirm your email</a>`;
            await sendEmail(email, message);
            res.status(201).json({ message: "Done", savedUser, status: 201, token });
        }
    } catch (error) {
        res.status(500).json({ message: "catch err ", error });
    }
};

const resendconfirmation = async(req, res, next) => {
    const { token } = req.params;

    if (!token || token == undefined || token == null) {
        res.status(400).json({ message: "token err" });
    } else {
        const decoded = jwt.verify(token, process.env.SECRETKEY);
        const user = await userModel.findOne({ _id: decoded.id, confirmed: false });
        if (user) {
            const token = jwt.sign({ id: user._id, email: user.email },
                process.env.SECRETKEY, {
                    expiresIn: 60,
                }
            );
            const refreshToken = jwt.sign({ id: user._id, email: user.email },
                process.env.SECRETKEY
            );

            const message = `<a href="${req.protocol}://${req.headers.host}/user/confirm/${token}">click me </a> <br>
          <a href="${req.protocol}://${req.headers.host}/user/email/resend/${refreshToken}">re-send activation  link </a>`;
            await sendEmail(user.email, message);
            //resendEmail
            res.status(200).json({ message: "Done", status: 200 });
        } else {
            res.status(400).json({ message: "you already confirm your email" });
        }
    }
};

const confirmEmail = async(req, res) => {
    try {
        const { token } = req.params;
        if (!token || token == undefined || token == null) {
            res.status(400).json({ message: "token err" });
        } else {
            const decoded = jwt.verify(token, process.env.SECRETKEY);
            const user = await userModel.findOneAndUpdate({ _id: decoded.id, confirmed: false }, { confirmed: true }, { new: true });
            if (user) {
                res.status(200).json({ message: "confimed pleas login" });
            } else {
                res.status(400).json({ message: "in-valid link" });
            }
        }
    } catch (error) {
        res.status(500).json({ message: "catch err ", error });
    }
};

const loginWithGmail = async(req, res) => {
    const { idToken } = req.body;
    const client = new OAuth2Client(process.env.ClientID);
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.ClientID,
        });
        const payload = ticket.getPayload();
        return payload;
    }
    const payload = await verify();
    const {
        provider,
        name,
        given_name,
        family_name,
        email_verified,
        email,
        picture,
    } = payload;

    if (!email_verified) {
        return res.json({ message: "In-valid google account" });
    }
    const user = await userModel.findOne({ email });
    if (user) {
        const token = jwt.sign({ id: user._id, isLoggedIn: true, email: payload.email },
            "SocialLoginProjectRoute"
        );
        console.log(payload);
        return res.json({ message: "Done", token, socialType: "login" });
    }

    // signup
    const newUser = await userModel.create({
        userName: name,
        firstName: given_name,
        lastName: family_name,
        email,
        profilePic: picture,
        confirmEmail: true,
        accountType: provider,
    });
    const token = jwt.sign({ id: newUser._id, isLoggedIn: true, email: newUser.email },
        "SocialLoginProjectRoute"
    );
    console.log(newUser);
    return res.json({ message: "Done", token, socialType: "Register" });
};

const signin = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "in-valid user" });
        } else {
            if (!user.confirmed) {
                res.status(400).json({ message: "please confirm your email first" });
            } else {
                const token = jwt.sign({ id: user.id, isLoggedIn: true, email: user.email },
                    process.env.SECRETKEY, { expiresIn: 3600 }
                );
                res.status(200).json({ message: "Done", token });
            }
        }
    } catch (error) {
        res.status(500).json({ message: "catch err ", error });
    }
};

// const profile = async(req, res) => {
//     try {
//         const user = await userModel
//             .findOne({ _id: req.user.id })
//             .select("-password");
//         if (!user) {
//             res.status(400).json({ message: "in-valid user" });
//         } else {
//             const updateuser = await userModel.findByIdAndUpdate({ _id: req.user.id, accountSatus: "offline" }, { accountSatus: "online" }, { new: true });
//             res.status(200).json({ message: "Done", updateuser });
//         }
//     } catch (error) {
//         res.status(StatusCodes.BAD_REQUEST).json({ message: "catch err", error });
//     }
// };

// const uploadPIC = async(req, res) => {
//     try {
//         if (!req.files) {
//             res.status(404).json({ message: "not found" });
//         } else {
//             const imagURL = `${req.protocol}://${req.headers.host}/${req.files[0].destination}/${req.files[0].filename}`;
//             const user = await userModel.findByIdAndUpdate({ _id: req.user.id }, { profilePic: imagURL });
//             if (user) {
//                 res.status(200).json({ message: "Uploaded", imagURL });
//             } else {
//                 res
//                     .status(StatusCodes.BAD_REQUEST)
//                     .json({ message: "auth err", error });
//             }
//         }
//     } catch (error) {
//         res.status(StatusCodes.BAD_REQUEST).json({ message: "catch err", error });
//     }
// };

// const editcoverPIC = async(req, res) => {
//     try {
//         if (!req.files) {
//             res.status(404).json({ message: "not found" });
//         } else {
//             let imagesURL = [];
//             for (let i = 0; i < req.files.length; i++) {
//                 let imagURL = `${req.protocol}://${req.headers.host}/${req.files[i].destination}/${req.files[i].filename}`;
//                 imagesURL.push(imagURL);
//             }

//             const user = await userModel.findByIdAndUpdate({ _id: req.user.id }, { coverPic: imagesURL }, { new: true });
//             if (user) {
//                 res.status(200).json({ message: "Uploaded", imagesURL });
//             } else {
//                 res
//                     .status(StatusCodes.BAD_REQUEST)
//                     .json({ message: "auth err", error });
//             }
//         }
//     } catch (error) {
//         res.status(StatusCodes.BAD_REQUEST).json({ message: "catch err", error });
//     }
// };

// const alluser = async(req, res) => {
//     try {
//         let { page, size } = req.query;
//         const { skip, limit } = pagination(page, size);
//         const user = await userModel
//             .find({})
//             .select("-password")
//             .limit(limit)
//             .skip(skip);
//         if (!user) {
//             res
//                 .status(StatusCodes.SERVICE_UNAVAILABLE)
//                 .json({ message: "server error" });
//         } else {
//             res.status(StatusCodes.OK).json({ message: "Done", user });
//         }
//     } catch (error) {
//         res.status(StatusCodes.BAD_REQUEST).json({ message: "catch err", error });
//     }
// };

// const showAllPDF = async(req, res) => {
//     const invoice = await userModel.find({}).select("-password");
//     const myPath = path.join(__dirname, "../../../PDF");
//     createInvoice(invoice, myPath + "/users.pdf");

//     await sendEmail("mustapha2525.ahmed@gmail.com", "<p>users on system</p>", [{
//         filename: "users.pdf",
//         path: myPath + "/users.pdf",
//         contentType: "application/pdf",
//     }, ]);
//     res.end();
// };

const searchuser = async(req, res) => {
    const { searchKey } = req.params;
    let { page, size } = req.query;
    const { skip, limit } = pagination(page, size);
    const data = await search(userModel, skip, limit, searchKey, [
        "userName",
        "email",
        "lastName",
    ]);
    res.json({ messsaage: "Done", data });
};

module.exports = {
    signup,
    confirmEmail,
    signin,
    resendconfirmation,
    loginWithGmail,
    searchuser,
};