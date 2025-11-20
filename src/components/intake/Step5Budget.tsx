import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IntakeFormData } from "@/pages/IntakeForm";

interface StepProps {
  formData: IntakeFormData;
  updateFormData: (data: Partial<IntakeFormData>) => void;
}

const Step5Budget = ({ formData, updateFormData }: StepProps) => {
  const budgets = [
    "Under $2,000",
    "$2,000-$5,000",
    "$5,000-$10,000",
    "$10,000-$20,000",
    "Over $20,000",
    "Not sure yet",
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">What's your budget for legal fees?</h3>
        <RadioGroup
          value={formData.budget}
          onValueChange={(value) => updateFormData({ budget: value })}
        >
          {budgets.map((budget) => (
            <div key={budget} className="flex items-center space-x-2">
              <RadioGroupItem value={budget} id={budget} />
              <Label htmlFor={budget} className="cursor-pointer">
                {budget}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default Step5Budget;