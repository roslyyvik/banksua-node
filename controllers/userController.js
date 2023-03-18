const User = require('../models/User');
const cloudinary = require('cloudinary').v2
const fs = require('fs')
require("dotenv").config()
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require('../utils');

const getAllUsers = async (req, res) => {
  console.log(req.user);
  const users = await User.find({ role: 'user' }).select('-password');
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select('-password');
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
  }
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};
// update user with user.save()
const updateUser = async (req, res) => {
  const { email, name,} = req.body;
  if (!email || !name) {
    throw new CustomError.BadRequestError('Please provide all values');
  }
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;

  await user.save();

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserImage = async (req, res) => {
  const { pic } = req.body;
  const user = await User.findOne({ _id: req.user.userId });

  user.pic = pic;
  await user.save();

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const uploadUserImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: 'file-upload',
    }
  )
  fs.unlinkSync(req.files.image.tempFilePath)
  return res.status(StatusCodes.OK).json({ image: { src:result.secure_url } })
}

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError('Please provide both values');
  }
  const user = await User.findOne({ _id: req.user.userId });

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
  user.password = newPassword;

  await user.save();
  res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated.' });
};





// update user with findOneAndUpdate
// const updateUser = async (req, res) => {
//   // const { email, name } = req.body;
//   // if (!email || !name) {
//   //   throw new CustomError.BadRequestError('Please provide all values');
//   // }
//   // const user = await User.findOneAndUpdate(
//   //   { _id: req.user.userId },
//   //   { email, name },
//   //   { new: true, runValidators: true }
//   // );

//   try {
//     let user = await User.findById(req.params.id)
//     // const fullURL = user.avatar
//     // const shortenURL = fullURL.split('/').pop().split('.')[0]
//     // await cloudinary.uploader.destroy(shortenURL)
    
//     // await cloudinary.uploader.destroy(user.cloudinary_id)
//     let result
//     if(req.file){
//       result = await cloudinary.uploader.upload(req.file.path)
//     }
//     const data = {
//       name: req.body.name || user.name,
//       email: req.body.email || user.email,
//       role: req.body.role || user.role,
//       pic: result?.secure_url || user.pic,
//       cloudinary_id: result?.public_id || user.cloudinary_id,
//     }
//     user = await User.findByIdAndUpdate(req.params.id, data, {new: 'true'})

//     const tokenUser = createTokenUser(user);
//     attachCookiesToResponse({ res, user: tokenUser });
//     res.status(StatusCodes.OK).json({ user: tokenUser });
//   } catch (error) {
//     console.log(error);
//   }
  
// };

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  uploadUserImage,
  updateUserImage,
};
