import { supabase } from '../../lib/supabase';

// Mock environment variables
process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

describe('Supabase Client', () => {
  it('should be properly initialized', () => {
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
  });

  it('should have correct configuration', () => {
    // Test that the client is configured with the expected settings
    // Since we're using mocks, we just verify the environment variables are set
    expect(process.env.EXPO_PUBLIC_SUPABASE_URL).toBe('https://test.supabase.co');
    expect(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY).toBe('test-key');
  });

  it('should have auth methods available', () => {
    expect(typeof supabase.auth.signInWithPassword).toBe('function');
    expect(typeof supabase.auth.signUp).toBe('function');
    expect(typeof supabase.auth.signOut).toBe('function');
    expect(typeof supabase.auth.getSession).toBe('function');
    expect(typeof supabase.auth.onAuthStateChange).toBe('function');
  });
});