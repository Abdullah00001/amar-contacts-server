export const verificationEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>OTP Verification</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
    }

    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      padding: 30px;
    }

    .email-header {
      font-size: 22px;
      font-weight: 600;
      text-align: center;
      color: #202124;
      margin-bottom: 30px;
    }

    .otp-code {
      font-size: 36px;
      font-weight: 700;
      color: #1a73e8;
      text-align: center;
      margin: 20px 0;
      letter-spacing: 2px;
    }

    .email-body {
      font-size: 16px;
      color: #3c4043;
      line-height: 1.5;
      margin-bottom: 30px;
    }

    .email-body p {
      margin: 12px 0;
    }

    .footer {
      font-size: 14px;
      color: #5f6368;
      text-align: center;
      border-top: 1px solid #e0e0e0;
      padding-top: 20px;
    }

    .footer a {
      color: #1a73e8;
      text-decoration: none;
    }

    .footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      Verify Your Amar Contacts Account
    </div>

    <div class="email-body">
      <p>Hello {{name}},</p>
      <p>Thank you for signing up to Amar Contacts. Please use the OTP below to verify your email:</p>

      <div class="otp-code">
        {{otp}}
      </div>

      <p>This OTP is valid for {{expirationTime}} minutes. Please keep it confidential.</p>
      <p>If you didn’t request this, you can safely ignore this email.</p>
    </div>

    <div class="footer">
      <p>&copy; Amar Contacts. All rights reserved.</p>
      <p><a href="https://amar-contacts.vercel.app/">Visit</a></p>
    </div>
  </div>
</body>
</html>
`;
