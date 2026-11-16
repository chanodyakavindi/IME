import { NewPassportForm } from "@/components/repair/new-passport-form";

export default function NewPassportPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy">Create a passport</h1>
      <p className="mb-4 mt-1 max-w-2xl text-sm text-muted">Record a masked identifier, complete the checklist, attach local evidence previews, then review the public view before publishing.</p>
      <NewPassportForm />
    </div>
  );
}
