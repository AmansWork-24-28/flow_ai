import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PlayCircle, AlertTriangle, TrendingDown, TrendingUp, Users, CheckCircle, XCircle } from 'lucide-react';

const scenarios = [
  { id: 'driver-shortage',    name: 'Driver Shortage',       description: 'Simulate impact of reduced driver availability' },
  { id: 'demand-surge',       name: 'Demand Surge',          description: 'High season or unexpected demand increase' },
  { id: 'disaster-response',  name: 'Disaster Response',     description: 'Emergency situation requiring rapid deployment' },
  { id: 'rural-depopulation', name: 'Rural Depopulation',    description: 'Workforce migration from rural areas' },
  { id: 'it-outage',          name: 'IT System Outage',      description: 'Technical infrastructure disruption' },
];

interface StaffRow {
  roleId: string;
  roleName: string;
  total: number;
  present: string;
  isCritical: boolean;
}

function getStrategies(roles: StaffRow[], absenteeRate: number, demandMultiplier: number, stress: string): string[] {
  const strategies: string[] = [];
  const absentRoles = roles.filter(r => {
    const p = parseInt(r.present) || 0;
    return r.total > 0 && p < r.total;
  });
  const criticalAbsent = absentRoles.filter(r => r.isCritical);

  if (criticalAbsent.length > 0) {
    const names = criticalAbsent.map(r => r.roleName).join(', ');
    const gaps = criticalAbsent.map(r => r.total - (parseInt(r.present) || 0));
    const totalGap = gaps.reduce((a, b) => a + b, 0);
    strategies.push(`Immediately activate on-call roster for ${names} — ${totalGap} staff needed to reach full capacity.`);
  }

  if (absenteeRate > 20) {
    strategies.push(`Absentee rate is critically high at ${absenteeRate.toFixed(0)}%. Initiate emergency cross-training for non-critical roles to cover gaps.`);
  } else if (absenteeRate > 10) {
    strategies.push(`Absentee rate of ${absenteeRate.toFixed(0)}% detected. Arrange overtime for available staff to maintain service levels.`);
  }

  if (demandMultiplier > 1.3) {
    strategies.push(`Demand surge (${demandMultiplier.toFixed(1)}x) forecasted. Pre-position resources and notify standby contractors 24 hours ahead.`);
  }

  if (stress === 'high') {
    strategies.push('High operational stress: implement mandatory 30-min rest rotations and deploy stress-management protocols for field teams.');
  }

  const nonCriticalAvailable = roles.filter(r => !r.isCritical && (parseInt(r.present) || 0) >= r.total * 0.9);
  if (nonCriticalAvailable.length > 0 && criticalAbsent.length > 0) {
    strategies.push(`Temporarily reassign ${nonCriticalAvailable[0].roleName} staff to cover critical role shortfalls until normal staffing resumes.`);
  }

  strategies.push('Enable real-time workforce tracking dashboard to monitor live attendance and adjust deployment automatically.');

  if (strategies.length < 4) {
    strategies.push('Review shift scheduling to distribute workload evenly and avoid bottlenecks during peak operational hours.');
  }

  return strategies.slice(0, 5);
}

