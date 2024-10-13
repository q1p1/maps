const express = require('express');
const app = express();
const port = 3000;

// استيراد routes من ملف points.js
const pointsRouter = require('./routes/points'); // تأكد أن المسار يتطابق مع هيكلية المشروع

// استخدام routes الخاصة بالنقاط
app.use('/api', pointsRouter); // /api هي الواجهة التي يمكن أن تكون للـ endpoints

// تشغيل السيرفر
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
