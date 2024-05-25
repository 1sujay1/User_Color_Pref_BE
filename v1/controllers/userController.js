const db = require("../../models");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const UserModel = db.user;

const cookieOptions = {
  maxAge: 3600000, // 1 hour in milliseconds
  // httpOnly: true,
  // secure: true,
  // sameSite: "strict", // For added security, specify the sameSite attribute
};

const signIn = async function (req, res) {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });

    if (!user || user.password !== password) {
      return res
        .status(401)
        .json({ status: 401, message: "Invalid credentials" });
    }

    // Generate JWT and set cookie
    const token = jwt.sign({ username: user.username }, "secret", {
      expiresIn: "1h",
    });
    console.log("token", token);

    const cookieString = cookie.serialize("token", token, cookieOptions);
    res.setHeader("Set-Cookie", cookieString);

    res.status(200).json({ status: 200, message: "Sign in successful" });
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

    let resp = await UserModel.create({ username, password });
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
      { username: req.user.username },
      { colorPreference: color },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
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
