const express = require("express");
const {
    signup,
    login,
    logout,
    getSession,
} = require("../controllers/userController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/getSession", getSession);

module.exports = router;
