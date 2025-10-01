export default function LearnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="z-50 min-h-screen w-screen bg-black">
      {children}
    </section>
  );
}
