import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import { supabase } from '../../lib/supabase';
import AuthProvider, { useAuth } from '../../providers/AuthProvider';

// Mock component to test the context
const TestComponent = () => {
  const { session, user, profile } = useAuth();
  return (
    <>
      <Text testID="session-status">{session ? 'authenticated' : 'not-authenticated'}</Text>
      <Text testID="user-id">{user?.id || 'no-user'}</Text>
      <Text testID="profile-status">{profile ? 'has-profile' : 'no-profile'}</Text>
    </>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children and provide initial auth state', async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('session-status')).toHaveTextContent('not-authenticated');
      expect(getByTestId('user-id')).toHaveTextContent('no-user');
      expect(getByTestId('profile-status')).toHaveTextContent('no-profile');
    });
  });

  it('should update state when session changes', async () => {
    const mockSession = {
      user: { id: 'test-user-id', email: 'test@example.com' },
      access_token: 'mock-token',
    };

    // Mock getSession to return a session
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: mockSession }
    });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('session-status')).toHaveTextContent('authenticated');
      expect(getByTestId('user-id')).toHaveTextContent('test-user-id');
    });
  });

  it('should handle auth state changes', async () => {
    let authStateChangeCallback: any;
    
    // Mock onAuthStateChange to capture the callback
    (supabase.auth.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
      authStateChangeCallback = callback;
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Simulate auth state change
    const newSession = {
      user: { id: 'new-user-id', email: 'new@example.com' },
      access_token: 'new-token',
    };

    authStateChangeCallback('SIGNED_IN', newSession);

    await waitFor(() => {
      expect(getByTestId('session-status')).toHaveTextContent('authenticated');
      expect(getByTestId('user-id')).toHaveTextContent('new-user-id');
    });
  });
});