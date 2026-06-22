import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2023-10-16' as any, 
});

export const createPaymentIntent = async (req: any, res: any): Promise<any> => {
    try {
        const { amount } = req.body;

        const calculateOrderAmount = (price: number) => {
            return Math.round(price * 100); 
        };

        const paymentIntent = await stripe.paymentIntents.create({
            amount: calculateOrderAmount(amount),
            currency: 'lkr', 
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};