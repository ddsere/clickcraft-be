import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import Showcase from '../models/Showcase.js';

export const createShowcase = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { slug, title, theme, items } = req.body;

        const showcaseExists = await Showcase.findOne({ slug });
        if (showcaseExists) {
            return res.status(400).json({ message: "Slug is already taken. Choose another." });
        }

        const showcase = await Showcase.create({
            user: req.user?._id as any,
            slug,
            title,
            theme,
            items
        });

        res.status(201).json(showcase);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


export const getShowcaseBySlug = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const showcase = await Showcase.findOne({ slug: req.params.slug }).populate('user', 'name businessName email');
        
        if (!showcase) {
            return res.status(404).json({ message: "Showcase not found" });
        }
        res.json(showcase);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getShowcases = async (req: any, res: any): Promise<any> => {
    try {
        const showcases = await Showcase.find({}).sort({ createdAt: -1 }).populate('user', 'name businessName');
        res.json(showcases);
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Failed to fetch showcases" });
    }
};


export const getSellerShowcases = async (req: any, res: any): Promise<any> => {
    try {
        const showcases = await Showcase.find({ user: req.user._id });
        res.json(showcases);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


export const updateShowcase = async (req: any, res: any): Promise<any> => {
    try {
        const showcase = await Showcase.findById(req.params.id);

        if (showcase) {
            if (showcase.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: "Not authorized to update this showcase" });
            }

            showcase.title = req.body.title || showcase.title;
            showcase.theme = req.body.theme || showcase.theme;
            showcase.items = req.body.items || showcase.items;

            const updatedShowcase = await showcase.save();
            res.json(updatedShowcase);
        } else {
            res.status(404).json({ message: "Showcase not found" });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteShowcase = async (req: any, res: any): Promise<any> => {
    try {
        const showcase = await Showcase.findById(req.params.id);

        if (showcase) {
            if (showcase.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: "Not authorized to delete this showcase" });
            }

            await Showcase.deleteOne({ _id: showcase._id });
            res.json({ message: "Showcase removed successfully" });
        } else {
            res.status(404).json({ message: "Showcase not found" });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};