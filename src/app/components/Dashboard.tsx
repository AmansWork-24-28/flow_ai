import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppContext } from '../context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { DashboardOverview } from './dashboard/DashboardOverview';
import { Simulator } from './dashboard/Simulator';
import { Routes } from './dashboard/Routes';
import { AIInsights } from './dashboard/AIInsights';
import { Analytics } from './dashboard/Analytics';
import { LayoutDashboard, Gauge, Route, Brain, BarChart3, LogOut } from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();
  const { companyProfile, selectedIndustry, industryData } = useAppContext();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (!industryData) {
      navigate('/');
    }
  }, [industryData, navigate]);

  const handleLogout = () => {
    if (confirm('Are you sure you want to exit? All data will be reset.')) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Header */}
      <div className="bg-slate-900/80 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">FlowAI Platform</h1>
                <p className="text-sm text-slate-400">{companyProfile?.companyName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <div className="text-sm text-slate-400">Logged in as</div>
                <div className="text-white font-medium">{companyProfile?.managerName}</div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-slate-700 text-slate-300 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Exit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-900/50 border border-slate-800 p-1 w-full justify-start overflow-x-auto">
            <TabsTrigger
              value="dashboard"
              className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:text-white"
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="simulator"
              className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:text-white"
            >
              <Gauge className="w-4 h-4 mr-2" />
              Simulator
            </TabsTrigger>
            <TabsTrigger
              value="routes"
              className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:text-white"
            >
              <Route className="w-4 h-4 mr-2" />
              Routes
            </TabsTrigger>
            <TabsTrigger
              value="ai-insights"
              className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:text-white"
            >
              <Brain className="w-4 h-4 mr-2" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:text-white"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="simulator" className="mt-6">
            <Simulator />
          </TabsContent>

          <TabsContent value="routes" className="mt-6">
            <Routes />
          </TabsContent>

          <TabsContent value="ai-insights" className="mt-6">
            <AIInsights />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Analytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
