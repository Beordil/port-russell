require('dotenv').config();
const { connectDB } = require('../src/config/db');
const User = require('../src/models/User');

(async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    await User.deleteMany({});
    const docs = await User.insertMany([
      { name: 'Alice Martin', email: 'alice@example.com', role: 'admin' },
      { name: 'Bob Dupont',   email: 'bob@example.com',   role: 'user'  },
    ]);
    console.log(`✅ Users seed OK (${docs.length})`);
    process.exit(0);
  } catch (e) {
    console.error('❌ Seed users error:', e);
    process.exit(1);
  }
})();
