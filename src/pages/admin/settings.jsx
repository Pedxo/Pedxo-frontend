import { useState } from "react";
import AdminLayout from "../../components/admin/common/AdminLayout";
import { changePassword } from "../../utility/adminApi.js";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { User, Lock, Shield, Bell, Eye, EyeOff } from "lucide-react";

export default function SettingsPage() {
  const [passwordForm, setPasswordForm] = useState({ 
    currentPassword: "", 
    newPassword: "", 
    confirmPassword: "" 
  });
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    systemAlerts: true,
    weeklyReports: false
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      const result = await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      if (result.ok) {
        alert("Password updated successfully!");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        alert(result.error || "Failed to update password");
      }
    } catch (error) {
      alert("Error updating password: " + error.message);
    }
    setLoading(false);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // This would call updateProfile API when implemented
      alert("Profile update functionality coming soon!");
    } catch (error) {
      alert("Error updating profile: " + error.message);
    }
    setLoading(false);
  };

  const handleNotificationUpdate = async (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    // This would call updateNotificationSettings API when implemented
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <AdminLayout title="Admin Settings">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Profile Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-black">Profile Information</h3>
          </div>
          
          <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="First Name"
              value={profileForm.firstName}
              onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
            />
            <Input
              type="text"
              placeholder="Last Name"
              value={profileForm.lastName}
              onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
            />
            <div className="md:col-span-2">
              <Input
                type="email"
                placeholder="Email Address"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={loading} className="w-full md:w-auto">
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </form>
        </div>

        {/* Password Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 rounded-lg">
              <Lock className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-black">Change Password</h3>
          </div>
          
          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            {/* Current Password */}
            <div className="relative">
              <Input
                type={showPasswords.current ? "text" : "password"}
                placeholder="Current Password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* New Password */}
            <div className="relative">
              <Input
                type={showPasswords.new ? "text" : "password"}
                placeholder="New Password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
                className="pr-10"
                minLength={8}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Input
                type={showPasswords.confirm ? "text" : "password"}
                placeholder="Confirm New Password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
                className="pr-10"
                minLength={8}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Password Requirements */}
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <p className="font-medium mb-1">Password Requirements:</p>
              <ul className="space-y-1">
                <li className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${passwordForm.newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
                  At least 8 characters
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(passwordForm.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`} />
                  One uppercase letter
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${/[0-9]/.test(passwordForm.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`} />
                  One number
                </li>
              </ul>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Bell className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-black">Notification Preferences</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-black">Email Notifications</h4>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
              <button
                onClick={() => handleNotificationUpdate('emailNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-black">System Alerts</h4>
                <p className="text-sm text-gray-600">Important system notifications</p>
              </div>
              <button
                onClick={() => handleNotificationUpdate('systemAlerts')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.systemAlerts ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.systemAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-black">Weekly Reports</h4>
                <p className="text-sm text-gray-600">Weekly summary reports</p>
              </div>
              <button
                onClick={() => handleNotificationUpdate('weeklyReports')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.weeklyReports ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.weeklyReports ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-black">Security Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-black mb-2">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600 mb-3">Add an extra layer of security to your account</p>
              <Button variant="outline" disabled>
                Enable 2FA (Coming Soon)
              </Button>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-black mb-2">Active Sessions</h4>
              <p className="text-sm text-gray-600 mb-3">Manage your active login sessions</p>
              <Button variant="outline" disabled>
                View Sessions (Coming Soon)
              </Button>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}