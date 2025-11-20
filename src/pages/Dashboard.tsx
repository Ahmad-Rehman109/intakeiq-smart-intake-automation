import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogOut, Settings, Users, TrendingUp, Clock, CheckCircle } from "lucide-react";
import LeadsTable from "@/components/dashboard/LeadsTable";
import StatsCard from "@/components/dashboard/StatsCard";

interface Firm {
  id: string;
  firm_name: string;
  firm_slug: string;
}

interface Lead {
  id: string;
  client_name: string;
  case_type: string;
  score: string;
  budget: string;
  timeline: string;
  status: string;
  created_at: string;
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [firm, setFirm] = useState<Firm | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    hot: 0,
    qualified: 0,
    unqualified: 0,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    setupRealtimeSubscription();
  }, []);

  const checkAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate("/auth");
      return;
    }

    await loadFirmData(session.user.id);
  };

  const loadFirmData = async (userId: string) => {
    try {
      // Get firm data
      const { data: firmData, error: firmError } = await supabase
        .from("firms")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (firmError) throw firmError;
      setFirm(firmData);

      // Get leads
      const { data: leadsData, error: leadsError } = await supabase
        .from("leads")
        .select("*")
        .eq("firm_id", firmData.id)
        .order("created_at", { ascending: false });

      if (leadsError) throw leadsError;
      setLeads(leadsData || []);

      // Calculate stats
      const thisMonth = leadsData?.filter((lead) => {
        const leadDate = new Date(lead.created_at);
        const now = new Date();
        return (
          leadDate.getMonth() === now.getMonth() && leadDate.getFullYear() === now.getFullYear()
        );
      });

      setStats({
        total: thisMonth?.length || 0,
        hot: thisMonth?.filter((l) => l.score === "hot").length || 0,
        qualified: thisMonth?.filter((l) => l.score === "qualified").length || 0,
        unqualified: thisMonth?.filter((l) => l.score === "unqualified").length || 0,
      });
    } catch (error: any) {
      toast({
        title: "Error Loading Data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel("leads-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "leads",
        },
        (payload) => {
          const newLead = payload.new as Lead;
          setLeads((prev) => [newLead, ...prev]);

          if (newLead.score === "hot") {
            toast({
              title: "🔥 Hot Lead Alert!",
              description: `New ${newLead.case_type} lead from ${newLead.client_name}`,
            });
          }

          // Update stats
          setStats((prev) => ({
            total: prev.total + 1,
            hot: prev.hot + (newLead.score === "hot" ? 1 : 0),
            qualified: prev.qualified + (newLead.score === "qualified" ? 1 : 0),
            unqualified: prev.unqualified + (newLead.score === "unqualified" ? 1 : 0),
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const intakeUrl = `${window.location.origin}/intake/${firm?.firm_slug}`;

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">IntakeIQ</h1>
            <p className="text-sm text-muted-foreground">{firm?.firm_name}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/settings">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Intake URL */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Your Intake Form URL</CardTitle>
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

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Leads (This Month)"
            value={stats.total}
            icon={<Users className="h-6 w-6" />}
          />
          <StatsCard
            title="Hot Leads"
            value={stats.hot}
            icon={<TrendingUp className="h-6 w-6" />}
            variant="destructive"
          />
          <StatsCard
            title="Qualified Leads"
            value={stats.qualified}
            icon={<CheckCircle className="h-6 w-6" />}
            variant="warning"
          />
          <StatsCard
            title="Unqualified Leads"
            value={stats.unqualified}
            icon={<Clock className="h-6 w-6" />}
            variant="muted"
          />
        </div>

        {/* Recent Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <LeadsTable leads={leads.slice(0, 20)} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;