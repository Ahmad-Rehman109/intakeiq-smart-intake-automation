import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IntakeFormData } from "@/pages/IntakeForm";

interface StepProps {
  formData: IntakeFormData;
  updateFormData: (data: Partial<IntakeFormData>) => void;
}

const Step1CaseType = ({ formData, updateFormData }: StepProps) => {
  const caseTypes = [
    "H-1B Work Visa",
    "Green Card/Permanent Residence",
    "Family-Based Immigration",
    "Asylum/Refugee Status",
    "Citizenship/Naturalization",
    "Deportation Defense",
    "DACA",
    "Other",
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">What type of immigration case do you need help with?</h3>
        <RadioGroup
          value={formData.caseType}
          onValueChange={(value) => updateFormData({ caseType: value })}
        >
          {caseTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <RadioGroupItem value={type} id={type} />
              <Label htmlFor={type} className="cursor-pointer">
                {type}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default Step1CaseType;