import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IntakeFormData } from "@/pages/IntakeForm";

interface StepProps {
  formData: IntakeFormData;
  updateFormData: (data: Partial<IntakeFormData>) => void;
}

const Step3ImmigrationStatus = ({ formData, updateFormData }: StepProps) => {
  const statuses = [
    "US Citizen",
    "Green Card Holder",
    "Valid Work Visa (H-1B, L-1, etc.)",
    "Valid Student Visa (F-1)",
    "Expired Visa",
    "Undocumented",
    "Outside the US",
    "Prefer not to say",
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">What's your current immigration status?</h3>
        <RadioGroup
          value={formData.immigrationStatus}
          onValueChange={(value) => updateFormData({ immigrationStatus: value })}
        >
          {statuses.map((status) => (
            <div key={status} className="flex items-center space-x-2">
              <RadioGroupItem value={status} id={status} />
              <Label htmlFor={status} className="cursor-pointer">
                {status}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default Step3ImmigrationStatus;