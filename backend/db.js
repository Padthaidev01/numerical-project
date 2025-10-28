const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI; // ดึง URI จาก Environment Variable
    if (!mongoURI) {
      console.error('MongoDB URI not found in environment variables (MONGO_URI).');
      process.exit(1); // ออกจากโปรแกรมถ้าไม่มี URI
    }

    await mongoose.connect(mongoURI, {
      // Options เพิ่มเติม (อาจจะไม่จำเป็นสำหรับ Mongoose เวอร์ชันใหม่ๆ)
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log('MongoDB Connected Successfully!');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    // ออกจากโปรแกรมถ้าเชื่อมต่อไม่ได้
    process.exit(1);
  }
};

module.exports = connectDB;