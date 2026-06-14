import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { AlertCircle, TrendingUp, Users, Clock, CheckCircle, X, ArrowRight, Shield, BarChart2 } from 'lucide-react';

interface Insight {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  issue: string;
  cause: string;
  recommendation: string;
  department: string;
  impact: string;
  affectedRoles: string[];
  businessImpact: string;
  mitigationStrategy: string;
  implementation: {
    action: string;
    expectedImpact: string;
    efficiencyImprovement: string;
    riskReduction: string;
    steps: string[];
  };
}

const insights: Insight[] = [
  {
    id: '1',
    severity: 'critical',
    issue: 'Driver shortage detected in operations',
    cause: 'Current driver count is 15% below optimal capacity for peak demand periods',
    recommendation: 'Hire 8 additional drivers or implement temporary contract workforce during peak seasons',
    department: 'Operations',
    impact: 'High - 18% delay in deliveries',
    affectedRoles: ['Driver', 'Dispatcher', 'Route Planner'],
    businessImpact: 'Revenue loss of ₹2.4L/month due to delayed deliveries and SLA penalties. Customer satisfaction score dropped by 12 points.',
    mitigationStrategy: 'Immediate short-term staffing through gig platforms combined with accelerated hiring pipeline for 8 permanent drivers.',
    implementation: {
      action: 'Hire 8 additional drivers and onboard via gig platform',
      expectedImpact: 'Reduce delivery delays from 18% to under 3%',
      efficiencyImprovement: '+22%',
      riskReduction: '75%',
      steps: [
        'Post job openings on top 3 recruitment platforms immediately',
        'Contact 2 verified gig driver agencies for temporary staffing',
        'Fast-track background verification process (3 days instead of 7)',
        'Assign new drivers to mentor-buddy system for 2-week onboarding',
        'Redistribute current driver routes to reduce overtime burden',
        'Review and adjust route density to match available capacity',
      ],
    },
  },
  {
    id: '2',
    severity: 'high',
    issue: 'Workforce imbalance in logistics department',
    cause: 'Route planners operating at 140% capacity while warehouse staff at 65%',
    recommendation: 'Cross-train 5 warehouse staff members for route planning support',
    department: 'Logistics',
    impact: 'Medium - 12% efficiency loss',
    affectedRoles: ['Route Planner', 'Warehouse Staff'],
    businessImpact: 'Planning bottlenecks causing 12% route inefficiency, translating to ₹80K additional fuel and operational costs monthly.',
    mitigationStrategy: 'Structured cross-training program over 3 weeks to qualify warehouse staff as secondary route planners during peak hours.',
    implementation: {
      action: 'Cross-train 5 warehouse staff for route planning',
      expectedImpact: 'Reduce planning backlog by 60% and balance workloads',
      efficiencyImprovement: '+15%',
      riskReduction: '60%',
      steps: [
        'Identify 5 high-performing warehouse staff candidates',
        'Schedule 3-week cross-training program (2 hrs/day)',
        'Shadow current route planners for first week',
        'Supervised planning tasks in week 2 with feedback loops',
        'Independent planning with review in week 3',
        'Certify and assign hybrid roles with adjusted compensation',
      ],
    },
  },
  {
    id: '3',
    severity: 'medium',
    issue: 'Peak hour coverage gap',
    cause: 'Insufficient staffing during 5-7 PM window causing service delays',
    recommendation: 'Implement staggered shift timings with 2-hour overlap during peak periods',
    department: 'Operations',
    impact: 'Medium - 8% customer satisfaction drop',
    affectedRoles: ['Driver', 'Dispatcher', 'Support Staff'],
    businessImpact: 'Customer satisfaction dropped 8 points. Risk of losing 3 key accounts worth ₹15L annually if unresolved.',
    mitigationStrategy: 'Redesign shift schedules with staggered start times to ensure peak-hour coverage without increasing headcount.',
    implementation: {
      action: 'Redesign shift schedules with staggered timings',
      expectedImpact: 'Eliminate 5-7 PM coverage gap, improve SLA compliance',
      efficiencyImprovement: '+10%',
      riskReduction: '55%',
      steps: [
        'Audit current shift schedules and identify peak-hour gaps',
        'Design 3 staggered shift bands (7 AM, 9 AM, 11 AM starts)',
        'Ensure 2-hour handover overlap during 5-7 PM window',
        'Communicate changes to all staff with 2-week notice',
        'Pilot with 30% of workforce for first 2 weeks',
        'Measure response time metrics and adjust if needed',
      ],
    },
  },
  {
    id: '4',
    severity: 'low',
    issue: 'Equipment utilization below target',
    cause: 'Fleet vehicles underutilized in non-peak hours (60% capacity)',
    recommendation: 'Optimize route scheduling to maintain 75-80% utilization throughout the day',
    department: 'Fleet Management',
    impact: 'Low - 5% cost inefficiency',
    affectedRoles: ['Fleet Manager', 'Driver', 'Maintenance Engineer'],
    businessImpact: 'Underutilized fleet adds ₹40K/month in depreciation and idle costs. Opportunity to serve 15% more orders without new vehicles.',
    mitigationStrategy: 'AI-driven dynamic scheduling to fill utilization gaps with smaller on-demand deliveries during off-peak windows.',
    implementation: {
      action: 'Implement dynamic fleet scheduling system',
      expectedImpact: 'Increase utilization from 60% to 80% across all vehicles',
      efficiencyImprovement: '+8%',
      riskReduction: '40%',
      steps: [
        'Analyse current utilization data by vehicle, time, and route',
        'Identify off-peak slots with consistent under-utilization',
        'Configure fleet management software for dynamic slot filling',
        'Pilot micro-delivery orders in 3 low-utilization time windows',
        'Train fleet managers on new scheduling dashboard',
        'Set KPI targets: 75% utilization minimum within 30 days',
      ],
    },
  },
];

