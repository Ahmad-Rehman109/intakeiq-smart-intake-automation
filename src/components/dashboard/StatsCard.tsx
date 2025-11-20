import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  variant?: "default" | "destructive" | "warning" | "muted";
}

const StatsCard = ({ title, value, icon, variant = "default" }: StatsCardProps) => {
  const variantStyles = {
    default: "text-primary",
    destructive: "text-destructive",
    warning: "text-warning",
    muted: "text-muted-foreground",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={variantStyles[variant]}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;