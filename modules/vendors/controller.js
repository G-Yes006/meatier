const express = require('express');
const jwt = require("jsonwebtoken");
const multer = require('multer');
const User = require('./models');
const userMiddleware = require('../../middleware/user');
const email = require('../../middleware/email');
const uploadMiddleware = require('../../middleware/uploadImage');

const router = express.Router();

const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

// Get All User Information. This is Only for Admin User
router.get("/info/:id", (req, res) => {
    const id = req.params.id;
    User.Auth.findById(id, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            let obj = {
                fname: data.fname,
                lname: data.lname,
                role: data.role,
                username: data.username,
                email: data.email,
                countryCode: 91,
                phone: `+${data.countryCode}-${data.phone}`,
                emailVerified: data.emailVerified,
                phoneVerified: data.phoneVerified
            };
            res.send(obj);
        }
    });
});


router.post("/login", (req, res) => {
    let obj = req.body;
    // obj.password = jwt.sign(obj.password, 'ssshhhhh');
    obj.status = true;
    User.Auth.findOne(obj, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            if (data == null) {
                res.status(401).json({ error: "Username & password is not Valid" });
            } else {
                console.log("Success");
                let obj = { username: data.username, email: data.email, role: data.role };
                let token = jwt.sign(obj, process.env.SECRET_KEY, {
                    expiresIn: 1800 // expires in 30 minuit
                });

                res.json({
                    id: data._id,
                    username: data.username,
                    fname: data.fname,
                    role: data.role,
                    token: token
                });
            }
        }
    });
});



router.post("/signup", userMiddleware.checkExestingUser, (req, res) => {
    let model = new User.Auth(req.body);
    // model.password = jwt.sign(obj.password, 'shhhhh');
    model.save((err, user) => {
        if (err) {
            res.send(err.message);
        } else {
            const securityCode = userMiddleware.generateSecurityCode();
            User.Auth.findOneAndUpdate({ _id: user._id }, { securityCode: securityCode }, (err, data) => {
                if (err) {
                    res.send(err);
                } else {
                    if ('email' in user) {
                        console.log('Email');
                        res.json(securityCode);
                        // email(userId, password, to, 'Security Code', securityCode, securityCode).then(data => {
                        //     res.send(data);
                        // }, err => {
                        //     console.log(err);
                        //     res.send(err);
                        // });
                    } else if ('phone' in user) {
                        console.log('Phone');
                        res.json(securityCode);
                    } else {
                        res.json(securityCode);
                    }
                }
            })
        }
    });
});

router.put("/addUsername/:id", userMiddleware.checkExestingUsername, (req, res) => {
    let id = req.params.id;
    User.Auth.findOneAndUpdate({ _id: id }, { username: req.body.username }, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.json(data);
        }
    });
});

router.put("/addUserInfo/:id", (req, res) => {
    let id = req.params.id;
    User.Auth.findOneAndUpdate({ _id: id }, req.body, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.json(data);
        }
    });
});

router.post("/forgotPassword", (req, res) => {
    User.Auth.findOne(req.body, (err, user) => {
        if (err) {
            res.send(err);
        } else {
            if (!user) {
                res.status(404).send("No User Found");
            } else {
                const url = 'localhost:3000/user/forgotpassword?id=' + user.id;
                const resetUrlText = "Reset url is <a href='" + url + "'>" + url + "</a>";
                const resetUrlTemplate = "Reset url is <a href='" + url + "'>" + url + "</a>";

                email(user.email, 'Reset Url', resetUrlTemplate, resetUrlText).then(data => {
                    res.send(data);
                }, err => {
                    res.send(err);
                });
            }
        }
    })
});

//Change Password
router.post('/changePassword', (req, res) => {
    const userId = req.body.id;
    const password = req.body.password;

    User.Auth.findById(userId, (err, user) => {
        if (err) {
            res.json({
                error: err,
                message: "Id is not correct"
            });
        } else {
            if (user == null) {
                res.status(404).send("User id not found");
            } else {
                User.Auth.findOneAndUpdate({ _id: userId }, { password: password }, (err, data) => {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send("Password updated succesfully");
                    }
                });
            }
        }
    });
});


