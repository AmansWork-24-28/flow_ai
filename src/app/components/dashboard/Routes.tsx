import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MapPin, TrendingUp, AlertCircle, CheckCircle, Fuel, DollarSign, Zap, Leaf } from 'lucide-react';
import { LiveRouteMap } from './LiveRouteMap';

interface RouteEntry {
  id: string;
  name: string;
  efficiency: number;
  status: string;
  nodes: number;
  fuelCurrent: number;   // litres
  fuelOptimized: number; // litres
}

export function Routes() {
  const { selectedIndustry } = useAppContext();
  // selectedIndustry is passed to LiveRouteMap for industry-specific node layout
  const [optimized, setOptimized] = useState(false);

  const FUEL_COST_PER_LITRE = 100; // ₹ per litre

  const getRoutesByIndustry = (): { title: string; routes: RouteEntry[]; type: string } => {
    switch (selectedIndustry) {
      case 'logistics':
        return {
          title: 'Delivery Routes & Distribution Flow',
          routes: [
            { id: 'R1', name: 'North Zone Distribution', efficiency: 92, status: 'optimal', nodes: 15, fuelCurrent: 320, fuelOptimized: 265 },
            { id: 'R2', name: 'Central Warehouse Flow', efficiency: 78, status: 'congested', nodes: 22, fuelCurrent: 480, fuelOptimized: 370 },
            { id: 'R3', name: 'South Zone Express', efficiency: 88, status: 'optimal', nodes: 18, fuelCurrent: 290, fuelOptimized: 245 },
            { id: 'R4', name: 'East Region Logistics', efficiency: 65, status: 'bottleneck', nodes: 28, fuelCurrent: 610, fuelOptimized: 445 },
          ],
          type: 'Delivery Routes',
        };
      case 'healthcare':
        return {
          title: 'Ambulance & Emergency Routes',
          routes: [
            { id: 'E1', name: 'Emergency Zone A', efficiency: 95, status: 'optimal', nodes: 8, fuelCurrent: 140, fuelOptimized: 118 },
            { id: 'E2', name: 'Hospital Transfer Route', efficiency: 82, status: 'optimal', nodes: 12, fuelCurrent: 210, fuelOptimized: 178 },
            { id: 'E3', name: 'Rural Emergency Path', efficiency: 71, status: 'congested', nodes: 16, fuelCurrent: 380, fuelOptimized: 295 },
            { id: 'E4', name: 'Critical Care Network', efficiency: 88, status: 'optimal', nodes: 10, fuelCurrent: 175, fuelOptimized: 148 },
          ],
          type: 'Emergency Routes',
        };
      case 'manufacturing':
        return {
          title: 'Production Line Flow',
          routes: [
            { id: 'P1', name: 'Assembly Line A', efficiency: 91, status: 'optimal', nodes: 6, fuelCurrent: 95, fuelOptimized: 80 },
            { id: 'P2', name: 'Quality Control Flow', efficiency: 76, status: 'congested', nodes: 8, fuelCurrent: 145, fuelOptimized: 110 },
            { id: 'P3', name: 'Packaging & Distribution', efficiency: 85, status: 'optimal', nodes: 5, fuelCurrent: 120, fuelOptimized: 98 },
            { id: 'P4', name: 'Raw Material Supply', efficiency: 68, status: 'bottleneck', nodes: 10, fuelCurrent: 220, fuelOptimized: 162 },
          ],
          type: 'Production Flow',
        };
      case 'transport':
        return {
          title: 'Transit Network Optimization',
          routes: [
            { id: 'T1', name: 'Metro Line Blue', efficiency: 89, status: 'optimal', nodes: 25, fuelCurrent: 520, fuelOptimized: 435 },
            { id: 'T2', name: 'Bus Route 42', efficiency: 72, status: 'congested', nodes: 32, fuelCurrent: 740, fuelOptimized: 560 },
            { id: 'T3', name: 'Express Line Green', efficiency: 94, status: 'optimal', nodes: 18, fuelCurrent: 390, fuelOptimized: 335 },
            { id: 'T4', name: 'Suburban Connection', efficiency: 64, status: 'bottleneck', nodes: 40, fuelCurrent: 880, fuelOptimized: 640 },
          ],
          type: 'Transit Routes',
        };
      case 'municipal':
        return {
          title: 'Emergency Response Network',
          routes: [
            { id: 'M1', name: 'Disaster Zone Alpha', efficiency: 87, status: 'optimal', nodes: 12, fuelCurrent: 265, fuelOptimized: 218 },
            { id: 'M2', name: 'Utility Response Grid', efficiency: 75, status: 'congested', nodes: 20, fuelCurrent: 410, fuelOptimized: 320 },
            { id: 'M3', name: 'Emergency Dispatch Flow', efficiency: 91, status: 'optimal', nodes: 14, fuelCurrent: 230, fuelOptimized: 192 },
          ],
          type: 'Response Routes',
        };
      default:
        return {
          title: 'System Infrastructure Flow',
          routes: [
            { id: 'S1', name: 'Server Cluster A', efficiency: 96, status: 'optimal', nodes: 8, fuelCurrent: 80, fuelOptimized: 68 },
            { id: 'S2', name: 'Cloud Backup Route', efficiency: 83, status: 'optimal', nodes: 6, fuelCurrent: 120, fuelOptimized: 98 },
            { id: 'S3', name: 'Network Distribution', efficiency: 77, status: 'congested', nodes: 12, fuelCurrent: 195, fuelOptimized: 148 },
          ],
          type: 'Infrastructure',
        };
    }
  };

  const routeData = getRoutesByIndustry();

  const totalFuelCurrent = routeData.routes.reduce((s, r) => s + r.fuelCurrent, 0);
  const totalFuelOptimized = routeData.routes.reduce((s, r) => s + r.fuelOptimized, 0);
  const fuelSaved = totalFuelCurrent - totalFuelOptimized;
  const fuelSavingPct = Math.round((fuelSaved / totalFuelCurrent) * 100);
  const costBefore = totalFuelCurrent * FUEL_COST_PER_LITRE;
  const costAfter = totalFuelOptimized * FUEL_COST_PER_LITRE;
  const costSaved = costBefore - costAfter;
  const avgEfficiencyBefore = Math.round(routeData.routes.reduce((s, r) => s + r.efficiency, 0) / routeData.routes.length);
  const avgEfficiencyAfter = Math.min(100, avgEfficiencyBefore + Math.round(fuelSavingPct * 0.8));
  const efficiencyGain = avgEfficiencyAfter - avgEfficiencyBefore;
  const emissionReduction = Math.round(fuelSaved * 2.68); // ~2.68 kg CO₂ per litre

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-950/20 text-green-400 border-green-900';
      case 'congested': return 'bg-yellow-950/20 text-yellow-400 border-yellow-900';
      case 'bottleneck': return 'bg-red-950/20 text-red-400 border-red-900';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimal': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatCurrency = (n: number) =>
    n >= 100000
      ? `₹${(n / 100000).toFixed(1)}L`
      : `₹${n.toLocaleString('en-IN')}`;

  return (
    <div className="space-y-6">
      {/* Live Route Map */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              Live Route Map
            </CardTitle>
            <p className="text-slate-400 text-sm mt-1">Real-time vehicle positions and route status — updates every second</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse inline-block" />
              LIVE
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <LiveRouteMap industryId={selectedIndustry} optimized={optimized} />
        </CardContent>
      </Card>

      {/* Routes list */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">{routeData.title}</CardTitle>
          <Button
            className={optimized ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}
            onClick={() => setOptimized(!optimized)}
          >
            {optimized ? <CheckCircle className="w-4 h-4 mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
            {optimized ? 'Optimized' : 'Run Optimization'}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {routeData.routes.map((route) => {
              const displayFuel = optimized ? route.fuelOptimized : route.fuelCurrent;
              const displayEfficiency = optimized ? Math.min(100, route.efficiency + Math.round((route.fuelCurrent - route.fuelOptimized) / route.fuelCurrent * 80)) : route.efficiency;
              return (
                <div
                  key={route.id}
                  className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-blue-600 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-blue-400 font-semibold">{route.id}</span>
                        <h3 className="text-white font-semibold">{route.name}</h3>
                        <Badge className={`${getStatusColor(optimized ? 'optimal' : route.status)} flex items-center gap-1`}>
                          {getStatusIcon(optimized ? 'optimal' : route.status)}
                          {optimized ? 'optimized' : route.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {route.nodes} Nodes
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {displayEfficiency}% Efficiency
                        </div>
                        <div className="flex items-center gap-1">
                          <Fuel className="w-3 h-3" />
                          {displayFuel}L fuel
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{displayEfficiency}%</div>
                      {optimized && (
                        <div className="text-green-400 text-xs mt-1">
                          -{route.fuelCurrent - route.fuelOptimized}L saved
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        displayEfficiency >= 85 ? 'bg-green-500' : displayEfficiency >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${displayEfficiency}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Fuel Optimization Metrics */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Fuel className="w-5 h-5 text-blue-400" />
            Fuel Optimization Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
              <div className="text-slate-400 text-xs mb-1">Current Consumption</div>
              <div className="text-white text-2xl font-bold">{totalFuelCurrent}L</div>
              <div className="text-slate-500 text-xs mt-1">total / cycle</div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
              <div className="text-slate-400 text-xs mb-1">Optimized Consumption</div>
              <div className="text-green-400 text-2xl font-bold">{totalFuelOptimized}L</div>
              <div className="text-slate-500 text-xs mt-1">after optimization</div>
            </div>
            <div className="bg-green-950/30 border border-green-900/50 rounded-lg p-4">
              <div className="text-slate-400 text-xs mb-1">Fuel Saved</div>
              <div className="text-green-400 text-2xl font-bold">{fuelSaved}L</div>
              <div className="text-green-500 text-xs mt-1">per cycle</div>
            </div>
            <div className="bg-blue-950/30 border border-blue-900/50 rounded-lg p-4">
              <div className="text-slate-400 text-xs mb-1">Saving %</div>
              <div className="text-blue-400 text-2xl font-bold">{fuelSavingPct}%</div>
              <div className="text-blue-500 text-xs mt-1">reduction</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Savings Metrics */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-yellow-400" />
            Cost Savings Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
              <div className="text-slate-400 text-xs mb-1">Cost per Litre</div>
              <div className="text-white text-2xl font-bold">₹{FUEL_COST_PER_LITRE}</div>
              <div className="text-slate-500 text-xs mt-1">per litre</div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
              <div className="text-slate-400 text-xs mb-1">Fuel Cost (Before)</div>
              <div className="text-red-400 text-2xl font-bold">{formatCurrency(costBefore)}</div>
              <div className="text-slate-500 text-xs mt-1">current spend</div>
            </div>
            <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
              <div className="text-slate-400 text-xs mb-1">Fuel Cost (After)</div>
              <div className="text-green-400 text-2xl font-bold">{formatCurrency(costAfter)}</div>
              <div className="text-slate-500 text-xs mt-1">optimized spend</div>
            </div>
            <div className="bg-yellow-950/30 border border-yellow-900/50 rounded-lg p-4">
              <div className="text-slate-400 text-xs mb-1">Total Cost Saved</div>
              <div className="text-yellow-400 text-2xl font-bold">{formatCurrency(costSaved)}</div>
              <div className="text-yellow-500 text-xs mt-1">per cycle</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Savings Summary Card */}
      <Card className="bg-gradient-to-r from-green-950/40 to-blue-950/40 border-green-900/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Savings Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Fuel className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-green-400 text-2xl font-bold">{fuelSaved} L</div>
              <div className="text-slate-400 text-sm mt-1">Fuel Saved</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-yellow-400 text-2xl font-bold">{formatCurrency(costSaved)}</div>
              <div className="text-slate-400 text-sm mt-1">Cost Saved</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Leaf className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-blue-400 text-2xl font-bold">{emissionReduction} kg</div>
              <div className="text-slate-400 text-sm mt-1">CO₂ Reduction</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-purple-400 text-2xl font-bold">+{efficiencyGain}%</div>
              <div className="text-slate-400 text-sm mt-1">Efficiency Improvement</div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-700/50 text-center">
            <p className="text-slate-400 text-sm">
              Metrics update dynamically when route optimization is applied. Click <span className="text-blue-400 font-medium">Run Optimization</span> above to see live results.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Route Issues */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Route Issue Detection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="bg-red-950/20 border border-red-900 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                <div>
                  <div className="text-red-400 font-semibold mb-1">Critical Bottleneck Detected</div>
                  <p className="text-slate-300 text-sm">
                    Route {routeData.routes.find((r) => r.status === 'bottleneck')?.id || 'R4'} experiencing high congestion at nodes 12-15.
                    Causing 18% delay in overall operations.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-950/20 border border-yellow-900 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <div className="text-yellow-400 font-semibold mb-1">Congestion Warning</div>
                  <p className="text-slate-300 text-sm">
                    Multiple routes showing reduced efficiency during peak hours (8-10 AM, 5-7 PM).
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-green-950/20 border border-green-900 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <div className="text-green-400 font-semibold mb-1">Optimal Performance</div>
                  <p className="text-slate-300 text-sm">
                    {routeData.routes.filter((r) => r.status === 'optimal').length} routes operating at optimal efficiency levels.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Optimization */}
      <Card className="bg-gradient-to-r from-blue-950/50 to-purple-950/50 border-blue-900/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            AI Route Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {[
              'Redistribute load from bottleneck routes to optimal ones for 12% efficiency gain',
              'Implement dynamic scheduling on congested routes during peak hours',
              'Add 2 additional nodes to high-traffic routes to reduce bottlenecks',
              'Cross-route resource sharing could improve overall efficiency by 8%',
            ].map((suggestion, index) => (
              <li key={index} className="flex items-start gap-3 text-slate-200">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">{index + 1}</span>
                </div>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
