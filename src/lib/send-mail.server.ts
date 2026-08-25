import nodemailer from "nodemailer";

export async function sendGmailMail(opts: {
  from: string;
  to: string[];
  subject: string;
  text: string;
  replyTo?: string;
  user: string;
  pass: string;
}) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: opts.user,
      pass: opts.pass,
    },
  });

  return transporter.sendMail({
    from: opts.from,
    to: opts.to.join(", "),
    subject: opts.subject,
    text: opts.text,
    ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
  });
}
