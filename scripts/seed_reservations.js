require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { connectDB } = require('../src/config/db');
const Reservation = require('../src/models/Reservation');

(async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../reservations.json'), 'utf-8'));

    await Reservation.deleteMany({});
    await Reservation.insertMany(data);

    console.log(`✅ Import Reservations terminé (${data.length} éléments)`);
    process.exit(0);
  } catch (e) {
    console.error('❌ Seed reservations error:', e);
    process.exit(1);
  }
})();
