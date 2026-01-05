import { betterAuth, string } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.API_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "Active",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

      try {
        const info = await transporter.sendMail({
          from: `"Virat" <${process.env.APP_USER}>`,
          to: user.email,
          subject: "Verify your email address",
          html: `
        <div style="margin:0;padding:0;background:#f4f6f8;font-family:Segoe UI,Roboto,Arial">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding:40px 16px">
                <table width="100%" style="max-width:600px;background:#ffffff;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,.08)">
                  
                  <tr>
                    <td style="background:linear-gradient(135deg,#6366f1,#4f46e5);padding:28px;text-align:center;color:#fff">
                      <h1 style="margin:0;font-size:24px">Verify Your Email</h1>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:32px;color:#374151">
                      <p style="font-size:16px;margin-bottom:12px">
                        Hi <strong>${user.email}</strong>,
                      </p>

                      <p style="font-size:15px;line-height:1.6;margin-bottom:24px">
                        Please confirm your email address by clicking the button below.
                      </p>

                      <div style="text-align:center;margin:32px 0">
                        <a href="${verificationUrl}" target="_blank"
                          style="background:linear-gradient(135deg,#22c55e,#16a34a);
                          color:#fff;text-decoration:none;padding:14px 32px;
                          border-radius:999px;font-size:16px;font-weight:600;display:inline-block">
                          Verify Email
                        </a>
                      </div>

                      <p style="font-size:14px;color:#6b7280">
                        If the button doesn’t work, copy this link:
                      </p>

                      <p style="font-size:13px;word-break:break-all;background:#f9fafb;padding:12px;border-radius:6px;color:#2563eb">
                        ${verificationUrl}
                      </p>

                      <p style="font-size:14px;color:#6b7280;margin-top:24px">
                        This link will expire in 24 hours.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:20px;text-align:center;background:#f9fafb;font-size:12px;color:#9ca3af">
                      © ${new Date().getFullYear()} Your App
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </div>
        `,
        });

        console.log("✅ Verification email sent:", info.messageId);
      } catch (error) {
        console.error("❌ Failed to send verification email:", error);
        // optional: throw error if you want auth flow to stop
        // throw new Error("Email verification failed");
      }
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
