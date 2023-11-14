const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth");
const { login, register } = require("../controllers/users");
const { addJob, getJobs, getJob } = require("../controllers/jobs");

router.post("/register", register);
router.post("/login", login);

router.post("/positions", auth, addJob);
router.get("/positions", auth, getJobs);
router.get("/positions/:id", auth, getJob);

module.exports = router;
