// require("dotenv").config();
const connection = require("../database/connection");
const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");

const signUp = (req, res) => {
  const user = req.body;
  console.log(user);
  const query = "SELECT email,password,role,status FROM user WHERE email = (?)";
  connection.query(query, [user.email], (err, result) => {
    if (!err) {
      if (result.length <= 0) {
        const query =
          "INSERT INTO user(name,contactNumber,email,password,status,role) VALUES(?,?,?,?,'false','user')";
        connection.query(
          query,
          [
            user.name,
            user.contactNumber,
            user.email,
            user.password,
            user.status,
            user.role,
          ],
          (err) => {
            if (!err) {
              return res
                .status(201)
                .json({ message: `User Created Successfully` });
            }
          }
        );
      } else {
         res.status(200).send({ message: `User Already Exists` });
      }
    }
  });
};

const login = (req, res) => {
  const user = req.body;
  const query = "SELECT email,password,role,status FROM user WHERE email = (?)";
  connection.query(query, [user.email], (err, result) => {
    if (!err) {
      switch (true) {
        case result.length <= 0 || user.password !== result[0].password:
          return res
            .status(401)
            .json({ message: `Incorrect UserName or Password` });
          break;
        case result[0].status === "false":
          return res.status(401).json({ message: `Wait For Admin Approval` });
          break;
        case result[0].password === user.password:
          const response = { email: result[0].email, role: result[0].role };
          const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
            expiresIn: "1h",
          });
          res.status(200).json({ token: accessToken });
          break;
        default:
          break;
      }
    } else {
      return res.status(500).json(result);
    }
  });
};

const forgetPassword = (req, res) => {
  const user = req.body;
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  const query = "SELECT email,password,role,status FROM user WHERE email = (?)";
  connection.query(query, [user.email], (err, result) => {
    if (!err) {
      if (result.length <= 0) {
        return res
          .status(200)
          .json({ message: `Password Sent Successfully to your email` });
      } else {
        const mailOptions = {
          from: process.env.EMAIL,
          to: result[0].email,
          subject: `Password by Cafe Management System`,
          html: `<p>Your Login Details for Cafe Management System, Email:${
            result[0].email
          } Password:${
            result[0].password
          } <a href='${"http://localhost:8001/user/login"}'>Click Here to Login</a></p>`,
        };
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            return res.send({
              message: `Cannot Send Email Try Again Later ${err.message}`,
            });
          } else {
            return res
              .send(201)
              .json({ message: `Email Sent Successfully ${info.response}` });
          }
        });
      }
    } else {
      return res.status(500).json({ err });
    }
  });
};

const getAllUsers = (req, res) => {
  const query =
    "SELECT name,contactNumber,email,password from user where role = 'user'";
  connection.query(query, (err, result) => {
    if (!err) {
      return res.status(200).json({ data: result });
    } else {
      return res.send(500).json(err);
    }
  });
};

const updateUser = (req, res) => {
  const user = req.body;
  const query = "UPDATE user SET status = ? where id = ?";
  connection.query(query, [user.status, user.id], (err, result) => {
    if (!err) {
      if (result.affectedRows == 0) {
        return res.status(404).json({ message: `User Id is not exixts` });
      }else{
        return res.send(200).json({ message: `User Updated Successfully` });
      }
    } else {
      return res.status(500).json(err);
    }
  });
};

module.exports = {
  signUp,
  login,
  forgetPassword,
  getAllUsers,
  updateUser,
};
