import { PassportManage } from "@/components/repair/passport-manage";

export default async function RepairPassportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PassportManage id={id} />;
}
