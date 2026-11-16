import { PassportView } from "@/components/passport/passport-view";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Device passport" };

export default async function PassportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PassportView id={id} />;
}
