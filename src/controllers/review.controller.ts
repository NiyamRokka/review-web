import { Request, Response } from "express";
import { asyncHandler } from "../utils/errorhandler";
import CustomError from "../middlewares/error-handler.middleware";
import { getPagination } from "../utils/pagination.utils";
import { Review } from "../models/review.model";
import { Item } from "../models/item.model";
// import { Types } from "mongoose";
import { sendMail } from "../utils/nodemailer.utils";

//create review
export const createReview = asyncHandler(
  async (req: Request, res: Response) => {
    const { item, rating, comment } = req.body;
    const user = req.user._id;

    //Validate input
    if (!item) {
      throw new CustomError("Item is required", 400);
    }

    if (!rating || rating < 1 || rating > 5) {
      throw new CustomError("Rating must be between 1 and 5", 400);
    }

    //Check if item exists
    const reviewItem = await Item.findById(item);
    if (!reviewItem) {
      throw new CustomError("Item not found", 404);
    }

    //Prevent duplicate review
    const existingReview = await Review.findOne({
      user,
      item,
    });

    if (existingReview) {
      throw new CustomError(
        "You have already reviewed this item",
        400
      );
    }

    //Create review
    const review = await Review.create({
      user,
      item,
      rating,
      comment,
    });

    //Review success email
    const html = `
      <div style="padding: 30px; font-family: Arial;">
        <h2 style="color: #4CAF50;">✅ Review Added Successfully</h2>

        <p><strong>Item:</strong> ${reviewItem.title}</p>
        <p><strong>Rating:</strong> ⭐ ${rating}/5</p>
        ${
          comment
            ? `<p><strong>Your Comment:</strong> ${comment}</p>`
            : ""
        }

        <p><strong>Reviewed On:</strong> ${new Date(
          review.createdAt
        ).toDateString()}</p>

        <hr style="margin: 20px 0;">

        <p>Thank you for sharing your experience. Your review helps others make better decisions.</p>
        <p>We appreciate your time and feedback ❤️</p>
      </div>

      <div style="background-color: #f1f1f1; text-align: center; padding: 15px;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Review Platform. All rights reserved.</p>
      </div>
    `;

    await sendMail({
      to: req.user.email,
      subject: "Review Submitted Successfully",
      html,
    });

    res.status(201).json({
      message: "Review added successfully",
      success: true,
      data: review,
    });
  }
);

//getall
export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const { item, rating, limit, page } = req.query;

  const page_limit = Number(limit) || 10;
  const current_page = Number(page) || 1;
  const skip = (current_page - 1) * page_limit;


  let filter: Record<string, any> = {};

  if (item) {
    filter.item = item;
  }

  if (rating) {
    filter.rating = rating;
  }

  const reviews = await Review.find(filter)
    .populate("user", "name email")
    .limit(page_limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await Review.countDocuments(filter);

  res.status(200).json({
    message: "Reviews fetched successfully",
    success: true,
    status: "success",
    data: {
      data: reviews,
      pagination: getPagination(total, page_limit, current_page),
    },
  });
});

//get by id
export const getById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const review = await Review.findById(id).populate("user", "name email");

  if (!review) {
    throw new CustomError("Review not found", 404);
  }

  res.status(200).json({
    message: "Review fetched successfully",
    success: true,
    status: "success",
    data: review,
  });
});


//update existing review 
export const updateReview = asyncHandler(async (req: Request, res: Response) => {

  if (!req.user) {
    throw new CustomError("Unauthorized", 401);
  }

  const { id } = req.params;
  const { rating, comment }: { rating?: number; comment?: string } = req.body;
  
  const review = await Review.findById(id);
  const reviewUserId = (review as any).user


  if (!review) {
    throw new CustomError("Review not found", 404);
  }

  if (!reviewUserId.equals(req.user._id)) {
    throw new CustomError("Not authorized to update this review", 403);
  }

  if (typeof rating === "number") { 
    review.rating = rating;
  }

  if (typeof comment === "string") {
    review.comment = comment;
  }

  await review.save();

  res.status(200).json({
    message: "Review updated successfully",
    success: true,
    status: "success",
    data: review,
  });
})


//delete existing review
export const deleteReview = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      throw new CustomError("Review not found", 404);
    }

    // Authorization: only review owner can delete
    if ((review as any).user.toString() !== req.user._id.toString()) {
      throw new CustomError("Not authorized to delete this review", 403);
    }

    await review.deleteOne();

    res.status(200).json({
      message: "Review deleted successfully",
      success: true,
      status: "success",
    });
  }
);

