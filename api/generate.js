/*
 * CẬP NHẬT FILE NÀY ĐỂ CHẨN ĐOÁN LỖI
 */

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // --- BẮT ĐẦU PHẦN CHẨN ĐOÁN LỖI ---
    if (!apiKey) {
        console.error('LỖI CHẨN ĐOÁN: Không tìm thấy biến môi trường GEMINI_API_KEY.');
        return res.status(500).json({ error: 'Lỗi cấu hình máy chủ: Thiếu API key.' });
    } else {
        // Log 4 ký tự cuối của key để xác nhận. Ví dụ: "...1a2b"
        console.log(`ĐÃ TÌM THẤY KEY. 4 KÝ TỰ CUỐI: ...${apiKey.slice(-4)}`);
    }
    // --- KẾT THÚC PHẦN CHẨN ĐOÁN LỖI ---

    const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    const clientPayload = req.body;

    try {
        const googleResponse = await fetch(googleApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientPayload),
        });

        const data = await googleResponse.json();

        if (!googleResponse.ok) {
            console.error('LỖI CHẨN ĐOÁN: Google API trả về lỗi:', data);
            return res.status(googleResponse.status).json(data);
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error('LỖI CHẨN ĐOÁN: Lỗi máy chủ nội bộ (serverless function):', error);
        return res.status(500).json({ error: 'Lỗi máy chủ nội bộ khi gọi Google API.' });
    }
}