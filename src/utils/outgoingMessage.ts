const GRADE_LABELS: Record<string, string> = {
  toddler: "Toddler",
  "nursery-one": "Nursery 1",
  "nursery-two": "Nursery 2",
  "Nursery-three": "Nursery 3",
  "primary-one": "Primary 1",
};

const LOGO_URL = "https://i.imgur.com/nTGCwgK.png";

/* =============================================================================
   STUDENT PORTAL CREDENTIALS EMAIL
   Sent once, right after a Student ID and temporary password are generated
   for a newly registered student. Reuses the same header/footer/accent-bar
   shell as buildAdmissionNotificationEmail so it reads as the same email
   family, with the middle section replaced entirely.
   ============================================================================= */
export function buildStudentCredentialsEmail(params: {
  data: any; // same shape as buildAdmissionNotificationEmail's `data`
  studentId: string;
  temporaryPassword: string;
  portalUrl: string;
}): { subject: string; html: string; text: string } {
  const { data, studentId, temporaryPassword, portalUrl } = params;

  const studentFullName = [data.student.firstName, data.student.middleName, data.student.lastName]
    .filter(Boolean)
    .join(" ");
  const trackLabel = data.program.track === "montessori" ? "Montessori" : "Upper School";
  const gradeLabel = GRADE_LABELS[data.program.grade] ?? data.program.grade;
  const guardianFirstName = (data.guardian1.name || "").split(" ")[0] || "there";

  const subject = `${studentFullName}'s Student Portal Login \u2014 Tower Preparatory Academy`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="color-scheme" content="light" />
<title>${subject}</title>
<style>
  body, table, td { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  img { border: 0; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
  body { margin: 0; padding: 0; width: 100% !important; background-color: #F2F2F5; }
  a { text-decoration: none; }
  @media only screen and (max-width: 600px) {
    .tpa-mail-container { width: 100% !important; }
    .tpa-mail-pad { padding-left: 20px !important; padding-right: 20px !important; }
    .tpa-mail-stack { display: block !important; width: 100% !important; }
  }
</style>
</head>
<body style="margin:0; padding:0; background-color:#F2F2F5;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
    ${studentFullName}'s Student Portal account is ready \u2014 log in with the Student ID and password below.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F2F2F5;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" class="tpa-mail-container" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px; background-color:#FFFFFF; border-radius:16px; overflow:hidden; box-shadow: 0 12px 32px rgba(17,17,17,0.08);">

          <!-- Accent bar -->
          <tr>
            <td style="height:5px; background-color:#D6336C; line-height:5px; font-size:0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td class="tpa-mail-pad" style="padding: 32px 40px 24px 40px; background-color:#17181C;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#FFFFFF; font-size:14px; letter-spacing:0.08em; text-transform:uppercase; font-weight:600;">
                    Tower Preparatory Academy
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:6px; font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#9A9BA3; font-size:13px;">
                    Student Portal Access
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Title block -->
          <tr>
            <td class="tpa-mail-pad" style="padding: 32px 40px 8px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#111114; font-size:22px; font-weight:700; line-height:1.3;">
                    ${studentFullName}'s portal account is ready
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:6px; font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#6B6C74; font-size:14px; line-height:1.6;">
                    Hi ${guardianFirstName}, use the credentials below to sign in to the Student Portal for ${trackLabel} \u2014 ${gradeLabel}.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Credentials card -->
          <tr>
            <td class="tpa-mail-pad" style="padding: 20px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAFAFB; border:1px solid #EDEDF0; border-radius:14px;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <div style="font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#9A9BA3; font-size:11px; letter-spacing:0.04em; text-transform:uppercase; font-weight:600;">Student ID</div>
                    <div style="font-family: 'SFMono-Regular', Consolas, Menlo, monospace; color:#111114; font-size:22px; font-weight:700; letter-spacing:0.03em; padding-top:4px;">${studentId}</div>
                  </td>
                </tr>
                <tr>
                  <td style="border-top:1px solid #EDEDF0; padding: 20px 24px;">
                    <div style="font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#9A9BA3; font-size:11px; letter-spacing:0.04em; text-transform:uppercase; font-weight:600;">Password</div>
                    <div style="font-family: 'SFMono-Regular', Consolas, Menlo, monospace; color:#111114; font-size:22px; font-weight:700; letter-spacing:0.03em; padding-top:4px;">${temporaryPassword}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Security notice -->
          <tr>
            <td class="tpa-mail-pad" style="padding: 16px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FCE7F1; border-radius:12px;">
                <tr>
                  <td style="padding: 14px 18px; font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#9D2159; font-size:13px; line-height:1.6;">
                    For ${data.student.firstName}'s security, please keep this password confidential. This email is the only place it will be shown.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td class="tpa-mail-pad" align="center" style="padding: 28px 40px 8px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="border-radius:12px; background-color:#111114;">
                    <a href="${portalUrl}" target="_blank" style="display:inline-block; padding:15px 32px; font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; font-size:15px; font-weight:700; color:#FFFFFF; letter-spacing:0.01em;">
                      Log In to Student Portal &nbsp;\u2192
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 10px 40px 0 40px;">
              <div style="font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#B3B4BB; font-size:12px;">
                Having trouble logging in? Contact toweradmissionscentre@gmail.com for help.
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="tpa-mail-pad" style="padding: 32px 40px 28px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #EDEDF0;">
                <tr>
                  <td align="center" style="padding-top:24px;">
                    <img src="${LOGO_URL}" width="48" height="48" alt="Tower Preparatory Academy" style="display:block; width:48px; height:48px; border-radius:50%;" />
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:14px; font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#B3B4BB; font-size:12px; line-height:1.6; text-align:center;">
                    This is an automated message from the Tower Preparatory Academy admissions system.<br />
                    Please do not reply directly to this email.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    `${studentFullName}'s Student Portal account is ready`,
    ``,
    `Student ID: ${studentId}`,
    `Temporary Password: ${temporaryPassword}`,
    ``,
    `For ${data.student.firstName}'s security, please keep this password confidential`,
    `and change it after your first login. This email is the only place it will be shown.`,
    ``,
    `Log in: ${portalUrl}`,
  ].join("\n");

  return { subject, html, text };
}