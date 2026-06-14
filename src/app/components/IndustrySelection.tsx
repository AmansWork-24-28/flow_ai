import React from 'react';
import { useNavigate } from 'react-router';
import { useAppContext } from '../context/AppContext';
import { industries } from '../data/industries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Truck, Heart, Factory, Bus, Shield, Server } from 'lucide-react';

const iconMap = {
  Truck,
  Heart,
  Factory,
  Bus,
  Shield,
  Server,
};

export function IndustrySelection() {
  const navigate = useNavigate();
  const { setSelectedIndustry } = useAppContext();

  const handleSelect = (industryId: string) => {
    setSelectedIndustry(industryId);
    navigate('/operational-data');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl font-bold text-white mb-4">Select Your Industry</h1>
          <p className="text-slate-400 text-lg">
            Choose the industry that best matches your organization
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry) => {
            const Icon = iconMap[industry.icon as keyof typeof iconMap];
            
            return (
              <Card
                key={industry.id}
                className="bg-slate-900/80 border-slate-800 hover:border-blue-600 transition-all cursor-pointer transform hover:scale-105 hover:shadow-xl hover:shadow-blue-900/20"
                onClick={() => handleSelect(industry.id)}
              >
                <CardHeader>
                  <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl">{industry.name}</CardTitle>
                  <CardDescription className="text-slate-400 text-base">
                    {industry.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>{industry.roles.length} Roles</span>
                    <span>{industry.assets.length} Assets</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
