# Lunessa Booking v1 — ชุดพร้อมตั้งระบบ

## ใช้ Google Sheet เดิม
Spreadsheet ID: 14g0ayVHso9fNaB3Aw5liHVSrATyUM15mWkb1YYCEtkA

ระบบจะเพิ่ม 3 แท็บระบบในไฟล์เดิม:
- WEB_BOOKINGS
- WEB_CUSTOMERS
- WEB_PETS

ไม่สร้าง Spreadsheet ใหม่

## กฎเวลาที่ใส่ไว้แล้ว
- อาบน้ำอย่างเดียว 1 ตัว = 2 ชม.
- อาบน้ำอย่างเดียว 2 ตัว = 3 ชม.
- อาบน้ำ + ตัดไถ/กรรไกร 1 ตัว = 3 ชม.
- อาบน้ำ + ตัดไถ/กรรไกร 2 ตัว = 4 ชม.
- อาบน้ำ 1 + อาบน้ำตัดขน 1 = 3 ชม.
- ตัดขนอย่างเดียว = 2 ชม.
- บริการเสริมอย่างเดียว = 1 ชม.
- มัดจำ: อาบน้ำ/บริการเสริม 200 บาทต่อตัว; อาบน้ำ+ตัด 400 บาทต่อตัว

## ราคาที่ใส่เป็นค่าเริ่มต้นในหน้าเว็บ
สุนัขขนสั้น/ตรง:
XS 259/509/609
S 359/609/709
M 409/659/759
L 459/759/859
XL 509/809/909
ลำดับ = อาบน้ำ / อาบน้ำ+ตัดไถ / อาบน้ำ+ตัดกรรไกร

หมายเหตุ: ราคาของแมวและตารางขนประเภทอื่นไม่ได้ถูกเดาจากข้อมูลที่มีในระบบ จึงไม่ใส่ตัวเลขผิดให้ลูกค้า

## ตั้งค่าแบบสั้นที่สุด
1. เปิด Google Sheet เดิม > Extensions > Apps Script
2. วาง Code.gs และ appsscript.json
3. Run `setup` 1 ครั้ง และกดยอมรับสิทธิ์
4. Project Settings > Script Properties:
   STRIPE_SECRET_KEY = Secret key ของบัญชี Stripe ของเธอ
   WEB_APP_URL = URL /exec ของ Web App
5. Deploy > New deployment > Web app
   Execute as: Me
   Who has access: Anyone
6. นำ URL /exec ไปแทน `PASTE_APPS_SCRIPT_WEB_APP_URL_HERE` ใน index.html
7. อัปโหลด index.html และ logo.jpg ขึ้นเว็บเดิม

## Stripe
หน้าเว็บสร้าง Stripe Checkout Session ผ่าน Apps Script และส่ง Booking ID ไปเป็น metadata
Payment สำเร็จจะต้องเรียก `doStripeWebhook(e)` จาก endpoint ที่เชื่อม Stripe

สำคัญ: Google Apps Script Web App ไม่ได้เหมาะกับการตรวจ Stripe-Signature แบบมาตรฐานจาก HTTP header ในทุก deployment. สำหรับ Live production ควรใช้ Stripe webhook receiver บน Cloud Run/Cloud Functions หรือ backend ที่ตรวจ signature แล้วค่อยเรียก Apps Script/API เพื่อยืนยัน booking. อย่าใส่ Stripe Secret Key ลงใน index.html

## Google Calendar
หลังยืนยันการชำระเงิน ระบบจะสร้าง Event ใน Google Calendar หลักของบัญชีที่เป็นเจ้าของ Apps Script อัตโนมัติ

## LINE
หน้าเว็บยังใช้ LINE OA เป็นช่องทางติดต่อ แต่ไม่ใช้ LINE เป็นตัวตรวจสลิป เพราะ Stripe เป็นตัวตรวจการชำระเงิน

## Member / Wallet
โครงสร้าง Customer ID, WEB_CUSTOMERS และ WEB_PETS ถูกเตรียมไว้ตั้งแต่ v1 เพื่อให้ต่อ Member/Wallet/Subscription ภายหลังได้โดยไม่ต้องสร้างฐานข้อมูลใหม่
