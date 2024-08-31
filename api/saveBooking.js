import { connectToDatabase } from './mongodb';
import { Booking } from './models';

export default async function handler(req, res) {
    if (req.method === 'POST') {
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

        try {
            await newBooking.save();
            res.status(201).json({ success: true, uniqueId });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
