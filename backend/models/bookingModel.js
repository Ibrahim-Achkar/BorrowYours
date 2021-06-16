import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      requried: true,
      ref: 'User',
    },

    item: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Item',
    },

    reserver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    reservedDates: {
      type: Array,
      required: true,
    },

    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },

    deliveredAt: {
      type: Date,
      required: false,
    },

    isReturned: {
      type: Boolean,
      required: true,
      default: false,
    },

    returnedAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