export function AIInsights() {
  const { industryData } = useAppContext();
  const [implementOpen, setImplementOpen] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState<string | null>(null);

  const criticalRoles = industryData?.roles.filter((role) => role.isCritical) || [];

  const activeInsight = insights.find((i) => i.id === implementOpen || i.id === detailOpen);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-950/20 text-red-400 border-red-900';
      case 'high': return 'bg-orange-950/20 text-orange-400 border-orange-900';
      case 'medium': return 'bg-yellow-950/20 text-yellow-400 border-yellow-900';
      case 'low': return 'bg-blue-950/20 text-blue-400 border-blue-900';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertCircle className="w-5 h-5" />;
      case 'medium':
        return <Clock className="w-5 h-5" />;
      case 'low':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400 font-normal">Total Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{insights.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400 font-normal">Critical Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">
              {insights.filter((i) => i.severity === 'critical').length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400 font-normal">Departments Affected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {new Set(insights.map((i) => i.department)).size}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400 font-normal">Critical Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">{criticalRoles.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Insight Cards */}
      <div className="space-y-4">
        {insights.map((insight) => (
          <Card key={insight.id} className={`border ${getSeverityColor(insight.severity)}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getSeverityIcon(insight.severity)}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={getSeverityColor(insight.severity)}>
                        {insight.severity.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-slate-400">{insight.department}</span>
                    </div>
                    <CardTitle className="text-white text-lg mb-2">{insight.issue}</CardTitle>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-slate-400 text-sm font-semibold mb-1">Root Cause Analysis</div>
                <p className="text-slate-200">{insight.cause}</p>
              </div>
              <div>
                <div className="text-slate-400 text-sm font-semibold mb-1">Impact Assessment</div>
                <p className="text-slate-200">{insight.impact}</p>
              </div>
              <div className="bg-blue-950/30 border border-blue-900/50 rounded-lg p-4">
                <div className="flex items-start gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-400 mt-1" />
                  <div className="text-blue-400 text-sm font-semibold">Recommended Action</div>
                </div>
                <p className="text-slate-200">{insight.recommendation}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setImplementOpen(insight.id)}>
                  Implement Solution
                </Button>
                <Button size="sm" variant="outline" className="border-slate-700 text-slate-300" onClick={() => setDetailOpen(insight.id)}>
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Implement Solution Panel */}
      {implementOpen && activeInsight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <div>
                <h2 className="text-white text-xl font-semibold">Implementation Plan</h2>
                <p className="text-slate-400 text-sm mt-1">{activeInsight.issue}</p>
              </div>
              <button onClick={() => setImplementOpen(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-950/30 border border-green-900/50 rounded-lg p-4 text-center">
                  <BarChart2 className="w-5 h-5 text-green-400 mx-auto mb-2" />
                  <div className="text-green-400 text-2xl font-bold">{activeInsight.implementation.efficiencyImprovement}</div>
                  <div className="text-slate-400 text-xs mt-1">Efficiency Improvement</div>
                </div>
                <div className="bg-blue-950/30 border border-blue-900/50 rounded-lg p-4 text-center">
                  <Shield className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                  <div className="text-blue-400 text-2xl font-bold">{activeInsight.implementation.riskReduction}</div>
                  <div className="text-slate-400 text-xs mt-1">Risk Reduction</div>
                </div>
                <div className="bg-purple-950/30 border border-purple-900/50 rounded-lg p-4 text-center">
                  <TrendingUp className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                  <div className="text-purple-400 text-sm font-semibold">{activeInsight.implementation.expectedImpact}</div>
                  <div className="text-slate-400 text-xs mt-1">Expected Impact</div>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-slate-300 text-sm font-semibold mb-1">Recommended Action</div>
                <p className="text-white">{activeInsight.implementation.action}</p>
              </div>

              {/* Implementation Steps */}
              <div>
                <div className="text-slate-300 text-sm font-semibold mb-3">Implementation Steps</div>
                <div className="space-y-3">
                  {activeInsight.implementation.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-white">{idx + 1}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-200 text-sm">
                        <ArrowRight className="w-3 h-3 text-blue-400 flex-shrink-0" />
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setImplementOpen(null)}>
                Confirm & Start Implementation
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Panel */}
      {detailOpen && activeInsight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <div>
                <h2 className="text-white text-xl font-semibold">Insight Details</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getSeverityColor(activeInsight.severity)}>
                    {activeInsight.severity.toUpperCase()}
                  </Badge>
                  <span className="text-slate-400 text-sm">{activeInsight.department}</span>
                </div>
              </div>
              <button onClick={() => setDetailOpen(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">Problem Description</div>
                <p className="text-white">{activeInsight.issue}</p>
              </div>
              <div>
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">Root Cause Analysis</div>
                <p className="text-slate-200">{activeInsight.cause}</p>
              </div>
              <div>
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">Affected Roles / Assets</div>
                <div className="flex flex-wrap gap-2">
                  {activeInsight.affectedRoles.map((role) => (
                    <span key={role} className="bg-slate-800 text-slate-300 text-sm px-3 py-1 rounded-full border border-slate-700">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">Business Impact</div>
                <p className="text-slate-200">{activeInsight.businessImpact}</p>
              </div>
              <div className="bg-blue-950/30 border border-blue-900/50 rounded-lg p-4">
                <div className="text-blue-400 text-sm font-semibold mb-2">Recommended Mitigation Strategy</div>
                <p className="text-slate-200">{activeInsight.mitigationStrategy}</p>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => {
                setDetailOpen(null);
                setImplementOpen(activeInsight.id);
              }}>
                Proceed to Implementation
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-blue-950/50 to-purple-950/50 border-blue-900/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Quick Action Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-slate-900/50 border border-slate-800 rounded-lg p-4">
              <div>
                <div className="text-white font-medium mb-1">Workforce Reallocation Plan</div>
                <div className="text-sm text-slate-400">Move 12 employees from low-demand to high-demand roles</div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">Execute</Button>
            </div>
            <div className="flex items-center justify-between bg-slate-900/50 border border-slate-800 rounded-lg p-4">
              <div>
                <div className="text-white font-medium mb-1">Cross-Training Program</div>
                <div className="text-sm text-slate-400">Train 15 warehouse staff for operational flexibility</div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">Schedule</Button>
            </div>
            <div className="flex items-center justify-between bg-slate-900/50 border border-slate-800 rounded-lg p-4">
              <div>
                <div className="text-white font-medium mb-1">Shift Optimization</div>
                <div className="text-sm text-slate-400">Implement staggered shifts for 24/7 coverage</div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">Configure</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
