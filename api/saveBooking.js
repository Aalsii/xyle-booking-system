import { connectToDatabase } from './mongodb';
import { Booking } from './models';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await connectToDatabase();

            const { teamName, whatsappNum, yourName } = req.body;

            const uniqueId = `${teamName.replace(/\s+/g, "-").toUpperCase()}-${Math.floor(Math.random() * 1000000)}`;

            const newBooking = new Booking({
                teamName,
                whatsappNum,
                yourName,
                uniqueId,
                timestamp: new Date(),
            });

            await newBooking.save();
            res.status(201).json({ success: true, uniqueId });

        } catch (error) {
            console.error('Error saving booking:', error);
            res.status(500).json({ success: false, message: 'Failed to book slot.' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
