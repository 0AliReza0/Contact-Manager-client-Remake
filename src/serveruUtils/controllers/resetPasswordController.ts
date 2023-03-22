import { NextApiRequest, NextApiResponse } from "next";

import resetPasswordValidation from "../validations/resetPasswordValidation";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import SMTPTransport from "nodemailer/lib/smtp-transport";

interface ResetPasswordRequest extends NextApiRequest {
  body: {
    email: string;
    url?: string;
  };
}

const resetPasswordController = async (
  req: ResetPasswordRequest,
  res: NextApiResponse
) => {
  const validatedBody = resetPasswordValidation.safeParse(req.body);

  if (!validatedBody.success) {
    res.status(400).json({ message: validatedBody.error.issues[0].message });
  }

  const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS!;

  let transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
  try {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD!,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "خطایی در سرور رخ داد!" });
  }

  const asignedToken = jwt.sign(
    {
      email: req.body.email,
      duty: "reset password",
    },
    process.env.JWT_RESET_PASSWORD_SECRET_KEY!,
    { expiresIn: "1h" }
  );

  const HTML = `<section style='direction: rtl; padding: 20px; background-color: #282a36'; color: #fff; border-radius: 25px;'>
    <center style='width: 100%;'>
      <img src='https://github.com/AlirezaAbd-dev/Contact-Manager-client-Remake/blob/c0778ce70666b60d3bb035469e40b5866e1c29d2/src/assets/contact-manager-logo.png?raw=true' alt='logo' width='100%' height='auto' />
    </center>
    <h1 style='text-align: center; font-weight: bold;'>
      سلام کاربر عزیز 🌹
    </h1>
    <br />
    <h3>
      از این که وبسایت ما را برای ذخیره مخاطبین خود انتخاب کرده اید بسیار سپاس گذاریم 🙏🙏
    </h3>
    <p>
      برای تغییر رمز عبور خود فقط کافیست روی دکمه ی زیر کلیک کنید و رمز جدید خود را وارد نمایید 👇👇
    </p>
    <br />
    <center>
      <a href='${
        req.body.url + "/" + asignedToken
      }' style='padding: 7px 15px 7px 15px; border-radius: 20px; background-color: #BD93F9; color: #000; font-size: 18px; font-weight: bold;'>
        تغییر رمز عبور
      </a>
    </center>
  </section>`;

  let mailOptions = {
    from: EMAIL_ADDRESS,
    to: req.body.email,
    subject: "تغییر رمز عبور",
    html: HTML,
  };

  transporter.sendMail(mailOptions, (err, _info) => {
    if (err) {
      console.log(err.message);

      return res.status(500).json({ message: "ارسال ایمیل با خطا مواجه شد!" });
    }
    return res.status(200).send({ message: "ایمیل با موفقیت ارسال شد" });
  });
};

export default resetPasswordController;
