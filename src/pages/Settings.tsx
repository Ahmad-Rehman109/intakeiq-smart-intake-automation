import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Firm {
  id: string;
  firm_name: string;
  service_states: string[];
  min_budget: number;
  notification_email: string;
  firm_slug: string;
}

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [firm, setFirm] = useState<Firm | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const allStates = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
    "Wisconsin", "Wyoming"
  ];

  useEffect(() => {
    loadFirmData();
  }, []);

  const loadFirmData = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("firms")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (error) throw error;
      setFirm(data);
    } catch (error: any) {
      toast({
        title: "Error Loading Settings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!firm) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("firms")
        .update({
          firm_name: firm.firm_name,
          service_states: firm.service_states,
          min_budget: firm.min_budget,
          notification_email: firm.notification_email,
        })
        .eq("id", firm.id);

      if (error) throw error;

      toast({
        title: "Settings Saved!",
        description: "Your firm settings have been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleState = (state: string) => {
    if (!firm) return;
    const currentStates = firm.service_states || [];
    const newStates = currentStates.includes(state)
      ? currentStates.filter((s) => s !== state)
      : [...currentStates, state];
    setFirm({ ...firm, service_states: newStates });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!firm) return null;

  const intakeUrl = `${window.location.origin}/intake/${firm.firm_slug}`;

  return (
    <div className="min-h-screen bg-secondary">
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-primary">Settings</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-6">
          {/* Firm Information */}
          <Card>
            <CardHeader>
              <CardTitle>Firm Information</CardTitle>
              <CardDescription>Update your firm's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="firm-name">Firm Name</Label>
                <Input
                  id="firm-name"
                  value={firm.firm_name}
                  onChange={(e) => setFirm({ ...firm, firm_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="notification-email">Notification Email</Label>
                <Input
                  id="notification-email"
                  type="email"
                  value={firm.notification_email}
                  onChange={(e) => setFirm({ ...firm, notification_email: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Service States */}
          <Card>
            <CardHeader>
              <CardTitle>Service States</CardTitle>
              <CardDescription>Select the states where you practice immigration law</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {allStates.map((state) => (
                  <div key={state} className="flex items-center space-x-2">
                    <Checkbox
                      id={state}
                      checked={firm.service_states?.includes(state) || false}
                      onCheckedChange={() => toggleState(state)}
                    />
                    <Label htmlFor={state} className="cursor-pointer text-sm">
                      {state}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Budget Threshold */}
          <Card>
            <CardHeader>
              <CardTitle>Minimum Budget Threshold</CardTitle>
              <CardDescription>
                Leads below this budget will be marked as unqualified
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={firm.min_budget.toString()}
                onValueChange={(value) => setFirm({ ...firm, min_budget: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2000">$2,000</SelectItem>
                  <SelectItem value="5000">$5,000</SelectItem>
                  <SelectItem value="10000">$10,000</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Intake URL */}
          <Card>
            <CardHeader>
              <CardTitle>Your Intake Form URL</CardTitle>
              <CardDescription>Share this link with potential clients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={intakeUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border rounded-md bg-muted text-sm"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(intakeUrl);
                    toast({ title: "Copied!", description: "URL copied to clipboard" });
                  }}
                >
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button onClick={handleSave} disabled={saving} size="lg" className="w-full">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Settings"
            )}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Settings;