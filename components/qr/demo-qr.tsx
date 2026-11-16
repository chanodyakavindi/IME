"use client";

import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";

export function DemoQr({
  value,
  size = 112,
  title = "Passport QR code",
}: {
  value: string;
  size?: number;
  title?: string;
}) {
  return <QRCodeSVG value={value} size={size} level="M" title={title} />;
}

export function DownloadableQr({
  value,
  size = 180,
  canvasId,
}: {
  value: string;
  size?: number;
  canvasId: string;
}) {
  return <QRCodeCanvas id={canvasId} value={value} size={size} level="M" includeMargin />;
}
