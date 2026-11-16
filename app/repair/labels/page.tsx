import { LabelBoard } from "@/components/repair/label-board";

export default function LabelsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy">QR labels</h1>
      <div className="mt-4"><LabelBoard /></div>
    </div>
  );
}