// Active Previous Deactivated User. & Deactivate Active User.
router.put("/activeDeactivateUser/:id", (req, res) => {
    let id = req.params.id;
    let status = req.body;
    User.Auth.findById(id, (err, user) => {
        if (err) {
            res.json({
                error: err,
                message: "Id is not correct"
            });
        } else {
            if (user == null) {
                res.status(404).send("User id not found");
            } else {
                User.Auth.findOneAndUpdate({ _id: id }, status, (err, data) => {
                    if (err) {
                        res.send(err);
                    } else {
                        if (req.body.status == false) {
                            res.status(200).json({
                                status: 'succes',
                                data: "User is Deactivated",
                            });
                        }
                        res.status(200).json({
                            status: 'succes',
                            data: "User is Activated",
                        });
                    }
                });
            }
        }
    });
});


/**
 * Varify Phone
 *  */
router.get("/generateVarificationCode/:type/:id", userMiddleware.getUserInfo, (req, res) => {
    const type = req.params.type;      // For Mail & Send Message
    const id = req.params.id;
    const securityCode = userMiddleware.generateSecurityCode();
    const securityCodeText = "Varification Code is " + securityCode;
    const securityCodeTemplate = "<h1>Email varification code is " + securityCode + "</h1>";
    User.Auth.findOneAndUpdate({ _id: id }, { securityCode: securityCode }, (err, user) => {
        if (err) {
            res.send(err);
        } else {
            // For Mail & Send Message
            if (type == 'email') {
                email(user.email, 'Security Code', securityCodeTemplate, securityCodeText).then(data => {
                    res.send(data);
                }, err => {
                    console.log(err);
                    res.send(err);
                });
            } else {
                res.send(securityCode);
            }
        }
    })
});

router.put("/varification/:type/:id", (req, res) => {
    const obj = {};
    const id = req.params.id;
    const type = req.params.type;
    const securityCode = req.body.securityCode;

    if (type == "email") {
        obj.emailVerified = 1;
    } else {
        obj.phoneVerified = 1;
    }

    User.Auth.findById(id, { securityCode: 1 }, (err, code) => {
        if (err) {
            res.send(err);
        } else {
            if (code.securityCode == securityCode) {
                User.Auth.findByIdAndUpdate(id, obj, (err, data) => {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send(`Users ${type} has varified`);
                    }
                });
            } else {
                res.send(`Users ${type} has not varified. Because you have entered wrong Security Code`);
            }
        }
    });
});

/**
 * Insert User Details
 *  */
// Insert Logged in User Details
router.post("/insertUserDetails", (req, res) => {
    let obj = req.body;
    let model = new User.Details(obj);
    model.save((err, user) => {
        if (err) {
            res.send(err);
        } else {
            res.send('User Data Inserted');
        }
    })
});

// Get Logged in User Details
router.get("/userDetails/:id", (req, res) => {
    let id = req.params.id;
    User.Details.findOne({ userId: id }, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
});


/**
 * Insert User Group
 *  */
// Insert Logged in User Group
router.post("/addUserGroup", (req, res) => {
    let obj = req.body;
    let model = new User.Details(obj);
    model.save((err, user) => {
        if (err) {
            res.send(err);
        } else {
            res.send('User Data Inserted');
        }
    })
});

router.post('/uploadProfilePics/:id', upload.single("profile"), uploadMiddleware.uploadImage, (req, res) => {
    let obj = {
        userId: req.params.id,
        profilePics: req.file.originalname
    }
    let model = new user.ProfilePics(obj);
    model.save((err, profile) => {
        if (err) {
            res.send(err);
        } else {
            res.json('Profile picture uploaded successfully');
        }
    });
});

module.exports = router;