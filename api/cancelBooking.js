import { connectToDatabase } from './mongodb';
import { Booking, DeletedBooking } from './models';

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        const { uniqueId } = req.query;

        await connectToDatabase();

        try {
            const booking = await Booking.findOneAndDelete({ uniqueId });

            if (booking) {
                const deletedBooking = new DeletedBooking({
                    teamName: booking.teamName,
                    whatsappNum: booking.whatsappNum,
                    yourName: booking.yourName,
                    uniqueId: booking.uniqueId,
                    timestamp: booking.timestamp,
                    deletedAt: new Date(),
                });

                await deletedBooking.save();

                res.status(200).json({ success: true, message: 'Booking canceled and archived successfully' });
            } else {
                res.status(404).json({ success: false, message: 'Booking not found' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
