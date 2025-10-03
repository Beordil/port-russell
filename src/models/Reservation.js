const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    catwayNumber: { type: Number, required: true, min: 1 },
    clientName:   { type: String, required: true, minlength: 2, maxlength: 100 },
    boatName:     { type: String, required: true, minlength: 2, maxlength: 100 },
    startDate:    { type: Date,   required: true },
    endDate:      { type: Date,   required: true }
    // customerEmail: { type: String } // si besoin plus tard
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reservation', reservationSchema);
