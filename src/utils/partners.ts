// Business partners with read-only access to Monthly Summary and Finance → Overview.
// Keep in sync with isPartner() in firestore.rules — both lists must match.
export const PARTNER_EMAILS = [
  'robptomlin@gmail.com', // Rob
  'chrisjudges1@live.co.uk', // Chris Judges
  'jay.mac80@icloud.com', // Jason Mckeating
  'weightman17@googlemail.com', // Leon Weightman
];

export function isPartnerEmail(email?: string | null): boolean {
  return !!email && PARTNER_EMAILS.includes(email.toLowerCase());
}
