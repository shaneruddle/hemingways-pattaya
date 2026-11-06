// Business partners with read-only access to Monthly Summary and Finance → Overview.
// Keep in sync with isPartner() in firestore.rules — both lists must match.
export const PARTNER_EMAILS = [
  'robptomlin@gmail.com', // Rob
  'chrisjudges1@live.co.uk', // Chris Judges
  'jay.mac80@icloud.com', // Jason Mckeating
  'weightman17@googlemail.com', // Leon Weightman
];

// Shareholding used to split every dividend payout (Monthly Summary → Dividends, and
// the period reports). Must add up to 100.
export const DIVIDEND_SHARES: { name: string; pct: number }[] = [
  { name: 'Shane', pct: 29 },
  { name: 'Rob', pct: 22 },
  { name: 'Joy', pct: 19 },
  { name: 'Leon', pct: 10 },
  { name: 'Jay', pct: 10 },
  { name: 'Chris', pct: 10 },
];

export function isPartnerEmail(email?: string | null): boolean {
  return !!email && PARTNER_EMAILS.includes(email.toLowerCase());
}
