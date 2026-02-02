import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  icon: React.ReactNode;
  value: string;
  description: string;
  className?: string;
}

export function SummaryCard({ title, icon, value, description, className }: SummaryCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
      </CardContent>
    </Card>
  );
}
