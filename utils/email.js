const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { FRONTEND_URL, BACKEND_URL } = require('../config/url');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.PASSWORD,
  },
});

const getMailingConfigurations = (toEmail, subject, text) => {
  const mailConfigurations = {
    // It should be a string of sender/server email
    from: process.env.EMAIL_USERNAME,

    to: toEmail,

    // Subject of Email
    subject: subject,

    // This would be the text of email body
    html: text,
  };

  return mailConfigurations;
};

exports.sendVerificationEmail = (userId, userEmail) => {
  const token = jwt.sign(
    {
      id: userId,
    },
    process.env.EMAIL_VERIFICATION_SECRET,
    { expiresIn: '10d' }
  );

  const mailSubject = 'Conferencify Email Verification';
  // const mailText = `Hi! There, You have recently visited
  //                       our website and entered your email.
  //                       Please follow the given link to verify your email
  //                       http://localhost:4500/verify/${token}
  //                       Thanks`;

  const mailText = `<!DOCTYPE html>
  <html>
  <head>
  
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Email Confirmation</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
    /**
     * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
     */
    @media screen {
      @font-face {
        font-family: 'Source Sans Pro';
        font-style: normal;
        font-weight: 400;
        src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
      }
      @font-face {
        font-family: 'Source Sans Pro';
        font-style: normal;
        font-weight: 700;
        src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
      }
    }
    /**
     * Avoid browser level font resizing.
     * 1. Windows Mobile
     * 2. iOS / OSX
     */
    body,
    table,
    td,
    a {
      -ms-text-size-adjust: 100%; /* 1 */
      -webkit-text-size-adjust: 100%; /* 2 */
    }
    /**
     * Remove extra space added to tables and cells in Outlook.
     */
    table,
    td {
      mso-table-rspace: 0pt;
      mso-table-lspace: 0pt;
    }
    /**
     * Better fluid images in Internet Explorer.
     */
    img {
      -ms-interpolation-mode: bicubic;
    }
    /**
     * Remove blue links for iOS devices.
     */
    a[x-apple-data-detectors] {
      font-family: inherit !important;
      font-size: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
      color: inherit !important;
      text-decoration: none !important;
    }
    /**
     * Fix centering issues in Android 4.4.
     */
    div[style*="margin: 16px 0;"] {
      margin: 0 !important;
    }
    body {
      width: 100% !important;
      height: 100% !important;
      padding: 0 !important;
      margin: 0 !important;
    }
    /**
     * Collapse table borders to avoid space between cells.
     */
    table {
      border-collapse: collapse !important;
    }
    a {
      color: #1a82e2;
    }
    img {
      height: auto;
      line-height: 100%;
      text-decoration: none;
      border: 0;
      outline: none;
    }
    </style>
  
  </head>
  <body style="background-color: #e9ecef;">
  
    <!-- start preheader -->
    <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
      A preheader is the short summary text that follows the subject line when an email is viewed in the inbox.
    </div>
    <!-- end preheader -->
  
    <!-- start body -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
  
      <!-- start hero -->
      <tr>
        <td align="center" bgcolor="#e9ecef">
          <!--[if (gte mso 9)|(IE)]>
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
          <tr>
          <td align="center" valign="top" width="600">
          <![endif]-->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
            <tr>
              <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Confirm Your Email Address</h1>
              </td>
            </tr>
          </table>
          <!--[if (gte mso 9)|(IE)]>
          </td>
          </tr>
          </table>
          <![endif]-->
        </td>
      </tr>
      <!-- end hero -->
  
      <!-- start copy block -->
      <tr>
        <td align="center" bgcolor="#e9ecef">
          <!--[if (gte mso 9)|(IE)]>
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
          <tr>
          <td align="center" valign="top" width="600">
          <![endif]-->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
  
            <!-- start copy -->
            <tr>
              <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                <p style="margin: 0;">Tap the button below to confirm your email address. If you didn't create an account with <a href="${FRONTEND_URL}">Conferencify</a>, you can safely delete this email.</p>
              </td>
            </tr>
            <!-- end copy -->
  
            <!-- start button -->
            <tr>
              <td align="left" bgcolor="#ffffff">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                      <table border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                            <a href="${BACKEND_URL}/verify/${token}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Verify Email</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- end button -->
  
            <!-- start copy -->
            <tr>
              <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
                <p style="margin: 0;"><a href="${BACKEND_URL}/verify/${token}" target="_blank">${BACKEND_URL}/verify/${token}</a></p>
              </td>
            </tr>
            <!-- end copy -->
  
            <!-- start copy -->
            <tr>
              <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                <p style="margin: 0;">Cheers,<br> Team Conferencify</p>
              </td>
            </tr>
            <!-- end copy -->
  
          </table>
          <!--[if (gte mso 9)|(IE)]>
          </td>
          </tr>
          </table>
          <![endif]-->
        </td>
      </tr>
      <!-- end copy block -->
  
      <!-- start footer -->
      <tr>
        <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
          <!--[if (gte mso 9)|(IE)]>
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
          <tr>
          <td align="center" valign="top" width="600">
          <![endif]-->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
  
            <!-- start permission -->
            <tr>
              <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                <p style="margin: 0;">You received this email because we received a request for registration for your account. If you didn't request to register you can safely delete this email.</p>
              </td>
            </tr>
            <!-- end permission -->
  
            <!-- start unsubscribe -->
            <tr>
              <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                
                <p style="margin: 0;">&#169; Conferencify</p>
              </td>
            </tr>
            <!-- end unsubscribe -->
  
          </table>
          <!--[if (gte mso 9)|(IE)]>
          </td>
          </tr>
          </table>
          <![endif]-->
        </td>
      </tr>
      <!-- end footer -->
  
    </table>
    <!-- end body -->
  
  </body>
  </html>`;
  const mailConfigurations = getMailingConfigurations(
    userEmail,
    mailSubject,
    mailText
  );
  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) throw Error(error);
    console.log('Email Sent Successfully');
  });
};

