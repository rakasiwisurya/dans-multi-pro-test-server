const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { users } = require("../models");

exports.register = async (req, res) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  try {
    const userDetail = await users.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (userDetail) {
      return res.status(400).send({
        status: "Failed",
        message: "Username already exist",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    let user = await users.create({
      ...req.body,
      password: hashedPassword,
    });

    user = JSON.parse(JSON.stringify(user));
    delete user.password;
    delete user.updatedAt;
    delete user.createdAt;

    const token = jwt.sign(user, process.env.TOKEN_KEY);

    res.send({
      status: "Success",
      message: "Your account has succesfully created",
      data: { ...user, token },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Internal server error",
    });
  }
};

exports.login = async (req, res) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  try {
    let user = await users.findOne({
      where: {
        username: req.body.username,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!user) {
      return res.status(400).send({
        status: "Failed",
        message: "Username or password is incorrect",
      });
    }

    const isValid = await bcrypt.compare(req.body.password, user.password);

    if (!isValid) {
      return res.status(400).send({
        status: "Failed",
        message: "Username or password is incorrect",
      });
    }

    user = JSON.parse(JSON.stringify(user));
    delete user.password;

    const token = jwt.sign(user, process.env.TOKEN_KEY);

    res.send({
      status: "Success",
      message: "Login succesful",
      data: { ...user, token },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Internal server error",
    });
  }
};
