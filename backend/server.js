const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); 
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const connectDB = require('./db');
const Calculation = require('./models/Calculation');

// --- Import Method Classes ---
const RootFinder = require('./methods/RootFinder');
const BisectionMethod = require('./methods/bisection');
const FalsePositionMethod = require('./methods/falsePosition');
const NewtonRaphson = require('./methods/newtonraphson'); 
const SecantMethod = require('./methods/secant');       
const OnePointIteration = require('./methods/onepoint'); 

// --- Connect to Database ---
connectDB(); // <-- เรียกใช้ฟังก์ชันเชื่อมต่อ DB

const app = express();
const PORT = process.env.PORT || 5001; // ใช้ PORT จาก environment variable ถ้ามี

app.use(cors());
// ใช้ bodyParser.json() แทน express.json() ถ้าต้องการ option เพิ่มเติม หรือใช้ express.json() ก็ได้
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // สำหรับรองรับ form data 

// --- API Documentation (Swagger) ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- Root of Equation Endpoints ---

// Helper function to handle solving and response
const handleSolve = async (SolverClass, req, res) => {
    try {
        console.log('--- Received Request Body ---');
        console.log(req.body);                     
        console.log('--- End Request Body ---'); 

        // ทำให้ยืดหยุ่นขึ้นโดยส่ง req.body ทั้งหมดไป (Class ต้องจัดการเอง)
        const solver = new SolverClass(req.body); // Class constructor ต้องปรับให้รับ object

        const result = solver.solve();

        try {
            // ดึงชื่อ Method จาก Class (ถ้าทำได้) หรือจาก req.path
            // วิธีง่ายๆ คือใช้ชื่อ Class โดยตรง (อาจจะต้องปรับปรุง)
            const methodName = SolverClass.name; // เช่น "BisectionMethod"

            // สร้าง Document ใหม่จาก Model
            const newCalculation = new Calculation({
                method: methodName,
                equation: req.body.equation || req.body.gEquation, // จัดการกรณี One-Point
                inputParams: req.body, // เก็บ Input ทั้งหมดที่ส่งมา
                calculatedRoot: result.root ? parseFloat(result.root) : (result.refinedRoot ? parseFloat(result.refinedRoot) : null), // แปลง Root เป็น Number, จัดการ Graphical
                executionTimeMs: result.executionTimeMs ? parseFloat(result.executionTimeMs) : 0, // แปลงเป็น Number
            });

            // บันทึก Document ลง DB (ใช้ await เพราะเป็น async)
            const savedCalculation = await newCalculation.save();
            console.log('Calculation saved to DB:', savedCalculation._id); // แสดง ID ที่บันทึกได้

        } catch (dbError) {
            // ถ้าบันทึก DB ไม่ได้ ให้ Log Error ไว้ แต่ *ไม่ต้อง* ทำให้ Request ล่ม
            // เรายังควรส่งผลการคำนวณกลับไปให้ผู้ใช้
            console.error('Error saving calculation to DB:', dbError.message);
            // อาจจะเพิ่มข้อมูล Error นี้ใน Response กลับไปก็ได้ (Optional)
            // result.dbSaveError = dbError.message;
        }
        // --- สิ้นสุดการบันทึกข้อมูล ---

        // ส่งผลการคำนวณกลับไปเหมือนเดิม
        res.json(result);

    } catch (err) {
        console.error("API Error:", err); // Log error จริงๆ ไว้ดูบน server
        res.status(400).json({ error: err.message || "An unexpected error occurred." });
    }
};

// ปรับ Constructor ของแต่ละ Class ให้รับ object `data`
// ตัวอย่าง Bisection Constructor:
/*
constructor(data) {
    super(data.equation);
    this.xl = parseFloat(data.xl);
    this.xr = parseFloat(data.xr);
    this.error = parseFloat(data.error);
    // ... validation ...
}
*/
app.post('/api/bisection', (req, res) => handleSolve(BisectionMethod, req, res));
app.post('/api/false-position', (req, res) => handleSolve(FalsePositionMethod, req, res));
app.post('/api/newton-raphson', (req, res) => handleSolve(NewtonRaphson, req, res));
app.post('/api/secant', (req, res) => handleSolve(SecantMethod, req, res));
app.post('/api/one-point', (req, res) => handleSolve(OnePointIteration, req, res));

// --- Endpoint สำหรับ Graphical Method (อาจจะต่างออกไป) ---
// Graphical มักจะแค่คำนวณจุดสำหรับพล็อตกราฟ ไม่ได้หา root โดยตรง
app.post('/api/graphical', async (req, res) => {
    try {
        const { equation, start, end, steps } = req.body;
        if (!equation || isNaN(parseFloat(start)) || isNaN(parseFloat(end))) {
            throw new Error('Equation, start, and end points are required for graphical method.');
        }
        const numSteps = parseInt(steps) || 100;

        // ใช้ RootFinder แค่สร้าง function และ getPlotData
        const helper = new RootFinder(equation); // ใช้ Class แม่ช่วย
        const plotData = helper.getPlotData(parseFloat(start), parseFloat(end), numSteps);
        res.json({ plotData });

        const result = {
            refinedRoot: refinedRoot.toFixed(6),
            yAtRefinedRoot: yAtRefinedRoot.toFixed(6),
            plotData: initialPlotData,
        };

        // --- (Optional) บันทึก Log การใช้ Graphical Method ---
        try {
             const newCalculationLog = new Calculation({
                method: 'GraphicalMethod', // ใส่ชื่อเอง
                equation: equation,
                inputParams: req.body,
                // calculatedRoot: null, // ไม่มี Root ที่แน่นอน
                executionTimeMs: 0, // อาจจะจับเวลาส่วนนี้เพิ่ม หรือใส่ 0
             });
             await newCalculationLog.save();
             console.log('Graphical usage logged to DB.');
        } catch (dbError) {
             console.error('Error logging graphical usage to DB:', dbError.message);
        }
        // --- สิ้นสุดการบันทึก Log ---

        res.json(result);

    } catch (err) {
         console.error("API Error (Graphical):", err);
         res.status(400).json({ error: err.message || "An unexpected error occurred." });
    }
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
  console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
});