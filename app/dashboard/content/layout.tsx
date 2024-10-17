import DashboardLayout from "../DashboardLayout";

export default function ContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      <div className="scrollable">
        {children}
      </div>
    </DashboardLayout>
  );
}
