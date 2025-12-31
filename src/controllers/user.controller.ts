import { Request, Response } from "express";
import User from "../models/user.models";
import CustomError from "../middlewares/error-handler.middleware";
import { asyncHandler } from "../utils/errorhandler";
import { deleteFile, uploadFile } from "../utils/cloudinary.utils";
import { getPagination } from "../utils/pagination.utils";

export const getAllUser = asyncHandler(
  async (req: Request, res: Response) => {
const {query,limit,page} = req.query
const filter = {}
const per_page = Number(limit) || 15
const current_page = Number(page) || 1
const skip = (current_page -1) * per_page

const users = await User.find(filter).skip(skip).limit(per_page).sort({createdAt:-1})
const total = await User .countDocuments({})
    res.status(200).json({
      message: "All user fetched",
      status: "success",
      success: true,
      data:{ 
        data:users,
      pagination:getPagination(total,per_page,current_page)}
    });
  }
);

export const remove = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new CustomError("User not found", 404);
    }

    res.status(200).json({
      message: "User deleted successfully",
      success: true,
      status: "success",
      data: null,
    });
  }
);

export const getById = asyncHandler(
  async (req: Request, res: Response) => {
      const { userId } = req.params;
      const user = User.findOne({ _id: userId });

      if (!user) {
        throw new CustomError("User not found", 404);
      }

      res.status(200).json({
        message: "user fetched",
        status: "success",
        success: true,
        data: user,
      })
  });


export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const { firstName, lastName, phone, gender} = req.body;
    const  profile_picture  = req.file as Express.Multer.File
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (gender) user.gender = gender;

    if (profile_picture){
   if (user.profile_picture?.public_id) {
    await deleteFile([user?.profile_picture?.public_id]);
  }


  const uploadedImage = await uploadFile(profile_picture.path, "users/profile_pictures");

  user.profile_picture = uploadedImage;
}


    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      status: "success",
      data: user,
    });
  }
);
