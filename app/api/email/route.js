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
    const email = await req.json();
    if (!email) {
      return new NextResponse("Missing field", { status: 400 });
    }

    const checkEmail = await Email.findOne({ email: email });

    if (checkEmail) {
      return NextResponse.json({ message: "Email already exists" }, { status: 500 });
    }

    const newEmail = new Email({ email });

    // Send a confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER, // sender address
      to: email, // list of receivers
      subject: "Confirmation Email", // Subject line
      text: "Thank you for joining the waitlist!", // plain text body
      html: "<h1>Thank you for joining the waitlist!</h1>", // html body
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    // Save the email in the database
    return NextResponse.json(await newEmail.save(), { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Server error", { status: 500 });
  }
}
