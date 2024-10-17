// app/dashboard/page.tsx
"use client";

import DashboardLayout from "./DashboardLayout";
import TemplateListSec from "./TemplateListSec";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <TemplateListSec />
    </DashboardLayout>
  );
}
