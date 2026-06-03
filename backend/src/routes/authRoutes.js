const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
} = require("../services/authService");

router.post(
  "/register",
  async (req, res) => {

    try {

      const {
        email,
        password,
        role,
      } = req.body;

      const result =
        await registerUser(
          email,
          password,
          role
        );

      res.status(201).json(result);

    } catch (error) {

      res.status(400).json({
        error: error.message,
      });

    }
  }
);

router.post(
  "/login",
  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body;

      const result =
        await loginUser(
          email,
          password
        );

      res.status(200).json(result);

    } catch (error) {

      res.status(401).json({
        error: error.message,
      });

    }
  }
);

module.exports = router;