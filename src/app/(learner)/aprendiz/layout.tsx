import { ChildSidebar } from "./_components/child-sidebar";

export default function LearnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-primary-900 relative flex min-h-screen w-full">
      <ChildSidebar />
      {children}
    </div>
  );
}
