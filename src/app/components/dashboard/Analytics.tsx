import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  LineChart, Line, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, AlertTriangle, Activity } from 'lucide-react';

const efficiencyTrend = [
  { period: 'Jan', efficiency: 82 },
  { period: 'Feb', efficiency: 79 },
  { period: 'Mar', efficiency: 85 },
  { period: 'Apr', efficiency: 88 },
  { period: 'May', efficiency: 91 },
  { period: 'Jun', efficiency: 89 },
];

const capacityDemand = [
  { day: 'Day 1',  capacity: 100, demand: 80  },
  { day: 'Day 2',  capacity: 100, demand: 85  },
  { day: 'Day 3',  capacity: 100, demand: 90  },
  { day: 'Day 4',  capacity: 100, demand: 98  },
  { day: 'Day 5',  capacity: 100, demand: 110 },
  { day: 'Day 6',  capacity: 100, demand: 120 },
  { day: 'Day 7',  capacity: 100, demand: 130 },
];

const riskBreakdownDefault = [
  { role: 'Drivers',        risk: 85 },
  { role: 'Dispatchers',    risk: 45 },
  { role: 'Warehouse',      risk: 20 },
  { role: 'Route Planners', risk: 15 },
];

const riskByIndustry: Record<string, { role: string; risk: number }[]> = {
  logistics: [
    { role: 'Drivers',        risk: 85 },
    { role: 'Dispatchers',    risk: 45 },
    { role: 'Warehouse',      risk: 20 },
    { role: 'Route Planners', risk: 15 },
  ],
  healthcare: [
    { role: 'Emergency Unit', risk: 90 },
    { role: 'ICU',            risk: 70 },
    { role: 'Surgeons',       risk: 60 },
    { role: 'General Ward',   risk: 25 },
  ],
  manufacturing: [
    { role: 'Machine Ops',    risk: 75 },
    { role: 'Quality Ctrl',   risk: 55 },
    { role: 'Maintenance',    risk: 80 },
    { role: 'Supervisors',    risk: 30 },
  ],
  transport: [
    { role: 'Drivers',        risk: 88 },
    { role: 'Conductors',     risk: 40 },
    { role: 'Fleet Mgr',      risk: 65 },
    { role: 'Coordinators',   risk: 35 },
  ],
  municipal: [
    { role: 'Emergency Resp', risk: 92 },
    { role: 'Utility Tech',   risk: 70 },
    { role: 'Coordinators',   risk: 55 },
    { role: 'Field Workers',  risk: 30 },
  ],
  it: [
    { role: 'Incident Mgr',  risk: 80 },
    { role: 'DevOps',         risk: 65 },
    { role: 'System Admin',   risk: 55 },
    { role: 'Support Eng',    risk: 35 },
  ],
};

const getRiskColor = (risk: number) => {
  if (risk >= 75) return '#ef4444';
  if (risk >= 50) return '#f97316';
  if (risk >= 30) return '#eab308';
  return '#22c55e';
};

