import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppContext } from '../context/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 
  'Japan', 'India', 'China', 'Brazil', 'Mexico', 'Singapore', 'Netherlands'
];

const regionsByCountry: Record<string, string[]> = {
  'United States': ['Northeast', 'Southeast', 'Midwest', 'Southwest', 'West'],
  'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
  'Canada': ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba'],
  'Australia': ['New South Wales', 'Victoria', 'Queensland', 'Western Australia'],
  'Germany': ['Bavaria', 'Baden-Württemberg', 'North Rhine-Westphalia', 'Hesse'],
  'France': ['Île-de-France', 'Auvergne-Rhône-Alpes', 'Provence-Alpes-Côte d\'Azur'],
  'Japan': ['Kanto', 'Kansai', 'Chubu', 'Kyushu'],
  'India': ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Gujarat'],
  'China': ['Beijing', 'Shanghai', 'Guangdong', 'Zhejiang'],
  'Brazil': ['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia'],
  'Mexico': ['Mexico City', 'Jalisco', 'Nuevo León', 'Guanajuato'],
  'Singapore': ['Central', 'East', 'West', 'North', 'Northeast'],
  'Netherlands': ['North Holland', 'South Holland', 'Utrecht', 'North Brabant']
};

export function CompanySetup() {
  const navigate = useNavigate();
  const { setCompanyProfile } = useAppContext();
  
  const [formData, setFormData] = useState({
    companyName: '',
    country: '',
    region: '',
    managerName: '',
    email: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCountryChange = (country: string) => {
    setFormData({ ...formData, country, region: '' });
    setErrors({ ...errors, country: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.companyName) newErrors.companyName = 'Company name is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.region) newErrors.region = 'Region is required';
    if (!formData.managerName) newErrors.managerName = 'Manager name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setCompanyProfile(formData);
    navigate('/industry-selection');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl bg-slate-900/80 border-slate-800">
        <CardHeader className="text-center">
          <div className="mb-4 mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold text-white">Welcome to FlowAI</CardTitle>
          <CardDescription className="text-slate-400 text-lg">
            Intelligent Workforce Operations Platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-slate-200">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="Enter your company name"
              />
              {errors.companyName && <p className="text-sm text-red-400">{errors.companyName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="text-slate-200">Country</Label>
              <Select value={formData.country} onValueChange={handleCountryChange}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && <p className="text-sm text-red-400">{errors.country}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="region" className="text-slate-200">Region</Label>
              <Select 
                value={formData.region} 
                onValueChange={(region) => setFormData({ ...formData, region })}
                disabled={!formData.country}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder={formData.country ? "Select region" : "Select country first"} />
                </SelectTrigger>
                <SelectContent>
                  {formData.country && regionsByCountry[formData.country]?.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.region && <p className="text-sm text-red-400">{errors.region}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="managerName" className="text-slate-200">Manager Name</Label>
              <Input
                id="managerName"
                value={formData.managerName}
                onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="Enter manager name"
              />
              {errors.managerName && <p className="text-sm text-red-400">{errors.managerName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">Official Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="manager@company.com"
              />
              {errors.email && <p className="text-sm text-red-400">{errors.email}</p>}
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg">
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
