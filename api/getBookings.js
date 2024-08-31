import { connectToDatabase } from './mongodb';
import { Booking } from './models';

export default async function handler(req, res) {
    await connectToDatabase();

    try {
        const bookings = await Booking.find();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
