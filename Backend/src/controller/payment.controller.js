import { Payment } from "../models/payment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Stripe} from "stripe";

const payment = asyncHandler(async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // use test key

    try {
       
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"], // only "card"
            mode: "payment",
            line_items: [
                {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: "Multi-LLM Subscription",
                        description: "Unlock Multi-LLM and premium features" ,
                        metadata: {
                            feature1: "24/7 Support",
                            feature2: "Access to all courses",
                            feature3: "Free updates",
                        },
                    },
                    unit_amount: 50000, // 500 INR = 500 * 100
                },
                quantity: 1,
                },
            ],
            success_url: "http://localhost:5173/success",
            cancel_url: "http://localhost:5173/cancel",
            });
        
        
        res.json({ id: session.id, url: session.url , payment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export { payment };
