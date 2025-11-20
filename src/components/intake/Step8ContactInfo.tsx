import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IntakeFormData } from "@/pages/IntakeForm";

interface StepProps {
  formData: IntakeFormData;
  updateFormData: (data: Partial<IntakeFormData>) => void;
}

const Step8ContactInfo = ({ formData, updateFormData }: StepProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
      </div>

      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="John Smith"
          value={formData.clientName}
          onChange={(e) => updateFormData({ clientName: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          value={formData.clientEmail}
          onChange={(e) => updateFormData({ clientEmail: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="(555) 123-4567"
          value={formData.clientPhone}
          onChange={(e) => updateFormData({ clientPhone: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="preferred-contact">Preferred Contact Method</Label>
        <Select
          value={formData.preferredContact}
          onValueChange={(value) => updateFormData({ preferredContact: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Phone">Phone</SelectItem>
            <SelectItem value="Email">Email</SelectItem>
            <SelectItem value="Text">Text</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="best-time">Best Time to Reach You</Label>
        <Select
          value={formData.bestTime}
          onValueChange={(value) => updateFormData({ bestTime: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Morning 9-12">Morning (9 AM - 12 PM)</SelectItem>
            <SelectItem value="Afternoon 12-3">Afternoon (12 PM - 3 PM)</SelectItem>
            <SelectItem value="Evening 3-6">Evening (3 PM - 6 PM)</SelectItem>
            <SelectItem value="Anytime">Anytime</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Step8ContactInfo;