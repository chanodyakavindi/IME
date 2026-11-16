import { z } from "zod";

const checklist = z.enum(["passed", "needs_attention", "not_tested", "not_recorded"]);
const part = z.enum(["original", "replaced", "unknown"]);

export const identitySchema = z.object({
  brand: z.string().trim().min(2, "Enter the device brand.").max(40),
  model: z.string().trim().min(2, "Enter the device model.").max(60),
  category: z.string().trim().min(2, "Select a device category.").max(40),
  identifierLast4: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "Enter only the last four digits."),
  serialLast4: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "Enter only the last four serial digits."),
  sourceNote: z.string().trim().min(8, "Add a short source note.").max(280),
  consent: z.literal(true, {
    error: "Confirm consent before this record can continue.",
  }),
});

export const inspectionSchema = z.object({
  screenTest: checklist,
  screenPart: part,
  batteryHealth: z.number().int().min(0).max(100).nullable(),
  batteryStatus: part,
  batteryReplacedLabel: z.string().trim().max(40),
  cameraTest: checklist,
  cameraPart: part,
  speakerMic: checklist,
  chargingPortTest: checklist,
  chargingPortPart: part,
  biometric: checklist,
  network: checklist,
  waterDamage: z.enum(["not_observed", "observed", "not_tested", "not_recorded"]),
  exterior: z.string().trim().min(3, "Record the exterior condition.").max(80),
  accessories: z.string().trim().min(3, "Record included accessories.").max(160),
  notes: z.string().trim().max(1000),
});

export const passportDraftSchema = identitySchema.and(inspectionSchema);

export const correctionSchema = z.object({
  issueType: z.string().trim().min(3, "Select an issue type.").max(80),
  description: z
    .string()
    .trim()
    .min(12, "Describe the concern in at least a short sentence.")
    .max(1000),
  contact: z.string().trim().max(120),
});

export const partnerRequestSchema = z.object({
  organisationName: z.string().trim().min(2, "Enter the organisation name.").max(80),
  partnerType: z.enum(["repair_centre", "dealer", "enterprise"]),
  location: z.string().trim().min(2, "Enter a city or area.").max(80),
  contactName: z.string().trim().min(2, "Enter a contact name.").max(80),
  email: z.email("Enter a valid work email address."),
  message: z.string().trim().min(12, "Add a short note about the demo.").max(800),
});

export const inventorySchema = z.object({
  brand: z.string().trim().min(2, "Enter a brand.").max(40),
  model: z.string().trim().min(1, "Enter a model.").max(60),
  identifierLast4: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "Enter only the last four digits."),
  listingTitle: z.string().trim().min(4, "Enter a listing title.").max(80),
  passportId: z.string().trim(),
});

export const repairEventSchema = z.object({
  eventType: z.string().trim().min(3, "Enter an event type.").max(60),
  summary: z.string().trim().min(8, "Describe the repair event.").max(400),
  partNote: z.string().trim().max(120),
});

export const reviewNoteSchema = z.object({
  note: z.string().trim().min(3, "Add an internal note.").max(500),
});

export type PartnerRequestValues = z.infer<typeof partnerRequestSchema>;
export type CorrectionValues = z.infer<typeof correctionSchema>;
export type InventoryValues = z.infer<typeof inventorySchema>;
