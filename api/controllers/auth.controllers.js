import bcrypt from "bcryptjs";
import crypto from "crypto";
import { transporter } from "../lib/mail.js";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

// Email Format Validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Password Strength Validation
function validatePassword(password) {
  return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
}

// REGISTER ROUTE
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide username, email, and password." });
  }

  try {
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters, include one uppercase letter and one number",
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email or username already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        emailVerified: false,
        verificationToken,
        verificationTokenExpires,
        role: "user",
        chatIDs: [],
      },
    });

    const verificationLink = `http://${
      req.headers.host
    }/api/auth/verify-email?token=${verificationToken}&email=${encodeURIComponent(
      email
    )}`;

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Verify Your Email",
      text: `Hello ${username}, verify your email: ${verificationLink}`,
      html: `
        <h3>Hello, ${username}</h3>
        <p>Thanks for registering. Please verify your email by clicking the link below:</p>
        <a href="${verificationLink}">Verify Email</a>
      `,
    });

    return res
      .status(201)
      .json({ message: "User created! Please verify your email." });
  } catch (err) {
    console.error("Register Error:", err);
    return res
      .status(500)
      .json({ message: "Failed to register user!", error: err.message });
  }
};

// LOGIN ROUTE
export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide username and password." });
  }

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    if (!user.emailVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email first." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    if (!process.env.JWT_SECRET_KEY) {
      throw new Error("JWT_SECRET_KEY is missing from environment variables.");
    }

    const maxAge = 1000 * 60 * 60 * 24 * 30;

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: maxAge / 1000 }
    );

    const {
      password: pwd,
      verificationToken,
      verificationTokenExpires,
      ...userInfo
    } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      })
      .status(200)
      .json({ message: "Logged in successfully", user: userInfo });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// LOGOUT ROUTE
export const logout = (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })
    .status(200)
    .json({ message: "Logout Successful" });
};

// VERIFY EMAIL ROUTE
export const verifyEmail = async (req, res) => {
  const { token, email } = req.query;

  if (!token || !email) {
    return res.status(400).send(`
      <html>
        <body>
          <h1>Invalid verification link.</h1>
          <p>Please check your email link.</p>
        </body>
      </html>
    `);
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).send(`
        <html>
          <body>
            <h1>User not found!</h1>
            <p>Please check your email or contact support.</p>
          </body>
        </html>
      `);
    }

    if (
      user.emailVerified ||
      user.verificationToken !== token ||
      !user.verificationTokenExpires ||
      user.verificationTokenExpires < new Date()
    ) {
      return res.status(400).send(`
        <html>
          <body>
            <h1>Verification link is invalid or expired.</h1>
            <p>Please request a new verification email.</p>
          </body>
        </html>
      `);
    }

    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpires: null,
      },
    });

    res.status(200).send(`
      <html>
        <body>
          <h1>Email Verified Successfully!</h1>
          <p>Your email has been verified. You can now log in.</p>
        </body>
      </html>
    `);
  } catch (err) {
    console.error("Verification Error:", err);
    res.status(500).send(`
      <html>
        <body>
          <h1>Server Error</h1>
          <p>Failed to verify email.</p>
        </body>
      </html>
    `);
  }
};

// PASSWORD RESET REQUEST
export const requestPasswordReset = async (req, res) => {
  const { identifier, newPassword, confirmPassword } = req.body;

  if (!identifier || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    const user = await prisma.user.findFirst({
      where: {
        OR: isEmail ? [{ email: identifier }] : [{ username: identifier }],
      },
    });

    if (!user) {
      return res.status(404).json({
        message: isEmail
          ? `No account found with the email: ${identifier}`
          : `No account found with the username: ${identifier}`,
      });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationTokenExpires: tokenExpires,
        tempNewPassword: hashedPassword,
      },
    });

    const verifyLink = `http://${
      req.headers.host
    }/api/auth/password-reset-verify?token=${verificationToken}&email=${encodeURIComponent(
      user.email
    )}`;

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: user.email,
      subject: "Verify Password Change",
      html: `
        <h3>Hello, ${user.username}</h3>
        <p>You requested to change your password. Click below to verify:</p>
        <a href="${verifyLink}">Verify Password Change</a>
        <p>If you did not request this, ignore this email.</p>
      `,
    });

    res.status(200).json({ message: "Verification link sent to your email." });
  } catch (err) {
    console.error("Password Change Request Error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// VERIFY PASSWORD RESET TOKEN
export const verifyResetToken = async (req, res) => {
  const { token, email } = req.query;

  if (!token || !email) {
    return res.status(400).send(`
      <html><body>
        <h1>Invalid request</h1>
        <p>Token or email missing.</p>
      </body></html>
    `);
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (
      !user ||
      user.verificationToken !== token ||
      !user.verificationTokenExpires ||
      user.verificationTokenExpires < new Date()
    ) {
      return res.status(400).send(`
        <html><body>
          <h1>Invalid or expired token</h1>
          <p>Please request password change again.</p>
        </body></html>
      `);
    }

    if (!user.tempNewPassword) {
      return res.status(400).send(`
        <html><body>
          <h1>No pending password change found.</h1>
        </body></html>
      `);
    }

    await prisma.user.update({
      where: { email },
      data: {
        password: user.tempNewPassword,
        verificationToken: null,
        verificationTokenExpires: null,
        tempNewPassword: null,
      },
    });

    res.status(200).send(`
      <html><body>
        <h1>Password Changed Successfully!</h1>
        <p>You can now <a href="http://${req.headers.host}/api/auth/login">log in</a> with your new password.</p>
      </body></html>
    `);
  } catch (err) {
    console.error("Password Change Verification Error:", err);
    res.status(500).send(`
      <html><body>
        <h1>Server Error</h1>
        <p>Could not verify password change.</p>
      </body></html>
    `);
  }
};
