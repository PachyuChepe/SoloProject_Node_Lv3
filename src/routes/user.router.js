// routes/user.router.js

const express = require("express");
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require("../middleware/verifyToken.middleware.js");
const { validateSignup, validateLogin, validateUpdateUser } = require("../middleware/userValidation.middleware.js");
const UserController = require("../controller/user.controller.js");

const userController = new UserController();

router.post("/signup", isNotLoggedIn, validateSignup, userController.signUp);
router.post("/login", isNotLoggedIn, validateLogin, userController.login);
router.get("/user", isLoggedIn, userController.getUser);
router.put("/user", isLoggedIn, validateUpdateUser, userController.updateUser);
router.delete("/user", isLoggedIn, userController.deleteUser);
router.post("/logout", isLoggedIn, userController.logout);

module.exports = router;
