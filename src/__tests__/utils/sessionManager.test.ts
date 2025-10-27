import * as SecureStore from 'expo-secure-store';
import { supabase } from '../../lib/supabase';
import { clearSession, restoreSession, saveSession } from '../../utils/sessionManager';

// Mock SecureStore
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe('Session Manager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveSession', () => {
    it('should save session when user is authenticated', async () => {
      const mockSession = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        user: { id: 'user-id' }
      };

      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: mockSession }
      });

      await saveSession();

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        'SUPABASE_SESSION',
        JSON.stringify(mockSession)
      );
    });

    it('should not save when no session exists', async () => {
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null }
      });

      await saveSession();

      expect(SecureStore.setItemAsync).not.toHaveBeenCalled();
    });
  });

  describe('restoreSession', () => {
    it('should restore session from secure store', async () => {
      const mockSession = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        user: { id: 'user-id' }
      };

      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(
        JSON.stringify(mockSession)
      );

      const result = await restoreSession();

      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('SUPABASE_SESSION');
      expect(supabase.auth.setSession).toHaveBeenCalledWith({
        access_token: mockSession.access_token,
        refresh_token: mockSession.refresh_token,
      });
      expect(result).toEqual(mockSession);
    });

    it('should return null when no saved session exists', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

      const result = await restoreSession();

      expect(result).toBeNull();
      expect(supabase.auth.setSession).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(
        new Error('SecureStore error')
      );

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const result = await restoreSession();

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'No saved session found or failed to restore:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('clearSession', () => {
    it('should clear session from secure store', async () => {
      await clearSession();

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('SUPABASE_SESSION');
    });
  });
});