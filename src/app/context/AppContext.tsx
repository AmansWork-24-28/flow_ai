import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CompanyProfile {
  companyName: string;
  country: string;
  region: string;
  managerName: string;
  email: string;
}

export interface Role {
  id: string;
  name: string;
  employeeCount: number;
  isCritical: boolean;
  priorityLevel?: number;
}

export interface Asset {
  name: string;
  count: number;
}

export interface IndustryData {
  roles: Role[];
  assets: Asset[];
}

interface AppContextType {
  companyProfile: CompanyProfile | null;
  setCompanyProfile: (profile: CompanyProfile) => void;
  selectedIndustry: string | null;
  setSelectedIndustry: (industry: string) => void;
  industryData: IndustryData | null;
  setIndustryData: (data: IndustryData) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [industryData, setIndustryData] = useState<IndustryData | null>(null);

  return (
    <AppContext.Provider
      value={{
        companyProfile,
        setCompanyProfile,
        selectedIndustry,
        setSelectedIndustry,
        industryData,
        setIndustryData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
