import express from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

import PostMessage from '../models/postMessage.js';

const router = express.Router();

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getPosts = async (req, res) => {
    const { page } = req.query;
    
    try {
        const LIMIT = 6;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
    
        const total = await PostMessage.countDocuments({});
        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        res.json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;

    try {
        const title = new RegExp(searchQuery, "i");

        const posts = await PostMessage.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ]});

        res.json({ data: posts });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const getPost = async (req, res) => { 
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);
        
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res) => {
    const post = req.body;
    try {
        const photoUrl = await cloudinary.uploader.upload(post.selectedFile);

				const newPostMessage = new PostMessage({
					...post,
					selectedFile: photoUrl.url,
					imagePublicId: photoUrl.public_id,
					creator: req.userId,
					createdAt: new Date().toISOString(),
				});

				await newPostMessage.save();

				res.status(201).json(newPostMessage);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    try {
      const photoUrl = await cloudinary.uploader.upload(selectedFile);

      const updatedPost = { creator, title, message, tags, selectedFile: photoUrl.url, imagePublicId: photoUrl.public_id, _id: id };
  
      await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });
  
      res.json(updatedPost);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    try {
      const post = await PostMessage.findById(id);

      await cloudinary.uploader.destroy(post.imagePublicId);

      await PostMessage.findByIdAndRemove(id);

      res.json({ message: "Post deleted successfully." });
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
      }

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    
    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id ===String(req.userId));

    if (index === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.status(200).json(updatedPost);
}

export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    const post = await PostMessage.findById(id);

    post.comments.push(value);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);
};

export default router;