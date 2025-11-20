import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

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

interface LeadsTableProps {
  leads: Lead[];
}

const LeadsTable = ({ leads }: LeadsTableProps) => {
  const getScoreBadge = (score: string) => {
    switch (score) {
      case "hot":
        return <Badge className="bg-destructive text-destructive-foreground">🔥 Hot Lead</Badge>;
      case "qualified":
        return <Badge className="bg-warning text-warning-foreground">✅ Qualified</Badge>;
      case "unqualified":
        return <Badge variant="secondary">📋 Unqualified</Badge>;
      default:
        return <Badge variant="outline">{score}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: string } = {
      new: "New",
      contacted: "Contacted",
      scheduled: "Scheduled",
      converted: "Converted",
      not_fit: "Not a Fit",
      closed: "Closed",
    };

    return <Badge variant="outline">{statusMap[status] || status}</Badge>;
  };

  if (leads.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No leads yet. Share your intake form to start receiving leads!
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Case Type</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Budget</TableHead>
          <TableHead>Timeline</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => (
          <TableRow key={lead.id}>
            <TableCell className="font-medium">{lead.client_name}</TableCell>
            <TableCell>{lead.case_type}</TableCell>
            <TableCell>{getScoreBadge(lead.score)}</TableCell>
            <TableCell>{lead.budget}</TableCell>
            <TableCell className="text-sm">{lead.timeline}</TableCell>
            <TableCell>{getStatusBadge(lead.status)}</TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
            </TableCell>
            <TableCell>
              <Link to={`/leads/${lead.id}`}>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LeadsTable;