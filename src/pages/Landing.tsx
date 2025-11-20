import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, BarChart3, TrendingUp, Check } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">IntakeIQ</h1>
          <Link to="/auth">
            <Button variant="outline">Sign In</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-foreground mb-6">
          Stop Losing $20K/Month to<br />Unqualified Leads
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          IntakeIQ automatically qualifies immigration law leads, scores them by quality,
          and only sends you clients worth your time. Save 15+ hours per week.
        </p>
        <Link to="/auth">
          <Button size="lg" className="text-lg px-8 py-6">
            Start Free Trial
          </Button>
        </Link>
        <p className="text-sm text-muted-foreground mt-4">
          No credit card required • Setup in 5 minutes
        </p>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Zap className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Instant Lead Scoring</CardTitle>
              <CardDescription>
                AI automatically classifies every lead as Hot, Qualified, or Unqualified
                based on your firm's criteria
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Branded Intake Forms</CardTitle>
              <CardDescription>
                Give clients a professional intake experience with your firm's branding.
                Mobile-friendly and secure.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Real-Time Dashboard</CardTitle>
              <CardDescription>
                See new leads instantly, track conversion rates, and manage your pipeline
                from one central dashboard.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-secondary py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">How IntakeIQ Works</h3>
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Client Fills Out Intake Form</h4>
                <p className="text-muted-foreground">
                  Potential clients answer 8 simple questions about their case, timeline, and budget
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">AI Scores the Lead</h4>
                <p className="text-muted-foreground">
                  IntakeIQ instantly analyzes location, budget, timeline, and case type to
                  determine lead quality
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">You Get Notified</h4>
                <p className="text-muted-foreground">
                  Hot leads trigger instant email alerts. Dashboard updates in real-time.
                  Focus only on qualified prospects.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-primary">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-2">Professional Plan</CardTitle>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold text-primary">$1,500</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span>Unlimited lead submissions</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span>Automatic AI lead scoring</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span>Branded intake portal</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span>Real-time dashboard & notifications</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span>Email auto-responders</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span>Custom service area settings</span>
                </li>
              </ul>
              <Link to="/auth" className="block">
                <Button size="lg" className="w-full">
                  Start Free Trial
                </Button>
              </Link>
              <p className="text-center text-sm text-muted-foreground mt-4">
                14-day free trial • Cancel anytime
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <TrendingUp className="h-16 w-16 mx-auto mb-6" />
          <h3 className="text-4xl font-bold mb-4">
            Ready to Qualify Better Leads?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Join immigration law firms saving 15+ hours per week with IntakeIQ
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 IntakeIQ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;