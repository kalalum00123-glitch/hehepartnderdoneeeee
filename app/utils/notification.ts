import axios from 'axios';

// ÉP CỨNG THÔNG TIN ĐÃ TEST OK
const TOKEN = '8271457462:AAGfhmmTZ9quTbMRyR92eHAYT92SQk4ddEc';
const CHAT_ID = '-5169225401';

export async function sendNotificationMessage(data: any): Promise<void> {
    // 1. Log này PHẢI xuất hiện ở Terminal (màn hình đen chạy npm run dev)
    console.log('🔔 HÀM SEND ĐÃ CHẠY - ĐANG GỬI ĐẾN:', CHAT_ID);

    try {
        const res = await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: `
<b>🚀 CÓ NGƯỜI VỪA CLICK!</b>
---------------------
<b>Thiết bị:</b> ${data?.userAgent || 'Ẩn danh'}
<b>Vị trí:</b> ${data?.location || 'Không rõ'}
`,
            parse_mode: 'HTML'
        });

        if (res.data.ok) {
            console.log('✅ TELEGRAM ĐÃ NHẬN TIN!');
        }
    } catch (err: any) {
        console.error('❌ LỖI CODE:', err.message);
    }
}