const db = require("../../models");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const UserModel = db.user;
const SECRET_KEY = process.env.JWT_SECRET;
const bcrypt = require("bcrypt");

const cookieOptions = {
  // httpOnly: true,
  // secure: true, // Make sure to use HTTPS in production
  maxAge: 3600000, // 1 hour expiration
  // sameSite: "strict", // Adjust according to your needs
};

const signIn = async function (req, res) {
  let { username, password } = req.body;
  username = username.trim().toLowerCase();
  try {
    const user = await UserModel.findOne({ username });

    const match = await bcrypt.compare(password, user.password);

    if (!user || !match) {
      return (
        res
          // .status(401)
          .json({ status: 401, message: "Invalid credentials" })
      );
    }

    // Generate JWT and set cookie
    const token = jwt.sign(
      { username: user.username, colorPreference: user.colorPreference },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    console.log("token", token);

    res.cookie("token", token);

    res.status(200).json({
      status: 200,
      message: "Sign in successful",
      data: { username, preference: user.colorPreference, token },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Server error" });
  }
};
const createUser = async function (req, res) {
  try {
    const { username, password, confirmPassword } = req.body;
    if (confirmPassword !== password) {
      return res.status(422).json({
        status: 422,
        message: "password and confirm password should be same",
      });
    }
    const saltRounds = 10; // Number of salt rounds
    const hash = await bcrypt.hash(password, saltRounds);
    let resp = await UserModel.create({
      username: username.trim().toLowerCase(),
      password: hash,
    });
    res.json({ status: 200, message: "User created successfully", data: resp });
  } catch (error) {
    return res.json({
      status: 500,
      message: "Internal Server Error " + error.message,
    });
  }
};
const getUser = async function (req, res) {
  try {
    let findUser = await UserModel.find({ isDeleted: false });
    if (!findUser.length) {
      res.json({ status: 204, message: "No Data found" });
    }
    res.json({ status: 200, message: "User list", data: findUser });
  } catch (error) {
    return res.json({
      status: 500,
      message: "Internal Server Error " + error.message,
    });
  }
};

const changePreference = async function (req, res) {
  const { color } = req.body;

  try {
    // Update color preference for the authenticated user
    const user = await UserModel.findOneAndUpdate(
      { username: req.body.username.trim().toLowerCase() },
      { colorPreference: color },
      { new: true }
    );
    if (!user) {
      return res.json({ status: 404, message: "User not found" });
    }

    res.json({ status: 200, message: "Color preference updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: 500, message: "Server error " + error.message });
  }
};

module.exports = {
  signIn,
  changePreference,
  getUser,
  createUser,
};
