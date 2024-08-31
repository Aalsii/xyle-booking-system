import { connectToDatabase } from './mongodb';
import { Booking, DeletedBooking } from './models';

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        await connectToDatabase();

        try {
            const bookings = await Booking.find();

            if (bookings.length > 0) {
                const deletedBookings = bookings.map((booking) => ({
                    teamName: booking.teamName,
                    whatsappNum: booking.whatsappNum,
                    yourName: booking.yourName,
                    uniqueId: booking.uniqueId,
                    timestamp: booking.timestamp,
                    deletedAt: new Date(),
                }));

                await DeletedBooking.insertMany(deletedBookings);
                await Booking.deleteMany();

                res.status(200).json({ success: true, message: 'All bookings canceled and archived successfully' });
            } else {
                res.status(404).json({ success: false, message: 'No bookings to cancel' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
