const express = require("express");
const router = express.Router();
/**IMPORT MIDDLEWARE */
const authenticateJWT = require("./../middlewares/authenticateJWT");

/**
 * Roles for route access
 */
const roles = {
  student: ["STUDENT"],
  teacher: ["TEACHER"],
  admin: ["ADMIN"],
  studentAdminTeacher: ["STUDENT", "ADMIN", "TEACHER"],
};

/**
 * Import controllers
 */
const user = require("../controllers/userController");

/**
 * Middlewares
 */
/**
 * Will Check Schema validation and token validation
 * @param {*} schema check scheam fields and types are valid or not.
 * @param {*} tokenVerify [true] [false] based on boolean it will check token vaild or not.
 */
var authorize = function (schema, tokenVerify, role) {
  //Middleware for handling Authentication code goes here...
  //schema : ==> null indicates no authorization
  //tokenVerify : ==> false indicates no auth
  //role : ==> Based on role, api access is provided eg: STUDENT
  //   next();
};

/**User API */

router.post("/user", authenticateJWT, user.createUser);
router.get("/users", user.getUser);
router.post("/signIn", user.signIn);
router.put("/preferences", authenticateJWT, user.changePreference);

module.exports = router;
