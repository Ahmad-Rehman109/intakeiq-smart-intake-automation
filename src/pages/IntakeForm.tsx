import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Import step components
import Step1CaseType from "@/components/intake/Step1CaseType";
import Step2Location from "@/components/intake/Step2Location";
import Step3ImmigrationStatus from "@/components/intake/Step3ImmigrationStatus";
import Step4Timeline from "@/components/intake/Step4Timeline";
import Step5Budget from "@/components/intake/Step5Budget";
import Step6PreviousAttorney from "@/components/intake/Step6PreviousAttorney";
import Step7CaseDetails from "@/components/intake/Step7CaseDetails";
import Step8ContactInfo from "@/components/intake/Step8ContactInfo";

export interface IntakeFormData {
  caseType: string;
  state: string;
  country: string;
  immigrationStatus: string;
  timeline: string;
  budget: string;
  previousAttorney: boolean;
  previousAttorneyDetails: string;
  caseDetails: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  preferredContact: string;
  bestTime: string;
}

const IntakeForm = () => {
  const { firmSlug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const totalSteps = 8;

  const [formData, setFormData] = useState<IntakeFormData>({
    caseType: "",
    state: "",
    country: "",
    immigrationStatus: "",
    timeline: "",
    budget: "",
    previousAttorney: false,
    previousAttorneyDetails: "",
    caseDetails: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    preferredContact: "",
    bestTime: "",
  });

  const updateFormData = (data: Partial<IntakeFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const calculateLeadScore = (data: IntakeFormData, firmServiceStates: string[]): string => {
    // Hot Lead criteria
    const isInServiceArea = firmServiceStates.includes(data.state);
    const hasGoodBudget = ["$5,000-$10,000", "$10,000-$20,000", "Over $20,000"].includes(data.budget);
    const hasUrgentTimeline = ["Urgent (less than 30 days)", "1-3 months"].includes(data.timeline);

    if (isInServiceArea && hasGoodBudget && hasUrgentTimeline) {
      return "hot";
    }

    // Qualified Lead criteria
    const hasDecentBudget = ["$2,000-$5,000", "$5,000-$10,000", "$10,000-$20,000", "Over $20,000"].includes(
      data.budget
    );
    const hasReasonableTimeline = ["1-3 months", "3-6 months", "6-12 months"].includes(data.timeline);

    if (isInServiceArea && hasDecentBudget && hasReasonableTimeline) {
      return "qualified";
    }

    // Unqualified Lead
    return "unqualified";
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Get firm data
      const { data: firm, error: firmError } = await supabase
        .from("firms")
        .select("*")
        .eq("firm_slug", firmSlug)
        .single();

      if (firmError) throw new Error("Firm not found");

      // Calculate lead score
      const score = calculateLeadScore(formData, firm.service_states || []);

      // Insert lead
      const { error: leadError } = await supabase.from("leads").insert({
        firm_id: firm.id,
        case_type: formData.caseType,
        state: formData.state,
        country: formData.country || null,
        immigration_status: formData.immigrationStatus,
        timeline: formData.timeline,
        budget: formData.budget,
        previous_attorney: formData.previousAttorney,
        previous_attorney_details: formData.previousAttorneyDetails || null,
        case_details: formData.caseDetails,
        client_name: formData.clientName,
        client_email: formData.clientEmail,
        client_phone: formData.clientPhone,
        preferred_contact: formData.preferredContact,
        best_time: formData.bestTime,
        score,
      });

      if (leadError) throw leadError;

      toast({
        title: "Thank You!",
        description: "Your information has been submitted successfully.",
      });

      navigate("/thank-you");
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Immigration Intake Form</CardTitle>
          <CardDescription>
            Step {currentStep} of {totalSteps}
          </CardDescription>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent>
          {currentStep === 1 && <Step1CaseType formData={formData} updateFormData={updateFormData} />}
          {currentStep === 2 && <Step2Location formData={formData} updateFormData={updateFormData} />}
          {currentStep === 3 && (
            <Step3ImmigrationStatus formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 4 && <Step4Timeline formData={formData} updateFormData={updateFormData} />}
          {currentStep === 5 && <Step5Budget formData={formData} updateFormData={updateFormData} />}
          {currentStep === 6 && (
            <Step6PreviousAttorney formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 7 && <Step7CaseDetails formData={formData} updateFormData={updateFormData} />}
          {currentStep === 8 && <Step8ContactInfo formData={formData} updateFormData={updateFormData} />}

          <div className="flex justify-between mt-8">
            {currentStep > 1 ? (
              <Button variant="outline" onClick={handleBack} disabled={loading}>
                Back
              </Button>
            ) : (
              <div />
            )}
            <Button onClick={handleNext} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : currentStep === totalSteps ? (
                "Submit"
              ) : (
                "Next"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntakeForm;