'use client';

import { useState, useEffect } from 'react';
import { adminService, type HospitalSettings, type SystemSettings, type NotificationSettings, type SecuritySettings, type AppearanceSettings } from '@/lib/services/admin-service';
import { useAuth } from '@/lib/auth-context';

export interface AdminSettingsState {
  hospital: HospitalSettings | null;
  system: SystemSettings | null;
  notifications: NotificationSettings | null;
  security: SecuritySettings | null;
  appearance: AppearanceSettings | null;
  isLoading: boolean;
  error: string | null;
}

export const useAdminSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AdminSettingsState>({
    hospital: null,
    system: null,
    notifications: null,
    security: null,
    appearance: null,
    isLoading: false,
    error: null,
  });

  const adminId = user?._id;

  const loadSettings = async () => {
    if (!adminId) return;

    setSettings(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const [hospital, system, notifications, security, appearance] = await Promise.all([
        adminService.getHospitalSettings(adminId),
        adminService.getSystemSettings(adminId),
        adminService.getNotificationSettings(adminId),
        adminService.getSecuritySettings(adminId),
        adminService.getAppearanceSettings(adminId),
      ]);

      setSettings({
        hospital,
        system,
        notifications,
        security,
        appearance,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error loading admin settings:', error);
      setSettings(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load settings',
      }));
    }
  };

  // Individual fetch functions for specific settings
  const fetchHospitalSettings = async () => {
    if (!adminId) return null;
    try {
      const hospital = await adminService.getHospitalSettings(adminId);
      setSettings(prev => ({ ...prev, hospital }));
      return hospital;
    } catch (error) {
      console.error('Error fetching hospital settings:', error);
      throw error;
    }
  };

  const fetchSystemSettings = async () => {
    if (!adminId) return null;
    try {
      const system = await adminService.getSystemSettings(adminId);
      setSettings(prev => ({ ...prev, system }));
      return system;
    } catch (error) {
      console.error('Error fetching system settings:', error);
      throw error;
    }
  };

  const fetchNotificationSettings = async () => {
    if (!adminId) return null;
    try {
      const notifications = await adminService.getNotificationSettings(adminId);
      setSettings(prev => ({ ...prev, notifications }));
      return notifications;
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      throw error;
    }
  };

  const fetchSecuritySettings = async () => {
    if (!adminId) return null;
    try {
      const security = await adminService.getSecuritySettings(adminId);
      setSettings(prev => ({ ...prev, security }));
      return security;
    } catch (error) {
      console.error('Error fetching security settings:', error);
      throw error;
    }
  };

  const fetchAppearanceSettings = async () => {
    if (!adminId) return null;
    try {
      const appearance = await adminService.getAppearanceSettings(adminId);
      setSettings(prev => ({ ...prev, appearance }));
      return appearance;
    } catch (error) {
      console.error('Error fetching appearance settings:', error);
      throw error;
    }
  };

  const updateHospitalSettings = async (data: HospitalSettings) => {
    if (!adminId) throw new Error('Admin ID not available');

    try {
      await adminService.updateHospitalSettings(adminId, data);
      setSettings(prev => ({ ...prev, hospital: data }));
      return { success: true };
    } catch (error) {
      console.error('Error updating hospital settings:', error);
      throw error;
    }
  };

  const updateSystemSettings = async (data: SystemSettings) => {
    if (!adminId) throw new Error('Admin ID not available');

    try {
      await adminService.updateSystemSettings(adminId, data);
      setSettings(prev => ({ ...prev, system: data }));
      return { success: true };
    } catch (error) {
      console.error('Error updating system settings:', error);
      throw error;
    }
  };

  const updateNotificationSettings = async (data: NotificationSettings) => {
    if (!adminId) throw new Error('Admin ID not available');

    try {
      await adminService.updateNotificationSettings(adminId, data);
      setSettings(prev => ({ ...prev, notifications: data }));
      return { success: true };
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  };

  const updateSecuritySettings = async (data: SecuritySettings) => {
    if (!adminId) throw new Error('Admin ID not available');

    try {
      await adminService.updateSecuritySettings(adminId, data);
      setSettings(prev => ({ ...prev, security: data }));
      return { success: true };
    } catch (error) {
      console.error('Error updating security settings:', error);
      throw error;
    }
  };

  const updateAppearanceSettings = async (data: AppearanceSettings) => {
    if (!adminId) throw new Error('Admin ID not available');

    try {
      await adminService.updateAppearanceSettings(adminId, data);
      setSettings(prev => ({ ...prev, appearance: data }));
      return { success: true };
    } catch (error) {
      console.error('Error updating appearance settings:', error);
      throw error;
    }
  };

  const uploadLogo = async (file: File) => {
    if (!adminId) throw new Error('Admin ID not available');

    try {
      const result = await adminService.uploadHospitalLogo(adminId, file);
      // Update hospital settings with new logo URL
      if (settings.hospital) {
        const updatedHospital = { ...settings.hospital, logo_url: result.logo_url };
        setSettings(prev => ({ ...prev, hospital: updatedHospital }));
      }
      return result;
    } catch (error) {
      console.error('Error uploading logo:', error);
      throw error;
    }
  };

  const clearError = () => {
    setSettings(prev => ({ ...prev, error: null }));
  };

  useEffect(() => {
    loadSettings();
  }, [adminId]);

  return {
    hospital: settings.hospital,
    system: settings.system,
    notifications: settings.notifications,
    security: settings.security,
    appearance: settings.appearance,
    loading: settings.isLoading,
    error: settings.error,
    loadSettings,
    fetchHospitalSettings,
    fetchSystemSettings,
    fetchNotificationSettings,
    fetchSecuritySettings,
    fetchAppearanceSettings,
    updateHospitalSettings,
    updateSystemSettings,
    updateNotificationSettings,
    updateSecuritySettings,
    updateAppearanceSettings,
    uploadLogo,
    clearError,
  };
};
