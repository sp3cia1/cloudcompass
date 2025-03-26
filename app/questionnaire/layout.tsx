import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function QuestionnaireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="py-6 px-4 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">CloudCompass Questionnaire</h1>
          <ThemeToggle />
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4 flex-1">
        {children}
      </main>
      
      <footer className="py-4 px-4 border-t mt-auto">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          CloudCompass - Cloud Architecture Recommendation Engine
        </div>
      </footer>
    </div>
  );
}