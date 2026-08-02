/* =============================================================================
   Admission notification email — sent to the Tower Admissions inbox the
   moment an application is successfully saved.

   Design: neutral greyscale card on a soft grey field, with a single pink
   accent (bar, badges, button) so the one thing that matters — "go look at
   this application" — is the only splash of colour on the page.

   Only the fields an admissions reviewer needs to triage/reply are surfaced
   here (applicant identity, program, primary guardian contact). Everything
   else — medical info, consent, uploads, Montessori essay answers — lives
   behind the "View Application" button, not in the inbox.
   ============================================================================= */

// export type AdmissionMailData = {
//   program: {
//     academicYear: string;
//     admissionType: string;
//     track: string;
//     grade: string;
//   };
//   student: {
//     firstName: string;
//     middleName: string;
//     lastName: string;
//     dob: string;
//     gender: string;
//     primaryLanguage: string;
//     address: { street: string; city: string; state: string; postalCode: string };
//     previousSchool: string;
//   };
//   guardian1: {
//     relation: string;
//     name: string;
//     phone: string;
//     email: string;
//     occupation: string;
//   };
//   guardian2: {
//     relation: string;
//     name: string;
//     phone: string;
//     email: string;
//     occupation: string;
//   };
// };

const GRADE_LABELS: Record<string, string> = {
  toddler: "Toddler",
  "nursery-one": "Nursery 1",
  "nursery-two": "Nursery 2",
  "Nursery-three": "Nursery 3",
  "primary-one": "Primary 1",
};

const capitalize = (v: string) => (v ? v.charAt(0).toUpperCase() + v.slice(1) : "");

function formatSubmittedAt(date: Date): string {
  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function buildAdmissionNotificationEmail(params: {
  data: any;
  applicationId: string;
  reviewUrl: string;
  submittedAt?: Date;
}): { subject: string; html: string; text: string } {
  const { data, applicationId, reviewUrl, submittedAt = new Date() } = params;

  const studentFullName = [data.student.firstName, data.student.middleName, data.student.lastName]
    .filter(Boolean)
    .join(" ");

  const trackLabel = data.program.track === "montessori" ? "Montessori" : "Primary School";
  const gradeLabel = GRADE_LABELS[data.program.grade] ?? data.program.grade;
  const admissionTypeLabel = data.program.admissionType === "new" ? "New Student" : "Returning Student";
  const submittedLabel = formatSubmittedAt(submittedAt);
  const shortRef = applicationId.slice(0, 8).toUpperCase();

  const subject = `New Admission: ${studentFullName} \u2014 ${trackLabel}, ${gradeLabel}`;

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
    ${studentFullName} just submitted an admission application for ${trackLabel} \u2013 ${gradeLabel}.
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
                    Admissions Notification
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
                    New application received
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:6px; font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#6B6C74; font-size:14px; line-height:1.6;">
                    Submitted ${submittedLabel} \u2022 Ref #${shortRef}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Applicant card -->
          <tr>
            <td class="tpa-mail-pad" style="padding: 20px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAFAFB; border:1px solid #EDEDF0; border-radius:14px;">
                <tr>
                  <td style="padding: 22px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#111114; font-size:18px; font-weight:700;">
                          ${studentFullName}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top:10px;">
                          <table role="presentation" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="background-color:#FCE7F1; color:#D6336C; font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; font-size:12px; font-weight:700; padding:5px 12px; border-radius:999px;">
                                ${trackLabel}
                              </td>
                              <td style="width:8px;">&nbsp;</td>
                              <td style="background-color:#EFEFF2; color:#4C4D55; font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; font-size:12px; font-weight:700; padding:5px 12px; border-radius:999px;">
                                ${gradeLabel}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="border-top:1px solid #EDEDF0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td class="tpa-mail-stack" width="50%" style="padding: 16px 24px; vertical-align:top;">
                          <div style="font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#9A9BA3; font-size:11px; letter-spacing:0.04em; text-transform:uppercase; font-weight:600;">Academic Year</div>
                          <div style="font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#111114; font-size:14px; font-weight:600; padding-top:4px;">${data.program.academicYear}</div>
                        </td>
                        <td class="tpa-mail-stack" width="50%" style="padding: 16px 24px; vertical-align:top;">
                          <div style="font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#9A9BA3; font-size:11px; letter-spacing:0.04em; text-transform:uppercase; font-weight:600;">Admission Type</div>
                          <div style="font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#111114; font-size:14px; font-weight:600; padding-top:4px;">${admissionTypeLabel}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Primary guardian -->
          <tr>
            <td class="tpa-mail-pad" style="padding: 20px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#111114; font-size:13px; font-weight:700; padding-bottom:10px;">
                    Primary Guardian
                  </td>
                </tr>
                <tr>
                  <td style="border-left:2px solid #D6336C; padding: 2px 0 2px 16px;">
                    <div style="font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#111114; font-size:15px; font-weight:600;">
                      ${data.guardian1.name} <span style="color:#9A9BA3; font-weight:500;">\u00b7 ${data.guardian1.relation}</span>
                    </div>
                    <div style="font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#4C4D55; font-size:14px; padding-top:4px;">
                      <a href="mailto:${data.guardian1.email}" style="color:#4C4D55;">${data.guardian1.email}</a> &nbsp;\u2022&nbsp; <a href="tel:${data.guardian1.phone}" style="color:#4C4D55;">${data.guardian1.phone}</a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td class="tpa-mail-pad" align="center" style="padding: 32px 40px 8px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="border-radius:12px; background-color:#111114;">
                    <a href="${reviewUrl}" target="_blank" style="display:inline-block; padding:15px 32px; font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; font-size:15px; font-weight:700; color:#FFFFFF; letter-spacing:0.01em;">
                      View Application &nbsp;\u2192
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 10px 40px 0 40px;">
              <div style="font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#B3B4BB; font-size:12px;">
                Reference #${shortRef}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="tpa-mail-pad" style="padding: 32px 40px 28px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #EDEDF0;">
                <tr>
                  <td align="center" style="padding-top:24px;">
                    <img src="https://i.imgur.com/nTGCwgK.png" width="48" height="48" alt="Tower Preparatory Academy" style="display:block; width:48px; height:48px; border-radius:10px;" />
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:14px; font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#B3B4BB; font-size:12px; line-height:1.6; text-align:center;">
                    This is an automated notification from the Tower Preparatory Academy admissions system.<br />
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
    `New admission application received`,
    ``,
    `Student: ${studentFullName}`,
    `Track: ${trackLabel} \u2014 ${gradeLabel}`,
    `Academic Year: ${data.program.academicYear}`,
    `Admission Type: ${admissionTypeLabel}`,
    ``,
    `Primary Guardian: ${data.guardian1.name} (${data.guardian1.relation})`,
    `Email: ${data.guardian1.email}`,
    `Phone: ${data.guardian1.phone}`,
    ``,
    `Reference #${shortRef} \u2014 Submitted ${submittedLabel}`,
    `View full application: ${reviewUrl}`,
  ].join("\n");

  return { subject, html, text };
}