"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function TrendChart({
  data,
  label,
}: {
  data: { label: string; count: number }[];
  label: string;
}) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="#e3e8ee" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#526173" }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#526173" }} />
          <Tooltip />
          <Bar dataKey="count" name={label} fill="#0B2545" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LineTrend({ data, label }: { data: { label: string; count: number }[]; label: string }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="#e3e8ee" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#526173" }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#526173" }} />
          <Tooltip />
          <Line type="monotone" dataKey="count" name={label} stroke="#0F766E" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StatusChart({ data }: { data: { name: string; value: number; fill: string }[] }) {
  const visible = data.filter((item) => item.value > 0);
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={visible} dataKey="value" nameKey="name" innerRadius={48} outerRadius={80}>
            {visible.map((item) => (
              <Cell key={item.name} fill={item.fill} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <ul className="flex flex-wrap gap-3 text-xs text-muted">
        {data.map((item) => (
          <li key={item.name}>{item.name}: {item.value}</li>
        ))}
      </ul>
    </div>
  );
}
