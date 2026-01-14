import { Request, Response } from "express";
import { asyncHandler } from "../utils/errorhandler";
import CustomError from "../middlewares/error-handler.middleware";
import { uploadFile, deleteFile } from "../utils/cloudinary.utils";
import { getPagination } from "../utils/pagination.utils";
import { Item } from "../models/item.model";

const item_folder = "/item_uploads";

//create item
export const createItem = asyncHandler(async (req: Request, res: Response) => {
  const { cover_image, images } = req.files as {
    [fieldname: string]: Express.Multer.File[];};

  const { 
    name, 
    type,
    description,
    details
  } = req.body;

  if (!cover_image) {
    throw new CustomError("Cover Image Required", 400);
  }

  const item = new Item({
    name,
    type,
    description,
    details: details ? JSON.parse(details ?? "") : null,
  });
  
  if (!item) {
    throw new CustomError("Something went wrong. Try again later.", 500);
  }

  // Upload cover image
  console.log("Before cover upload");
  item.cover_image = await uploadFile(cover_image[0].path, item_folder);
  console.log("After cover upload");

  if (images && images.length > 0) {
    const imagePaths = await Promise.all(
      images.map(async (img) => await uploadFile(img.path, item_folder))
    );
    item.set("images", imagePaths);
  }

  await item.save();

  res.status(201).json({
    message: "Item added successfully.",
    success: true,
    status: "success",
    data: item,
  });
});


export const getAllItem = asyncHandler(async (req: Request, res: Response) => {
  const { query, type, min_rating, max_rating, limit, page } = req.query;

  const page_limit = Number(limit) || 15;
  const current_page = Number(page) || 1;
  const skip = (current_page - 1) * page_limit;

  let filter: Record<string, any> = {};


  if (query) {
    filter.$or = [
      {
        name: {
          $regex: query,
          $options: "i",
        },
      },
      {
        description: {
          $regex: query,
          $options: "i",
        },
      },
    ];
  }


  if (type) {
    filter.type = type;
  }

  //Filter by rating range
  if (min_rating || max_rating) {
    filter.averageRating = {};
    if (min_rating) filter.averageRating.$gte = Number(min_rating);
    if (max_rating) filter.averageRating.$lte = Number(max_rating);
  }


  const items = await Item.find(filter)
    .limit(page_limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await Item.countDocuments(filter);

  res.status(200).json({
    message: "Items fetched successfully.",
    success: true,
    status: "success",
    data: {
      data: items,
      pagination: getPagination(total, page_limit, current_page),
    },
  });
});


//getitem by id
export const getItemById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = await Item.findOne({ _id: id });

  if (!item) {
    throw new CustomError("Item not found", 404);
  }

  res.status(200).json({
    message: "Item fetched successfully.",
    success: true,
    status: "success",
    data: item,
  });
});

//update item
export const updateItem = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { cover_image, images } = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };
  const { name, type, description, details, deletedImage } = req.body;

  const item = await Item.findByIdAndUpdate(
    id,
    { name, type, description, details },
    { new: true, runValidators: true }
  );

  if (!item) {
    throw new CustomError("Item not found", 404);
  }


  if (cover_image) {
    if (item.cover_image) {
      await deleteFile([item.cover_image.public_id]);
    }

    item.cover_image = await uploadFile(cover_image[0].path, item_folder);
  }

  if (deletedImage && deletedImage.length > 0 && item.images.length > 0) {
    await deleteFile(deletedImage);
    const oldImages = item.images.filter(
      (img) => !deletedImage.includes(img.public_id)
    );
    item.set("images", oldImages);
  }

  if (images && images.length > 0) {
    const uploadedImages = await Promise.all(
      images.map(async (img) => await uploadFile(img.path, item_folder))
    );
    item.set("images", [...item.images, ...uploadedImages]);
  }

  await item.save();

  res.status(200).json({
    message: "Item updated successfully.",
    success: true,
    status: "success",
    data: item,
  });
});

//delete
export const deleteItem = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = await Item.findById(id);

  if (!item) {
    throw new CustomError("Item not found", 404);
  }

  if (item.cover_image) {
    await deleteFile([item.cover_image.public_id]);
  }

  if (item.images && item.images.length > 0) {
    await deleteFile(item.images.map((img) => img.public_id as string));
  }

  await item.deleteOne();

  res.status(200).json({
    message: "Item deleted successfully.",
    success: true,
    status: "success",
    data: item,
  });
});




