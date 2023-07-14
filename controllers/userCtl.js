const { genareteToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const { genareteRefreshToken } = require("../config/refeshToken");
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
const validateMongoDbId = require("../utils/validateMongodb");

// registration user
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    // create a new user
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    // user exist
    throw new error("User already exist");
  }
});

// login user
const loginUserCtl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refeshToken = await genareteRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(findUser.id,
    {
      refeshToken: refeshToken,
    }, { new: true }
    );
    res.cookie("refreshToen", {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 100,
    });
    res.json({
      _id: findUser?._id,
      fistname: findUser?.fistname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: genareteToken(findUser?._id),
    });
  } else {
    throw new Error("Password or Email is not matched");
  }
});
// handler refresh toen

const handelerRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  console.log(cookie);
  if (!cookie?.refeshToken) throw new error('No Refresh Token');
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new error('No Refresh Token in database or no matched');
  jwt.verify(refreshToken.process.env.JWT_SCRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is somethin wrong with refresh token");
    }
    const accessToken = genareteRefreshToken(user?._id);
    res.json({ accessToken });
  });
  return res.sendStatus(204);
});
// logout fanctionality

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refeshToken) throw new error('No Refresh Token');
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });

  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",

  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.senddStatus(204);
});

// update users

const updatedUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        fisname: req?.body?.fistname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new error(error);
  }
});

// get all users
const getallUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new error(error);
  }
});

// get one user by id
const getaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaUser = await User.findById(id);
    res.json(getaUser);
  } catch (error) {
    throw new error(error);
  }
});

// Delete user
const deleteaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteaUser = await User.findByIdAndDelete(id);
    res.json(deleteaUser);
  } catch (error) {
    throw new error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({
      message: 'User is blocked',
    });
  } catch (error) {
    throw new Error(error);
  }
});
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: 'User is Unblocked',
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUserCtl,
  getallUser,
  getaUser,
  deleteaUser,
  updatedUser,
  blockUser,
  unblockUser,
  handelerRefreshToken,
  logout,
};
