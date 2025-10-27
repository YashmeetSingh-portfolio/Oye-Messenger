import { supabase } from '../../lib/supabase';
import { tokenProvider } from '../../utils/tokenProvider';

describe('Token Provider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return token from supabase function', async () => {
    const mockToken = 'mock-stream-token';
    const mockInvoke = jest.fn().mockResolvedValue({
      data: { token: mockToken }
    });
    
    (supabase.functions.invoke as jest.Mock) = mockInvoke;
    
    const result = await tokenProvider();
    
    expect(mockInvoke).toHaveBeenCalledWith('stream-tokens');
    expect(result).toBe(mockToken);
  });

  it('should handle missing token in response', async () => {
    const mockInvoke = jest.fn().mockResolvedValue({
      data: {}
    });
    
    (supabase.functions.invoke as jest.Mock) = mockInvoke;
    
    const result = await tokenProvider();
    
    expect(result).toBeUndefined();
  });

  it('should handle function invocation error', async () => {
    const mockInvoke = jest.fn().mockRejectedValue(new Error('Function error'));
    
    (supabase.functions.invoke as jest.Mock) = mockInvoke;
    
    await expect(tokenProvider()).rejects.toThrow('Function error');
  });
});