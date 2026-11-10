export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { phone } = req.body;
  if (!phone || !/^[0-9]{10}$/.test(phone)) {
    return res.status(400).json({ success: false, message: 'Invalid 10-digit phone number' });
  }

  // 4-digit OTP सर्वर पर सुरक्षित रूप से बन रहा है
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  const idInstance = process.env.GREEN_API_ID_INSTANCE;
  const apiToken = process.env.GREEN_API_TOKEN;

  const greenApiUrl = `https://7107.api.greenapi.com/waInstance${idInstance}/sendMessage/${apiToken}`;
  const messageText = `✨ *VEKU COLLECTIONS*\n\nAapka login verification code hai: *${otp}*\n\nYeh code kisi ke sath share na karein. Valid for 10 minutes.`;

  try {
    const waResponse = await fetch(greenApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatId: `91${phone}@c.us`,
        message: messageText
      })
    });

    const waData = await waResponse.json();

    if (waData.idMessage) {
      return res.status(200).json({ 
        success: true, 
        message: 'OTP sent successfully', 
        generatedOtp: otp 
      });
    } else {
      return res.status(500).json({ success: false, message: 'WhatsApp message delivery failed' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
