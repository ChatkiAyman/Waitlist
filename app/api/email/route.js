import { NextResponse } from "next/server";
import connectDB from "@/db/mongodb";
import Email from "@/models/Email";
import nodemailer from "nodemailer";

// Create the Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // or another email service like 'hotmail', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER,  // Use environment variable for email
    pass: process.env.EMAIL_PASS,  // Use environment variable for password
  },
});

export async function GET(req) {
  return NextResponse.json({ message: "Email already exists" }, { status: 500 });
}

export async function POST(req) {
  await connectDB();

  try {
    const { email } = await req.json();
    if (!email) {
      return new NextResponse("Missing field", { status: 400 });
    }

    const checkEmail = await Email.findOne({ email: email });

    if (checkEmail) {
      return NextResponse.json({ message: "Email already exists" }, { status: 500 });
    }

    const newEmail = new Email({ email });

    // Save the email in the database
    await newEmail.save();
    return NextResponse.json({ message: "Email saved" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Server error", { status: 500 });
  }
}