const tooltipStyle = {
  contentStyle: { backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' },
  labelStyle: { color: '#e2e8f0' },
  itemStyle: { color: '#94a3b8' },
};

export function Analytics() {
  const { industryData, selectedIndustry } = useAppContext();

  const riskData = (selectedIndustry && riskByIndustry[selectedIndustry])
    ? riskByIndustry[selectedIndustry]
    : industryData?.roles.map((role) => ({
        role: role.name,
        risk: role.isCritical ? Math.round(60 + Math.random() * 35) : Math.round(15 + Math.random() * 40),
      })) || riskBreakdownDefault;

  const criticalCount = industryData?.roles.filter((r) => r.isCritical).length ?? 0;
  const avgEfficiency = Math.round(efficiencyTrend.reduce((s, d) => s + d.efficiency, 0) / efficiencyTrend.length);
  const shortfallDay = capacityDemand.find((d) => d.demand > d.capacity);

  return (
    <div className="space-y-6">
      {/* KPI strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400 font-normal flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              Avg. Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{avgEfficiency}%</div>
            <p className="text-xs text-green-400 mt-1">↑ 12% vs last month</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400 font-normal flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              High-Risk Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">
              {riskData.filter((r) => r.risk >= 75).length}
            </div>
            <p className="text-xs text-slate-400 mt-1">risk score ≥ 75</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400 font-normal flex items-center gap-2">
              <Activity className="w-4 h-4 text-yellow-400" />
              Capacity Shortfall
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">
              {shortfallDay ? shortfallDay.day : 'None'}
            </div>
            <p className="text-xs text-slate-400 mt-1">first demand &gt; capacity</p>
          </CardContent>
        </Card>
      </div>

      {/* 1. Efficiency Trend */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <CardTitle className="text-white">Efficiency Trend Over Time</CardTitle>
              <p className="text-slate-400 text-sm mt-0.5">Monthly operational efficiency score (%)</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart id="chart-efficiency-trend" data={efficiencyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="period" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} domain={[60, 100]} unit="%" />
              <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v}%`, 'Efficiency']} />
              <ReferenceLine y={85} stroke="#334155" strokeDasharray="4 4" label={{ value: 'Target 85%', fill: '#64748b', fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="efficiency"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ fill: '#22c55e', r: 5 }}
                activeDot={{ r: 7 }}
                name="Efficiency"
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-6 mt-3 text-sm">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500" /><span className="text-slate-400">Actual Efficiency</span></div>
            <div className="flex items-center gap-2"><div className="w-6 border-t border-dashed border-slate-500" /><span className="text-slate-400">Target (85%)</span></div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Department / Role Risk Breakdown */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <CardTitle className="text-white">Department / Role Risk Breakdown</CardTitle>
              <p className="text-slate-400 text-sm mt-0.5">Risk score by role — higher = needs immediate attention</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={Math.max(240, riskData.length * 56)}>
            <BarChart
              id="chart-risk-breakdown"
              data={[...riskData].sort((a, b) => b.risk - a.risk)}
              layout="vertical"
              margin={{ left: 8, right: 24 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} domain={[0, 100]} unit="" />
              <YAxis dataKey="role" type="category" stroke="#94a3b8" tick={{ fill: '#e2e8f0' }} width={120} />
              <Tooltip
                {...tooltipStyle}
                formatter={(v: number) => [`${v}`, 'Risk Score']}
              />
              <ReferenceLine x={75} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'High Risk', fill: '#ef4444', fontSize: 11 }} />
              <Bar dataKey="risk" radius={[0, 4, 4, 0]} name="Risk Score">
                {[...riskData].sort((a, b) => b.risk - a.risk).map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={getRiskColor(entry.risk)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-4 mt-4 text-xs">
            {[
              { label: 'Critical (≥75)', color: '#ef4444' },
              { label: 'High (50–74)', color: '#f97316' },
              { label: 'Medium (30–49)', color: '#eab308' },
              { label: 'Low (<30)', color: '#22c55e' },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: l.color }} />
                <span className="text-slate-400">{l.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 3. Predicted Capacity vs Demand */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-white">Predicted Capacity vs Demand — Next 7 Days</CardTitle>
              <p className="text-slate-400 text-sm mt-0.5">Forecast when demand will exceed available capacity</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart id="chart-capacity-demand" data={capacityDemand}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} domain={[60, 140]} unit="" />
              <Tooltip
                {...tooltipStyle}
                formatter={(v: number, name: string) => [v, name === 'capacity' ? 'Available Capacity' : 'Expected Demand']}
              />
              <ReferenceLine y={100} stroke="#3b82f6" strokeDasharray="4 4" />
              <Line
                type="monotone"
                dataKey="capacity"
                stroke="#3b82f6"
                strokeWidth={2}
                strokeDasharray="6 3"
                dot={false}
                name="capacity"
              />
              <Line
                type="monotone"
                dataKey="demand"
                stroke="#f97316"
                strokeWidth={3}
                dot={{ fill: '#f97316', r: 4 }}
                activeDot={{ r: 6 }}
                name="demand"
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-6 mt-3 text-sm">
            <div className="flex items-center gap-2"><div className="w-6 border-t-2 border-dashed border-blue-500" /><span className="text-slate-400">Available Capacity</span></div>
            <div className="flex items-center gap-2"><div className="w-6 border-t-2 border-orange-500" /><span className="text-slate-400">Expected Demand</span></div>
          </div>
          {shortfallDay && (
            <div className="mt-4 bg-red-950/30 border border-red-900/50 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-300">
                <span className="font-semibold">Shortage forecast from {shortfallDay.day}:</span> demand ({shortfallDay.demand}) will exceed capacity ({shortfallDay.capacity}). Plan additional resourcing now.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
