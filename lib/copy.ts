export const DISCLAIMER =
  "FixProof provides a record of available inspection and repair information. It does not guarantee ownership, safety, future performance or the absence of hidden defects.";

export const PARTNER_HISTORY_NOTE =
  "This history is based on information recorded by participating partners. It is not an independent certification of every physical claim.";

export const PROTECTION_NOTE =
  "FixProof uses an append-only audit approach in this prototype. Production deployment would require independent security testing, secure key management and formal compliance review.";

export const SAMPLE_NOTE =
  "Sample demonstration record. Device identifiers, partners, technicians and evidence in this prototype are fictional.";

export const STORAGE_NOTE =
  "Uploaded files in this prototype stay in your browser as local previews. A production deployment would use access-controlled object storage.";

export const OPERATING_BASE = {
  lines: [
    "10/16, 3rd Lane",
    "Eksath Mawatha, Mahara",
    "Kadawatha, Western 11850",
    "Sri Lanka",
  ],
  single:
    "10/16, 3rd Lane, Eksath Mawatha, Mahara, Kadawatha, Western 11850, Sri Lanka",
};

export const TEAM = [
  {
    name: "Sarah",
    role: "Founder",
    focus: "Business strategy and partnerships.",
  },
  {
    name: "Chanodya",
    role: "Product technology",
    focus: "Platform development and security.",
  },
  {
    name: "Shamiq",
    role: "Operations",
    focus: "Quality assurance, partner onboarding and audits.",
  },
  {
    name: "Himasha",
    role: "Finance and relationships",
    focus:
      "Finance, compliance, marketing, customer relations and dealer relationships.",
  },
] as const;

export const PILOT_TARGETS = [
  { label: "Repair centres", value: "3", note: "Planning target" },
  { label: "Used-phone dealers", value: "2", note: "Planning target" },
  { label: "Device passports", value: "100", note: "Planning target" },
  { label: "Buyer scan rate", value: "80%", note: "Pilot target" },
  { label: "Correction rate", value: "Below 5%", note: "Pilot target" },
  {
    label: "Paying continuations",
    value: "At least 3",
    note: "Planning target",
  },
] as const;
