import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { IntakeFormData } from "@/pages/IntakeForm";

interface StepProps {
  formData: IntakeFormData;
  updateFormData: (data: Partial<IntakeFormData>) => void;
}

const Step6PreviousAttorney = ({ formData, updateFormData }: StepProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Have you already consulted with another immigration attorney?
        </h3>
        <RadioGroup
          value={formData.previousAttorney ? "yes" : "no"}
          onValueChange={(value) =>
            updateFormData({
              previousAttorney: value === "yes",
              previousAttorneyDetails: value === "no" ? "" : formData.previousAttorneyDetails,
            })
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="yes" />
            <Label htmlFor="yes" className="cursor-pointer">
              Yes
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="no" />
            <Label htmlFor="no" className="cursor-pointer">
              No
            </Label>
          </div>
        </RadioGroup>
      </div>

      {formData.previousAttorney && (
        <div>
          <Label htmlFor="previous-details">
            Who was your previous attorney and why are you looking for new representation?
          </Label>
          <Textarea
            id="previous-details"
            placeholder="Please provide details..."
            value={formData.previousAttorneyDetails}
            onChange={(e) => updateFormData({ previousAttorneyDetails: e.target.value })}
            className="mt-2"
            rows={4}
          />
        </div>
      )}
    </div>
  );
};

export default Step6PreviousAttorney;