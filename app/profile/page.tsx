'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { getCurrentUser, isAuthenticated, updateUser, logoutUser } from '@/lib/auth';
import { getCycleEntries, deleteCycleEntry } from '@/lib/cyclePredictions';
import {
  AlertCircle,
  Loader2,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showClearDataConfirm, setShowClearDataConfirm] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    avgCycleLength: '',
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        age: currentUser.age.toString(),
        avgCycleLength: currentUser.avgCycleLength.toString(),
      });
    }
    setLoading(false);
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);

    try {
      if (!user) throw new Error('User not found');

      updateUser(user.id, {
        name: formData.name,
        age: parseInt(formData.age),
        avgCycleLength: parseInt(formData.avgCycleLength),
      });

      // Update local user state
      setUser({
        ...user,
        name: formData.name,
        age: parseInt(formData.age),
        avgCycleLength: parseInt(formData.avgCycleLength),
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      alert('Error saving profile: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    if (showDeleteConfirm) {
      // Delete account and logout
      if (user) {
        // In a real app, you would delete from database
        // For now, just clear localStorage
        localStorage.removeItem(`cycle_entries_${user.id}`);
      }
      logoutUser();
      router.push('/');
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 5000);
    }
  };

  const handleClearData = () => {
    if (showClearDataConfirm) {
      if (user) {
        localStorage.removeItem(`cycle_entries_${user.id}`);
      }
      setShowClearDataConfirm(false);
      router.refresh();
    } else {
      setShowClearDataConfirm(true);
      setTimeout(() => setShowClearDataConfirm(false), 5000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const entriesCount = getCycleEntries(user.id).length;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
          </div>

          {success && (
            <Card className="p-4 mb-6 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900">
              <div className="flex gap-3 items-center">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <p className="text-green-800 dark:text-green-300">Profile updated successfully!</p>
              </div>
            </Card>
          )}

          {/* Profile Information */}
          <Card className="p-6 md:p-8 mb-6 bg-background border-border">
            <h2 className="text-lg font-bold text-foreground mb-6">Profile Information</h2>

            <div className="space-y-4 mb-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="border-border bg-background"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="border-border bg-muted text-muted-foreground cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age" className="text-foreground">
                  Age
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="border-border bg-background"
                />
              </div>

              {/* Average Cycle Length */}
              <div className="space-y-2">
                <Label htmlFor="avgCycleLength" className="text-foreground">
                  Average Cycle Length (days)
                </Label>
                <Input
                  id="avgCycleLength"
                  name="avgCycleLength"
                  type="number"
                  value={formData.avgCycleLength}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="border-border bg-background"
                />
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </Card>

          {/* Preferences */}
          <Card className="p-6 md:p-8 mb-6 bg-background border-border">
            <h2 className="text-lg font-bold text-foreground mb-6">Preferences</h2>

            <div className="space-y-4">
              {/* Notifications */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">Period Reminders</p>
                  <p className="text-sm text-muted-foreground">Get notified before your predicted period</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>

              {/* Data Sharing */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">Share Anonymous Data</p>
                  <p className="text-sm text-muted-foreground">Help improve AI predictions with your data</p>
                </div>
                <Switch checked={dataSharing} onCheckedChange={setDataSharing} />
              </div>
            </div>
          </Card>

          {/* Data Management */}
          <Card className="p-6 md:p-8 mb-6 bg-background border-border">
            <h2 className="text-lg font-bold text-foreground mb-6">Data Management</h2>

            <div className="space-y-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                <p className="text-sm text-blue-900 dark:text-blue-300">
                  <strong>Data Storage:</strong> All your data is stored locally on your device. You have full control and can delete it anytime.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-semibold text-foreground mb-1">Total Entries</p>
                  <p className="text-2xl font-bold text-pink-600">{entriesCount}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-semibold text-foreground mb-1">Account Created</p>
                  <p className="text-sm font-mono text-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 md:p-8 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
            <h2 className="text-lg font-bold text-red-600 dark:text-red-400 mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Danger Zone
            </h2>

            <div className="space-y-3">
              {/* Clear Data */}
              <div className="p-4 rounded-lg bg-background border border-red-200 dark:border-red-900">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">Clear All Data</p>
                    <p className="text-sm text-muted-foreground">Delete all your cycle entries permanently</p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
                    onClick={handleClearData}
                  >
                    {showClearDataConfirm ? 'Confirm Delete' : 'Clear Data'}
                  </Button>
                </div>
              </div>

              {/* Delete Account */}
              <div className="p-4 rounded-lg bg-background border border-red-200 dark:border-red-900">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">Delete Account</p>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
                    onClick={handleDeleteAccount}
                  >
                    {showDeleteConfirm ? 'Confirm Delete' : 'Delete Account'}
                  </Button>
                </div>
              </div>

              {(showDeleteConfirm || showClearDataConfirm) && (
                <div className="p-4 bg-red-100 dark:bg-red-950/50 rounded-lg border border-red-300 dark:border-red-800">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-900 dark:text-red-400">This action cannot be undone</p>
                      <p className="text-sm text-red-800 dark:text-red-300 mt-1">
                        {showDeleteConfirm
                          ? 'Click the button again to permanently delete your account.'
                          : 'Click the button again to permanently delete all your data.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
