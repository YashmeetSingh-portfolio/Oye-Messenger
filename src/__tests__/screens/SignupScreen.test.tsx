import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import SignupScreen from '../../app/(auth)/signup';
import { supabase } from '../../lib/supabase';

// Mock expo-router
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  ...jest.requireActual('expo-router'),
  useRouter: () => ({
    back: mockBack,
  }),
  Link: ({ children, ...props }: any) => children,
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('SignupScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const { getByText, getByPlaceholderText } = render(<SignupScreen />);
    
    expect(getByText('Sign up to Chatbox')).toBeTruthy();
    expect(getByText('Create an account to continue')).toBeTruthy();
    expect(getByPlaceholderText('Full name')).toBeTruthy();
    expect(getByPlaceholderText('Your email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByPlaceholderText('Confirm password')).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
    expect(getByText('Already have an account? Log in')).toBeTruthy();
  });

  it('should validate email input', async () => {
    const { getByPlaceholderText, getByText } = render(<SignupScreen />);
    
    const emailInput = getByPlaceholderText('Your email');
    
    // Test invalid email
    fireEvent.changeText(emailInput, 'invalid-email');
    
    await waitFor(() => {
      expect(getByText('Please enter a valid email address.')).toBeTruthy();
    });
    
    // Test valid email
    fireEvent.changeText(emailInput, 'test@example.com');
    
    await waitFor(() => {
      expect(() => getByText('Please enter a valid email address.')).toThrow();
    });
  });

  it('should validate password confirmation', async () => {
    const { getByPlaceholderText, getByText } = render(<SignupScreen />);
    
    const passwordInput = getByPlaceholderText('Password');
    const confirmPasswordInput = getByPlaceholderText('Confirm password');
    
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'different123');
    
    await waitFor(() => {
      expect(getByText('Passwords do not match.')).toBeTruthy();
    });
    
    // Test matching passwords
    fireEvent.changeText(confirmPasswordInput, 'password123');
    
    await waitFor(() => {
      expect(() => getByText('Passwords do not match.')).toThrow();
    });
  });

  it('should handle successful signup', async () => {
    const mockSignUp = supabase.auth.signUp as jest.Mock;
    const mockUpsert = jest.fn().mockResolvedValue({ error: null });
    
    mockSignUp.mockResolvedValue({
      data: { user: { id: 'new-user-id' } },
      error: null
    });
    
    (supabase.from as jest.Mock).mockReturnValue({
      upsert: mockUpsert
    });
    
    const { getByPlaceholderText, getByText } = render(<SignupScreen />);
    
    // Fill in all required fields
    fireEvent.changeText(getByPlaceholderText('Full name'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('Your email'), 'john@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm password'), 'password123');
    
    const signUpButton = getByText('Sign Up');
    fireEvent.press(signUpButton);
    
    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'password123',
      });
      
      expect(mockUpsert).toHaveBeenCalledWith({
        id: 'new-user-id',
        full_name: 'John Doe',
        username: null,
        avatar_url: '',
        updated_at: expect.any(Date),
      });
      
      expect(Alert.alert).toHaveBeenCalledWith(
        'Success!',
        'Account created successfully. Please check your inbox for verification.'
      );
    });
  });

  it('should handle signup error', async () => {
    const mockSignUp = supabase.auth.signUp as jest.Mock;
    mockSignUp.mockResolvedValue({
      data: { user: null },
      error: { message: 'Email already registered' }
    });
    
    const { getByPlaceholderText, getByText } = render(<SignupScreen />);
    
    // Fill in all required fields
    fireEvent.changeText(getByPlaceholderText('Full name'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('Your email'), 'existing@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm password'), 'password123');
    
    const signUpButton = getByText('Sign Up');
    fireEvent.press(signUpButton);
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Email already registered');
    });
  });

  it('should prevent submission with invalid form', async () => {
    const mockSignUp = supabase.auth.signUp as jest.Mock;
    
    const { getByPlaceholderText, getByText } = render(<SignupScreen />);
    
    // Fill in incomplete form
    fireEvent.changeText(getByPlaceholderText('Full name'), 'John');
    fireEvent.changeText(getByPlaceholderText('Your email'), 'invalid-email');
    
    const signUpButton = getByText('Sign Up');
    fireEvent.press(signUpButton);
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Validation Error',
        'Please ensure all fields are filled correctly and passwords match.'
      );
      expect(mockSignUp).not.toHaveBeenCalled();
    });
  });

  it('should navigate back when back button is pressed', () => {
    const { getByLabelText } = render(<SignupScreen />);
    
    const backButton = getByLabelText('Go back');
    fireEvent.press(backButton);
    
    expect(mockBack).toHaveBeenCalled();
  });
});