import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IntakeFormData } from "@/pages/IntakeForm";

interface StepProps {
  formData: IntakeFormData;
  updateFormData: (data: Partial<IntakeFormData>) => void;
}

const Step4Timeline = ({ formData, updateFormData }: StepProps) => {
  const timelines = [
    "Urgent (less than 30 days)",
    "1-3 months",
    "3-6 months",
    "6-12 months",
    "Just exploring options",
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">When do you need to resolve this matter?</h3>
        <RadioGroup
          value={formData.timeline}
          onValueChange={(value) => updateFormData({ timeline: value })}
        >
          {timelines.map((timeline) => (
            <div key={timeline} className="flex items-center space-x-2">
              <RadioGroupItem value={timeline} id={timeline} />
              <Label htmlFor={timeline} className="cursor-pointer">
                {timeline}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default Step4Timeline;