import { useState, useEffect } from 'react';
import { adminService, type HospitalSettings, type SystemSettings, type NotificationSettings, type SecuritySettings, type AppearanceSettings, type AllAdminSettings } from '@/lib/services/admin-service';
import { useAuth } from '@/lib/auth-context';

export function useAdminSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adminId = user?._id;

  const fetchHospitalSettings = async (): Promise<HospitalSettings | null> => {
    if (!adminId) return null;
    try {
      setLoading(true);
      setError(null);
      const settings = await adminService.getHospitalSettings(adminId);
      return settings;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hospital settings');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateHospitalSettings = async (settings: HospitalSettings): Promise<boolean> => {
    if (!adminId) return false;
    try {
      setLoading(true);
      setError(null);
      await adminService.updateHospitalSettings(adminId, settings);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update hospital settings');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemSettings = async (): Promise<SystemSettings | null> => {
    if (!adminId) return null;
    try {
      setLoading(true);
      setError(null);
      const settings = await adminService.getSystemSettings(adminId);
      return settings;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch system settings');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSystemSettings = async (settings: SystemSettings): Promise<boolean> => {
    if (!adminId) return false;
    try {
      setLoading(true);
      setError(null);
      await adminService.updateSystemSettings(adminId, settings);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update system settings');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchNotificationSettings = async (): Promise<NotificationSettings | null> => {
    if (!adminId) return null;
    try {
      setLoading(true);
      setError(null);
      const settings = await adminService.getNotificationSettings(adminId);
      return settings;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notification settings');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateNotificationSettings = async (settings: NotificationSettings): Promise<boolean> => {
    if (!adminId) return false;
    try {
      setLoading(true);
      setError(null);
      await adminService.updateNotificationSettings(adminId, settings);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update notification settings');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchSecuritySettings = async (): Promise<SecuritySettings | null> => {
    if (!adminId) return null;
    try {
      setLoading(true);
      setError(null);
      const settings = await adminService.getSecuritySettings(adminId);
      return settings;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch security settings');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSecuritySettings = async (settings: SecuritySettings): Promise<boolean> => {
    if (!adminId) return false;
    try {
      setLoading(true);
      setError(null);
      await adminService.updateSecuritySettings(adminId, settings);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update security settings');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchAppearanceSettings = async (): Promise<AppearanceSettings | null> => {
    if (!adminId) return null;
    try {
      setLoading(true);
      setError(null);
      const settings = await adminService.getAppearanceSettings(adminId);
      return settings;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch appearance settings');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateAppearanceSettings = async (settings: AppearanceSettings): Promise<boolean> => {
    if (!adminId) return false;
    try {
      setLoading(true);
      setError(null);
      await adminService.updateAppearanceSettings(adminId, settings);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update appearance settings');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSettings = async (): Promise<AllAdminSettings | null> => {
    if (!adminId) return null;
    try {
      setLoading(true);
      setError(null);
      const settings = await adminService.getAllSettings(adminId);
      return settings;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch all settings');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const uploadLogo = async (file: File): Promise<string | null> => {
    if (!adminId) return null;
    try {
      setLoading(true);
      setError(null);
      const result = await adminService.uploadHospitalLogo(adminId, file);
      return result.logo_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload logo');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    // Hospital settings
    fetchHospitalSettings,
    updateHospitalSettings,
    // System settings
    fetchSystemSettings,
    updateSystemSettings,
    // Notification settings
    fetchNotificationSettings,
    updateNotificationSettings,
    // Security settings
    fetchSecuritySettings,
    updateSecuritySettings,
    // Appearance settings
    fetchAppearanceSettings,
    updateAppearanceSettings,
    // All settings
    fetchAllSettings,
    // Logo upload
    uploadLogo,
    // Clear error
    clearError: () => setError(null),
  };
}
