import express from 'express';
import Order from '../models/orderModel.js';
import { protect, admin, seller } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, async (req: any, res: any) => {
    try {
        const {
            orderItems,
            shippingAddress,
            itemsPrice,
            shippingPrice,
            totalPrice,
            sellerId, 
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400).json({ message: 'No order items found' });
            return;
        } else {
            const order = new Order({
                user: req.user._id, 
                seller: sellerId,   
                orderItems,
                shippingAddress,
                paymentMethod: 'Credit/Debit Card', 
                itemsPrice,
                shippingPrice,
                totalPrice
            });

            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to create order' });
    }
});


router.get('/myorders', protect, async (req: any, res: any) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/seller-orders', protect, seller, async (req: any, res: any) => {
    try {
        const orders = await Order.find({ seller: req.user._id }).populate('user', 'id name');
        res.json(orders);
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/', protect, admin, async (req: any, res: any) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name');
        res.json(orders);
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error' });
    }
});


router.get('/:id', protect, async (req: any, res: any) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.put('/:id/deliver', protect, seller, async (req: any, res: any) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            if (order.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Not authorized to update this order' });
            }

            order.isDelivered = true;
            order.deliveredAt = new Date();

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error' });
    }
});


router.put('/:id/pay', protect, async (req: any, res: any) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isPaid = true;
            order.paidAt = new Date();
            
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address,
            };

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;