exports.sendUserEmail = async (
  userEmail,
  mailSubject,
  MailBody,
  AUTHOR,
  conferenceName,
  PAPER_ID,
  PAPER_TITLE
) => {
  let mailText = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Static Template</title>
    </head>
    <body>
      <table style="margin: 0 auto; border-spacing: 0; font-family: Arial; font-size: 15px; width: 600px; color: #404040">
        <tbody style="background: #1b334f;">
          <tr>
            <td style="padding-top: 20px; padding-bottom: 10px; padding-left: 35px;">
              <!-- <img height="40"
                src="https://lubemonitor-tst.azurewebsites.net/static/media/appBanner.aaa19c1b.png"> -->
            </td>
              </td>
           
            
          </tr>
          <tr>
            <td colspan="2" style="padding: 35px; padding-top: 10px; padding-bottom: 20px;">
              <p
                style="margin: 0; line-height: 25px; background: #fff; border-radius: 3px;">
                <span style="padding: 20px 30px; display: block; border-bottom: 2px solid #fff8e8;">
                <span style="padding: 20px 30px; display: block;">
                
                <span style="display: inline-block; line-height: 22px;">
                        ${MailBody}
                    </span>
                  
                  <br />
                  <span style="display: inline-block; margin-top: 20px; line-height: 22px;">
                  </span> 
                </span>
              </p>
           </td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 0 35px 20px; font-size: 12px; color: #c5b99d; line-height: 17px;" align="center">
            The material in this email may be confidential, privileged and/or protected by copyright.<br />Use of this email should be limited accordingly. If this email has been sent to you in error, please contact us immediately.
            </td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>
  `;

  for (let i = 0; i < 10; i++) {
    mailText = mailText
      .replace('${PAPER_ID}', PAPER_ID)
      .replace('${AUTHOR}', AUTHOR)
      .replace('${PAPER_TITLE}', PAPER_TITLE)
      .replace('${n}', '<br></br>');
  }
  const mailConfigurations = getMailingConfigurations(
    userEmail,
    mailSubject,
    mailText
  );
  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) throw Error(error);
    console.log('Email Sent Successfully');
  });
};
