import express from 'express';
import User from '../models/User.js'; 
import { protect } from '../middleware/authMiddleware.js';
import jwt from 'jsonwebtoken'; 

const router = express.Router();


router.put('/upgrade-seller', protect, async (req: any, res: any) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.role = 'seller';
            user.businessName = req.body.businessName || user.businessName;
            user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

            const updatedUser = await user.save();

            const token = jwt.sign({ id: updatedUser._id }, process.env.JWT_SECRET as string, {
                expiresIn: '30d',
            });

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                businessName: updatedUser.businessName,
                token: token,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
});

export default router;