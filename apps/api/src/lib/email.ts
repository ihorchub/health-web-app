/** MVP: no outbound email — log verify link in dev for registration step 2. */
export function sendVerificationEmail(params: {
  email: string;
  registrationId: string;
  token: string;
  log: { info: (obj: unknown, msg?: string) => void };
}): void {
  params.log.info(
    {
      email: params.email,
      registrationId: params.registrationId,
      verifyToken: params.token,
    },
    "Registration email verify (dev — no mailer)",
  );
}
