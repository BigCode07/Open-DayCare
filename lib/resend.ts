import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInvitationEmail({
  to,
  parentName,
  childName,
  code,
}: {
  to: string;
  parentName: string;
  childName: string;
  code: string;
}) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const activateUrl = `${baseUrl}/activate`;

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject: `${parentName}, te invitaron a seguir a ${childName} en OpenDayCare`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#3F362E">
        <h1 style="font-size:22px;color:#8A7234">OpenDayCare</h1>
        <p>Hola ${parentName},</p>
        <p>Te invitaron a seguir el día de <strong>${childName}</strong> en la guardería.</p>
        <p>Usá este código para activar tu cuenta:</p>
        <p style="font-size:34px;font-weight:800;letter-spacing:7px;color:#8A7234;margin:16px 0">
          ${code}
        </p>
        <p>El código expira en 7 días.</p>
        <p>
          <a href="${activateUrl}" style="display:inline-block;padding:12px 22px;background:#EE8164;color:#fff;text-decoration:none;border-radius:12px;font-weight:700">
            Activar mi cuenta
          </a>
        </p>
        <p style="color:#8A7C6D;font-size:12px;margin-top:24px">
          Si no esperabas esta invitación, podés ignorar este correo.
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(`Resend send failed: ${error.message}`);
  }
}
