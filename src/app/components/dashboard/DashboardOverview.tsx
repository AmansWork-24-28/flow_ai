import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, TrendingUp, Users, Activity, AlertCircle } from 'lucide-react';

const performanceData = [
  { month: 'Jan', workforce: 85, demand: 75 },
  { month: 'Feb', workforce: 88, demand: 80 },
  { month: 'Mar', workforce: 90, demand: 85 },
  { month: 'Apr', workforce: 87, demand: 90 },
  { month: 'May', workforce: 92, demand: 88 },
  { month: 'Jun', workforce: 95, demand: 92 },
];

const riskData = [
  { name: 'Low Risk', value: 60, color: '#22c55e' },
  { name: 'Medium Risk', value: 30, color: '#eab308' },
  { name: 'High Risk', value: 10, color: '#ef4444' },
];

export function DashboardOverview() {
  const { industryData, companyProfile } = useAppContext();

  const totalWorkforce = industryData?.roles.reduce((sum, role) => sum + role.employeeCount, 0) || 0;
  const criticalRoles = industryData?.roles.filter((role) => role.isCritical).length || 0;
  const capacityScore = Math.round(85 + Math.random() * 10);
  const efficiencyScore = Math.round(80 + Math.random() * 15);

  const alerts = [
    { severity: 'high', department: 'Operations', message: 'Driver shortage detected - 15% below optimal' },
    { severity: 'medium', department: 'Logistics', message: 'Route planning capacity at 78%' },
    { severity: 'low', department: 'Support', message: 'Warehouse staff utilization optimal' },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-950/20 border-red-900';
      case 'medium': return 'text-yellow-400 bg-yellow-950/20 border-yellow-900';
      default: return 'text-green-400 bg-green-950/20 border-green-900';
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400 font-normal flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total Workforce
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalWorkforce}</div>
            <p className="text-xs text-green-400 mt-1">+5% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400 font-normal flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Operational Capacity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{capacityScore}%</div>
            <p className="text-xs text-green-400 mt-1">Above target</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400 font-normal flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Efficiency Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{efficiencyScore}%</div>
            <p className="text-xs text-yellow-400 mt-1">Stable</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400 font-normal flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Risk Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">Medium</div>
            <p className="text-xs text-slate-400 mt-1">{criticalRoles} critical roles</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-400 font-normal flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{alerts.length}</div>
            <p className="text-xs text-red-400 mt-1">1 high priority</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Workforce vs Demand Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart id="chart-workforce-demand" data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Line type="monotone" dataKey="workforce" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="demand" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Capacity Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart id="chart-capacity-pie">
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {riskData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-400">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Panel */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Live Operational Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-semibold uppercase text-xs">{alert.severity} Priority</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-sm text-slate-300">{alert.department}</span>
                    </div>
                    <p className="text-sm text-slate-200">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Summary */}
      <Card className="bg-gradient-to-r from-blue-950/50 to-purple-950/50 border-blue-900/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5" />
            AI System Health Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-200 leading-relaxed">
            Your operational system is currently performing at <strong className="text-blue-400">{efficiencyScore}% efficiency</strong> with{' '}
            <strong className="text-green-400">medium operational stability</strong>. Workforce capacity is{' '}
            <strong className="text-blue-400">{capacityScore}%</strong>, which is above target levels. However, there is a detected driver shortage
            in the operations department requiring attention. All {criticalRoles} critical roles are currently staffed, maintaining system resilience.
            Recommended action: Consider temporary workforce reallocation to optimize route planning capacity.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
