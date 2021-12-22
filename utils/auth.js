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
      { email: result.email, id: result._id },
      process.env.SECRET_TOKEN,
      { expiresIn: "1h" }
    );

    res
      .status(NETWORK_STATUS.OK)
      .json({ result: { avatar, email, token, id: _id } });
  } catch (error) {
    res
      .status(NETWORK_STATUS.INTERNAL_SEVER_ERROR)
      .json({ message: "Something went wrong." });
    console.log(error);
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(NETWORK_STATUS.NOT_FOUND)
        .json({ message: `User doesn't exist.` });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res
        .status(NETWORK_STATUS.BAD_REQUEST)
        .json({ message: `Invalid credentials.` });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.SECRET_TOKEN,
      {
        expiresIn: "1h",
      }
    );

    const result = {
      avatar: existingUser.avatar,
      email: existingUser.email,
      token,
      id: existingUser._id,
    };

    res.status(NETWORK_STATUS.OK).json({ result });
  } catch (error) {
    res
      .status(NETWORK_STATUS.INTERNAL_SEVER_ERROR)
      .json({ message: `Something went wrong.` });
    console.log(error);
  }
};
