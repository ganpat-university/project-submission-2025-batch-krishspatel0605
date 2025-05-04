export const registrationEmailTemplate = (otp, token) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; color: #333;">
      <h2 style="color: #4CAF50; margin-top: 0;">Welcome to Gigster!</h2>

      <p>Hi there 👋,</p>
      <p>Thanks for registering with us! To activate your account, please use the OTP below and visit the verification page.</p>

      <!-- OTP Section -->
      <p style="font-size: 1.3em; font-weight: bold; letter-spacing: 1px; background: #e8f5e9; 
                padding: 10px 15px; border-radius: 5px; display: inline-block;">
        🔐 OTP: ${otp}
      </p>

      <!-- Verification Link -->
      <p style="margin-top: 25px;">
        Click the button below to go to the verification page and enter your OTP:
      </p>

      <a href="http://localhost:5173/verify/${token}" 
         style="display: inline-block; margin: 15px 0; padding: 12px 20px; background-color: #4CAF50; 
                color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
        ✅ Go to Verification Page
      </a>

      <!-- Raw Link Fallback -->
      <p>If the button above doesn't work, copy and paste this link in your browser:</p>
      <p style="word-break: break-all;">
        <a href="http://localhost:5173/verify/${token}">
          http://localhost:5173/verify/${token}
        </a>
      </p>

      <p style="margin-top: 25px; color: #777;">This OTP and link will expire in 10 minutes.</p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
      <p style="font-size: 0.9em; color: #999;">If you didn’t request this, feel free to ignore this email.</p>

      <p style="margin-top: 30px;">Cheers,<br>The Gigster Team 🚀</p>
    </div>
  `;
};
  
export const loginEmailTemplate = (otp) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; color: #333;">
      <h2 style="color: #2196F3;">Gigster Login OTP</h2>
      <p>Thanks for requesting a login OTP. Please use the OTP below to log in to your account.</p>

      <!-- OTP Section -->
      <p style="font-size: 1.3em; font-weight: bold; letter-spacing: 1px; background: #e8f5e9; 
                padding: 10px 15px; border-radius: 5px; display: inline-block;">
        🔐 OTP: ${otp}
      </p>

      <p style="margin-top: 25px; color: #777;">This OTP will expire in 10 minutes.</p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
      <p style="font-size: 0.9em; color: #999;">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;
};


export const resendRegistrationOTPTemplate = (otp, token) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #fff3cd; color: #333;">
      <h2 style="color: #856404;">Gigster - Resend Verification OTP</h2>
      <p>You requested a new OTP for registration. Use the updated OTP or click the link below to verify your account:</p>

      <!-- OTP Section -->
      <p style="font-size: 1.3em; font-weight: bold; letter-spacing: 1px; background: #fef9c3; 
                padding: 10px 15px; border-radius: 5px; display: inline-block;">
        🔐 OTP: ${otp}
      </p>

      <!-- Verification Link -->
      <a href="http://localhost:5173/verify/${token}" 
         style="display: inline-block; margin: 15px 0; padding: 12px 20px; background-color: #856404; 
                color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
        ✅ Go to Verification Page
      </a>

      <p style="margin-top: 25px; color: #777;">This OTP and link will expire in 10 minutes.</p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
      <p style="font-size: 0.9em; color: #999;">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;
};
  
export const resendLoginOTPTemplate = (otp) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #fff3cd; color: #333;">
      <h2 style="color: #856404;">Gigster - Resend Login OTP</h2>
      <p>You requested a new OTP for login. Please use the updated OTP below to access your account:</p>

      <!-- OTP Section -->
      <p style="font-size: 1.3em; font-weight: bold; letter-spacing: 1px; background: #fef9c3; 
                padding: 10px 15px; border-radius: 5px; display: inline-block;">
        🔐 OTP: ${otp}
      </p>

      <p style="margin-top: 25px; color: #777;">This OTP will expire in 10 minutes.</p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
      <p style="font-size: 0.9em; color: #999;">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;
};
