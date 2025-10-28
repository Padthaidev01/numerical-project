const mongoose = require('mongoose');

// กำหนดโครงสร้างข้อมูลที่จะเก็บ
const CalculationSchema = new mongoose.Schema({
  method: {
    type: String,
    required: true, // ต้องมีชื่อ method เสมอ
    trim: true,     // ตัดช่องว่างหน้า/หลัง
  },
  equation: {
    type: String,
    required: true,
    trim: true,
  },
  // เก็บ Input Parameters ทั้งหมดเป็น Object เผื่อแต่ละ Method ใช้ไม่เหมือนกัน
  inputParams: {
    type: mongoose.Schema.Types.Mixed, // เก็บ Object อะไรก็ได้
    required: true,
  },
  calculatedRoot: {
    type: Number, // เก็บค่า Root เป็นตัวเลข
    // ไม่ required เพราะ Graphical Method อาจจะไม่มี Root
  },
  executionTimeMs: {
    type: Number,
    required: true,
  },
  // เพิ่ม Timestamp ตอนที่บันทึกข้อมูล
  createdAt: {
    type: Date,
    default: Date.now, // ใส่เวลาปัจจุบันอัตโนมัติ
  },
});

// สร้าง Model ชื่อ 'Calculation' (Mongoose จะสร้าง Collection ชื่อ 'calculations' ให้ใน DB)
const Calculation = mongoose.model('Calculation', CalculationSchema);

module.exports = Calculation;