import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IntakeFormData } from "@/pages/IntakeForm";

interface StepProps {
  formData: IntakeFormData;
  updateFormData: (data: Partial<IntakeFormData>) => void;
}

const Step7CaseDetails = ({ formData, updateFormData }: StepProps) => {
  const maxLength = 500;
  const remaining = maxLength - formData.caseDetails.length;

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="case-details">
          <h3 className="text-lg font-semibold mb-2">Please describe your situation in detail</h3>
        </Label>
        <Textarea
          id="case-details"
          placeholder="Include any important dates, documents you have, or concerns..."
          value={formData.caseDetails}
          onChange={(e) => {
            if (e.target.value.length <= maxLength) {
              updateFormData({ caseDetails: e.target.value });
            }
          }}
          rows={6}
          className="mt-2"
        />
        <p className="text-sm text-muted-foreground mt-2">
          {remaining} characters remaining
        </p>
      </div>
    </div>
  );
};

export default Step7CaseDetails;