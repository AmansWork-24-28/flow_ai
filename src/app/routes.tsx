import { createBrowserRouter } from 'react-router';
import { CompanySetup } from './components/CompanySetup';
import { IndustrySelection } from './components/IndustrySelection';
import { OperationalDataInput } from './components/OperationalDataInput';
import { Dashboard } from './components/Dashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: CompanySetup,
  },
  {
    path: '/industry-selection',
    Component: IndustrySelection,
  },
  {
    path: '/operational-data',
    Component: OperationalDataInput,
  },
  {
    path: '/dashboard',
    Component: Dashboard,
  },
]);
