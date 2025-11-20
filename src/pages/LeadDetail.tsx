import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Phone, Mail } from "lucide-react";
import { format } from "date-fns";

interface Lead {
  id: string;
  case_type: string;
  state: string;
  country: string | null;
  immigration_status: string;
  timeline: string;
  budget: string;
  previous_attorney: boolean;
  previous_attorney_details: string | null;
  case_details: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  preferred_contact: string;
  best_time: string;
  score: string;
  status: string;
  notes: string | null;
  created_at: string;
}

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    loadLead();
  }, [id]);

  const loadLead = async () => {
    try {
      const { data, error } = await supabase.from("leads").select("*").eq("id", id).single();

      if (error) throw error;
      setLead(data);
      setNotes(data.notes || "");
      setStatus(data.status);
    } catch (error: any) {
      toast({
        title: "Error Loading Lead",
        description: error.message,
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("leads")
        .update({ notes, status })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Saved!",
        description: "Lead information updated successfully",
      });

      setLead((prev) => (prev ? { ...prev, notes, status } : null));
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!lead) return null;

  const getScoreBadge = (score: string) => {
    switch (score) {
      case "hot":
        return <Badge className="bg-destructive text-destructive-foreground text-lg">🔥 Hot Lead</Badge>;
      case "qualified":
        return <Badge className="bg-warning text-warning-foreground text-lg">✅ Qualified</Badge>;
      case "unqualified":
        return <Badge variant="secondary" className="text-lg">📋 Unqualified</Badge>;
      default:
        return <Badge variant="outline">{score}</Badge>;
    }
  };

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
          <h1 className="text-2xl font-bold text-primary">Lead Details</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Lead Information */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{lead.client_name}</CardTitle>
                  {getScoreBadge(lead.score)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Submitted {format(new Date(lead.created_at), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Case Type</Label>
                    <p className="font-medium">{lead.case_type}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Location</Label>
                    <p className="font-medium">
                      {lead.state}
                      {lead.country && ` (${lead.country})`}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Immigration Status</Label>
                    <p className="font-medium">{lead.immigration_status}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Timeline</Label>
                    <p className="font-medium">{lead.timeline}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Budget</Label>
                    <p className="font-medium">{lead.budget}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Previous Attorney</Label>
                    <p className="font-medium">{lead.previous_attorney ? "Yes" : "No"}</p>
                  </div>
                </div>

                {lead.previous_attorney_details && (
                  <div>
                    <Label className="text-muted-foreground">Previous Attorney Details</Label>
                    <p className="mt-1">{lead.previous_attorney_details}</p>
                  </div>
                )}

                <div>
                  <Label className="text-muted-foreground">Case Details</Label>
                  <p className="mt-1 whitespace-pre-wrap">{lead.case_details}</p>
                </div>
              </CardContent>
            </Card>

            {/* Notes Section */}
            <Card>
              <CardHeader>
                <CardTitle>Internal Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add your notes about this lead..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={6}
                  className="mb-4"
                />
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Notes"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact & Status Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <a
                    href={`mailto:${lead.client_email}`}
                    className="flex items-center gap-2 text-primary hover:underline mt-1"
                  >
                    <Mail className="h-4 w-4" />
                    {lead.client_email}
                  </a>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <a
                    href={`tel:${lead.client_phone}`}
                    className="flex items-center gap-2 text-primary hover:underline mt-1"
                  >
                    <Phone className="h-4 w-4" />
                    {lead.client_phone}
                  </a>
                </div>
                <div>
                  <Label className="text-muted-foreground">Preferred Contact</Label>
                  <p className="font-medium">{lead.preferred_contact}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Best Time</Label>
                  <p className="font-medium">{lead.best_time}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="scheduled">Scheduled Consultation</SelectItem>
                    <SelectItem value="converted">Converted to Client</SelectItem>
                    <SelectItem value="not_fit">Not a Fit</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleSave} disabled={saving} className="w-full mt-4">
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Status"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeadDetail;