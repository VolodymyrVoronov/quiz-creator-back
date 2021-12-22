import * as EmailValidator from "email-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

import { NETWORK_STATUS } from "../const/networkStatus.js";

export const signup = async (req, res) => {
  const { avatar, email, password, passwordConfirm } = req.body;

  try {
    if (!EmailValidator.validate(email)) {
      return res
        .status(NETWORK_STATUS.BAD_REQUEST)
        .json({ message: "Email is invalid." });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(NETWORK_STATUS.BAD_REQUEST)
        .json({ message: "User already exists." });
    }

    if (password !== passwordConfirm) {
      return res
        .status(NETWORK_STATUS.BAD_REQUEST)
        .json({ message: "Passwords don't match." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      avatar,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { login: result.login, id: result._id },
      process.env.SECRET_TOKEN,
      { expiresIn: "30d" }
    );

    res.status(NETWORK_STATUS.OK).json({ result, token });
  } catch (error) {
    res
      .status(NETWORK_STATUS.INTERNAL_SEVER_ERROR)
      .json({ message: "Something went wrong." });
    console.log(error);
  }
};
