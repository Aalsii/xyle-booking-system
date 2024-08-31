import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    teamName: String,
    whatsappNum: String,
    yourName: String,
    uniqueId: String,
    timestamp: { type: Date, default: Date.now },
});

const deletedBookingSchema = new mongoose.Schema({
    teamName: String,
    whatsappNum: String,
    yourName: String,
    uniqueId: String,
    timestamp: Date,
    deletedAt: { type: Date, default: Date.now },
});

export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export const DeletedBooking = mongoose.models.DeletedBooking || mongoose.model('DeletedBooking', deletedBookingSchema);
