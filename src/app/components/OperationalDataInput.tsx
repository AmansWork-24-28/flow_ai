import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppContext, Role } from '../context/AppContext';
import { industries } from '../data/industries';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Trash2 } from 'lucide-react';

interface AssetEntry {
  name: string;
  quantity: string;
}

export function OperationalDataInput() {
  const navigate = useNavigate();
  const { selectedIndustry, setIndustryData } = useAppContext();
  const [roles, setRoles] = useState<Role[]>([]);
  const [assets, setAssets] = useState<AssetEntry[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState({
    name: '',
    employeeCount: '',
    isCritical: false,
  });

  useEffect(() => {
    if (!selectedIndustry) {
      navigate('/industry-selection');
      return;
    }

    const industry = industries.find((i) => i.id === selectedIndustry);
    if (industry) {
      const initialRoles: Role[] = industry.roles.map((role, index) => ({
        id: `role-${index}`,
        name: role.name,
        employeeCount: 0,
        isCritical: role.isCritical,
      }));
      setRoles(initialRoles);

      const initialAssets: AssetEntry[] = industry.assets.map((asset) => ({
        name: asset.name,
        quantity: '',
      }));
      setAssets(initialAssets);
    }
  }, [selectedIndustry, navigate]);

  const industry = industries.find((i) => i.id === selectedIndustry);

  const handleRoleUpdate = (id: string, field: keyof Role, value: any) => {
    setRoles(roles.map((role) => (role.id === id ? { ...role, [field]: value } : role)));
  };

  const handleAssetUpdate = (index: number, quantity: string) => {
    setAssets(assets.map((a, i) => (i === index ? { ...a, quantity } : a)));
  };

  const handleAddRole = () => {
    const count = parseInt(newRole.employeeCount);
    if (!newRole.name || isNaN(count) || count <= 0) return;

    const role: Role = {
      id: `custom-${Date.now()}`,
      name: newRole.name,
      employeeCount: count,
      isCritical: newRole.isCritical,
    };

    setRoles([...roles, role]);
    setNewRole({ name: '', employeeCount: '', isCritical: false });
    setDialogOpen(false);
  };

  const handleDeleteRole = (id: string) => {
    setRoles(roles.filter((role) => role.id !== id));
  };

  const handleSubmit = () => {
    if (roles.length === 0) return;

    const assetData = assets.map((a) => ({
      name: a.name,
      count: parseInt(a.quantity) || 0,
    }));

    setIndustryData({ roles, assets: assetData });
    navigate('/dashboard');
  };

  if (!industry) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 pt-8">
          <h1 className="text-4xl font-bold text-white mb-2">Configure {industry.name}</h1>
          <p className="text-slate-400 text-lg">Define your workforce structure and operational capacity</p>
        </div>

        {/* Workforce Roles */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Workforce Roles</h2>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Role
            </Button>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="bg-slate-900 border-slate-800 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Add Custom Role</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Create a new role specific to your organization
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label className="text-slate-200">Role Name</Label>
                  <Input
                    value={newRole.name}
                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white mt-1"
                    placeholder="e.g., Operations Manager"
                  />
                </div>
                <div>
                  <Label className="text-slate-200">Number of Employees</Label>
                  <Input
                    type="number"
                    min="1"
                    value={newRole.employeeCount}
                    onChange={(e) => setNewRole({ ...newRole, employeeCount: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white mt-1"
                    placeholder="Enter count"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="critical"
                    checked={newRole.isCritical}
                    onCheckedChange={(checked) => setNewRole({ ...newRole, isCritical: checked as boolean })}
                  />
                  <Label htmlFor="critical" className="text-slate-200">Mark as Critical Role</Label>
                </div>
                <Button onClick={handleAddRole} className="w-full bg-blue-600 hover:bg-blue-700">
                  Add Role
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-slate-800/50">
                  <TableHead className="text-slate-300">Role Name</TableHead>
                  <TableHead className="text-slate-300">Number of Employees</TableHead>
                  <TableHead className="text-slate-300">Critical Role</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="text-white font-medium">{role.name}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={role.employeeCount === 0 ? '' : role.employeeCount}
                        onChange={(e) => handleRoleUpdate(role.id, 'employeeCount', parseInt(e.target.value) || 0)}
                        className="bg-slate-800 border-slate-700 text-white w-32"
                        placeholder="Enter count"
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={role.isCritical}
                        onCheckedChange={(checked) => handleRoleUpdate(role.id, 'isCritical', checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRole(role.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Assets Section */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-white mb-2">Assets & Resources</h2>
          <p className="text-slate-400 text-sm mb-6">Enter the quantity for each asset type in your organization</p>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-slate-800/50">
                  <TableHead className="text-slate-300">Asset Name</TableHead>
                  <TableHead className="text-slate-300">Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((asset, index) => (
                  <TableRow key={index} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="text-white font-medium">{asset.name}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        value={asset.quantity}
                        onChange={(e) => handleAssetUpdate(index, e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white w-32"
                        placeholder="Enter quantity"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => navigate('/industry-selection')} className="border-slate-700 text-slate-300">
            Back
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 px-8">
            Continue to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