export function Simulator() {
  const { industryData } = useAppContext();

  const initialRows: StaffRow[] = useMemo(() =>
    (industryData?.roles ?? []).map((role) => ({
      roleId: role.id,
      roleName: role.name,
      total: role.employeeCount || 0,
      present: '',
      isCritical: role.isCritical,
    })),
    [industryData]
  );

  const [staffRows, setStaffRows] = useState<StaffRow[]>(initialRows);
  const [selectedScenario, setSelectedScenario] = useState('');
  const [demandMultiplier, setDemandMultiplier] = useState([1.0]);
  const [stressLevel, setStressLevel] = useState('medium');
  const [simulationRun, setSimulationRun] = useState(false);
  const [results, setResults] = useState<any>(null);

  const updatePresent = (roleId: string, value: string) => {
    setStaffRows(prev => prev.map(r => r.roleId === roleId ? { ...r, present: value } : r));
  };

  // Auto-calculated absentee rate from the table
  const { absenteeRate, totalStaff, totalPresent, totalAbsent } = useMemo(() => {
    const filled = staffRows.filter(r => r.present !== '' && r.total > 0);
    if (filled.length === 0) return { absenteeRate: 0, totalStaff: 0, totalPresent: 0, totalAbsent: 0 };
    const ts = filled.reduce((s, r) => s + r.total, 0);
    const tp = filled.reduce((s, r) => s + Math.min(parseInt(r.present) || 0, r.total), 0);
    const ta = ts - tp;
    return { absenteeRate: ts > 0 ? (ta / ts) * 100 : 0, totalStaff: ts, totalPresent: tp, totalAbsent: ta };
  }, [staffRows]);

  const totalWorkforce = industryData?.roles.reduce((s, r) => s + r.employeeCount, 0) || 0;

  const runSimulation = () => {
    const baseCapacity = 100;
    const absenteeImpact = absenteeRate;
    const demandImpact = (demandMultiplier[0] - 1) * 35;
    const stressImpact = stressLevel === 'high' ? 15 : stressLevel === 'medium' ? 8 : 3;

    const afterCapacity = Math.max(baseCapacity - absenteeImpact - stressImpact - demandImpact, 30);
    const delay = Math.max((100 - afterCapacity) * 1.4, 0);
    const costImpact = Math.max((100 - afterCapacity) * 1200, 0);

    const comparisonData = [
      { metric: 'Capacity',      before: baseCapacity, after: Math.round(afterCapacity) },
      { metric: 'Efficiency',    before: 85,           after: Math.max(Math.round(85 - (100 - afterCapacity) * 0.7), 40) },
      { metric: 'Service Level', before: 95,           after: Math.max(Math.round(95 - delay / 2.5), 45) },
    ];

    setResults({
      capacityDrop: Math.round(baseCapacity - afterCapacity),
      delayImpact: Math.round(delay),
      costImpact,
      riskLevel: afterCapacity < 55 ? 'critical' : afterCapacity < 70 ? 'high' : afterCapacity < 85 ? 'medium' : 'low',
      comparisonData,
      recoveryStrategies: getStrategies(staffRows, absenteeRate, demandMultiplier[0], stressLevel),
      afterCapacity: Math.round(afterCapacity),
    });

    setSimulationRun(true);
  };

  const riskColor = (level: string) =>
    level === 'critical' ? 'text-red-400' : level === 'high' ? 'text-orange-400' : level === 'medium' ? 'text-yellow-400' : 'text-green-400';

  return (
    <div className="space-y-6">
      {/* Top row: Scenarios + Pre-sim metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Select Scenario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {scenarios.map((scenario) => (
              <div
                key={scenario.id}
                onClick={() => setSelectedScenario(scenario.id)}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedScenario === scenario.id
                    ? 'bg-blue-950/50 border-blue-600'
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="font-medium text-white text-sm">{scenario.name}</div>
                <div className="text-xs text-slate-400 mt-1">{scenario.description}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Pre-Simulation Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="text-slate-400 text-sm mb-1">Total Workforce</div>
                <div className="text-2xl font-bold text-white">{totalWorkforce}</div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="text-slate-400 text-sm mb-1">Currently Present</div>
                <div className="text-2xl font-bold text-green-400">{totalPresent || '—'}</div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="text-slate-400 text-sm mb-1">Absent Today</div>
                <div className={`text-2xl font-bold ${totalAbsent > 0 ? 'text-red-400' : 'text-slate-400'}`}>{totalStaff > 0 ? totalAbsent : '—'}</div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="text-slate-400 text-sm mb-1">Absentee Rate</div>
                <div className={`text-2xl font-bold ${absenteeRate > 20 ? 'text-red-400' : absenteeRate > 10 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {totalStaff > 0 ? `${absenteeRate.toFixed(1)}%` : '—'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workforce Attendance Input Table */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-400" />
            <div>
              <CardTitle className="text-white">Current Workforce Attendance</CardTitle>
              <p className="text-slate-400 text-sm mt-0.5">Enter how many staff are present today vs total headcount — absentee rate is calculated automatically</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {staffRows.length === 0 ? (
            <p className="text-slate-400 text-center py-6">Complete the setup steps first to load your workforce roles.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left text-slate-400 font-medium py-3 pr-4">Role</th>
                    <th className="text-center text-slate-400 font-medium py-3 px-4">Total Staff</th>
                    <th className="text-center text-slate-400 font-medium py-3 px-4">Currently Present</th>
                    <th className="text-center text-slate-400 font-medium py-3 px-4">Absent</th>
                    <th className="text-center text-slate-400 font-medium py-3 px-4">Absentee %</th>
                    <th className="text-center text-slate-400 font-medium py-3 pl-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {staffRows.map((row) => {
                    const present = parseInt(row.present) || 0;
                    const absent = row.present !== '' ? Math.max(row.total - present, 0) : null;
                    const pct = row.total > 0 && row.present !== '' ? ((row.total - present) / row.total) * 100 : null;
                    const isSafe = pct !== null && pct <= 10;
                    const isWarning = pct !== null && pct > 10 && pct <= 25;
                    const isCritical = pct !== null && pct > 25;
                    return (
                      <tr key={row.roleId} className="border-b border-slate-800/60 hover:bg-slate-800/30">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{row.roleName}</span>
                            {row.isCritical && (
                              <span className="text-xs bg-red-950/50 text-red-400 border border-red-900/50 px-1.5 py-0.5 rounded">Critical</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center text-slate-300">{row.total}</td>
                        <td className="py-3 px-4 text-center">
                          <Input
                            type="number"
                            min="0"
                            max={row.total}
                            value={row.present}
                            onChange={(e) => updatePresent(row.roleId, e.target.value)}
                            placeholder={`0–${row.total}`}
                            className="bg-slate-800 border-slate-700 text-white w-24 mx-auto text-center h-8"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={absent !== null && absent > 0 ? 'text-red-400 font-semibold' : 'text-slate-400'}>
                            {absent !== null ? absent : '—'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {pct !== null ? (
                            <span className={`font-semibold ${isCritical ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-green-400'}`}>
                              {pct.toFixed(0)}%
                            </span>
                          ) : <span className="text-slate-500">—</span>}
                        </td>
                        <td className="py-3 pl-4 text-center">
                          {pct !== null ? (
                            isSafe
                              ? <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
                              : <XCircle className={`w-4 h-4 mx-auto ${isCritical ? 'text-red-400' : 'text-yellow-400'}`} />
                          ) : <span className="text-slate-600">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {/* Visual absentee summary bar */}
          {totalStaff > 0 && (
            <div className="mt-5 pt-4 border-t border-slate-800">
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>Overall Attendance</span>
                <span>{totalPresent} / {totalStaff} present ({(100 - absenteeRate).toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${absenteeRate > 25 ? 'bg-red-500' : absenteeRate > 10 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.max(100 - absenteeRate, 0)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-green-400">{totalPresent} Present</span>
                <span className="text-red-400">{totalAbsent} Absent ({absenteeRate.toFixed(1)}%)</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Simulation Parameters */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Simulation Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Absentee Rate — auto-calculated, read-only */}
          <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-slate-300 font-medium">Absentee Rate (auto-calculated)</label>
              <span className={`font-bold text-lg ${absenteeRate > 25 ? 'text-red-400' : absenteeRate > 10 ? 'text-yellow-400' : 'text-green-400'}`}>
                {absenteeRate.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${absenteeRate > 25 ? 'bg-red-500' : absenteeRate > 10 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(absenteeRate * 2, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Derived from attendance table above — fill in "Currently Present" to update</p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-slate-300">Demand Multiplier</label>
              <span className="text-blue-400 font-medium">{demandMultiplier[0].toFixed(1)}x</span>
            </div>
            <Slider value={demandMultiplier} onValueChange={setDemandMultiplier} min={0.5} max={2.0} step={0.1} className="w-full" />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>0.5x (Low)</span><span>1.0x (Normal)</span><span>2.0x (Surge)</span>
            </div>
          </div>

          <div>
            <label className="text-slate-300 block mb-2">Operational Stress Level</label>
            <Select value={stressLevel} onValueChange={setStressLevel}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Stress</SelectItem>
                <SelectItem value="medium">Medium Stress</SelectItem>
                <SelectItem value="high">High Stress</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={runSimulation}
            disabled={!selectedScenario || totalStaff === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 h-12"
          >
            <PlayCircle className="w-5 h-5 mr-2" />
            Run Simulation
          </Button>
          {!selectedScenario && <p className="text-xs text-slate-500 text-center -mt-4">Select a scenario and fill attendance data to run</p>}
        </CardContent>
      </Card>

      {/* Results */}
      {simulationRun && results && (
        <>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                Simulation Results
                <span className={`text-sm font-normal px-2 py-0.5 rounded border ${
                  results.riskLevel === 'critical' ? 'bg-red-950/40 border-red-800 text-red-400'
                  : results.riskLevel === 'high' ? 'bg-orange-950/40 border-orange-800 text-orange-400'
                  : results.riskLevel === 'medium' ? 'bg-yellow-950/40 border-yellow-800 text-yellow-400'
                  : 'bg-green-950/40 border-green-800 text-green-400'
                }`}>
                  {results.riskLevel.toUpperCase()} RISK
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart id="chart-sim-results" data={results.comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="metric" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} domain={[0, 100]} unit="%" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    formatter={(v: number, name: string) => [`${v}%`, name === 'before' ? 'Before' : 'After Scenario']}
                  />
                  <Bar dataKey="before" fill="#3b82f6" name="before" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="after"  fill="#8b5cf6" name="after"  radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-400 font-normal flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" /> Capacity Drop
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-400">-{results.capacityDrop}%</div>
                <div className="text-xs text-slate-500 mt-1">from 100% baseline</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-400 font-normal flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Delay Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-400">+{results.delayImpact}%</div>
                <div className="text-xs text-slate-500 mt-1">service delay increase</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-400 font-normal flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Cost Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-400">₹{(results.costImpact / 1000).toFixed(1)}K</div>
                <div className="text-xs text-slate-500 mt-1">estimated loss</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-400 font-normal flex items-center gap-2">
                  <Users className="w-4 h-4" /> Remaining Capacity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${riskColor(results.riskLevel)}`}>{results.afterCapacity}%</div>
                <div className="text-xs text-slate-500 mt-1">operational level</div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-blue-950/50 to-purple-950/50 border-blue-900/50">
            <CardHeader>
              <CardTitle className="text-white">AI Recovery Strategies</CardTitle>
              <p className="text-slate-400 text-sm mt-1">Based on your actual attendance data and scenario parameters</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {results.recoveryStrategies.map((strategy: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 text-slate-200">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold">{index + 1}</span>
                    </div>
                    <span>{strategy}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
