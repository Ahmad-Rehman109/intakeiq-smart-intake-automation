import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ThankYou = () => {
  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-success text-success-foreground rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Check className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">Thank You!</CardTitle>
          <CardDescription className="text-base">
            We've received your information and will contact you within 24 hours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            One of our immigration attorneys will review your case and reach out to discuss
            how we can help you.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThankYou;