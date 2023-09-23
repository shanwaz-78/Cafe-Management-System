const express = require("express");
const userController = require("../controllers/userController");
const route = express.Router();

route.get("/get", userController.getAllUsers);
route.post("/signUp", userController.signUp);
route.post("/login", userController.login);
route.post("/forgetPassword", userController.forgetPassword);
route.patch("/update-user", userController.updateUser);
module.exports = route;
