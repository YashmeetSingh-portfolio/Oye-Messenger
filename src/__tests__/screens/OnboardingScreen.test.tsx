import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import OnboardingScreen from '../../app/(auth)/index';

// Mock expo-router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  ...jest.requireActual('expo-router'),
  useRouter: () => ({
    push: mockPush,
  }),
  Stack: {
    Screen: ({ children, ...props }: any) => children,
  },
}));

// Mock LinearGradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children, ...props }: any) => children,
}));

describe('OnboardingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const { getByText } = render(<OnboardingScreen />);
    
    expect(getByText(/Connect/)).toBeTruthy();
    expect(getByText(/friends/)).toBeTruthy();
    expect(getByText(/easily &/)).toBeTruthy();
    expect(getByText(/quickly/)).toBeTruthy();
    expect(getByText('Our chat app is the perfect way to stay connected with friends and family.')).toBeTruthy();
    expect(getByText('Sign up with mail')).toBeTruthy();
    expect(getByText('Existing account?')).toBeTruthy();
    expect(getByText('Log in')).toBeTruthy();
  });

  it('should navigate to signup when signup button is pressed', () => {
    const { getByText } = render(<OnboardingScreen />);
    
    const signUpButton = getByText('Sign up with mail');
    fireEvent.press(signUpButton);
    
    expect(mockPush).toHaveBeenCalledWith('/signup');
  });

  it('should navigate to login when login link is pressed', () => {
    const { getByText } = render(<OnboardingScreen />);
    
    const loginLink = getByText('Log in');
    fireEvent.press(loginLink);
    
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('should have proper accessibility', () => {
    const { getByText } = render(<OnboardingScreen />);
    
    const signUpButton = getByText('Sign up with mail');
    const loginLink = getByText('Log in');
    
    expect(signUpButton).toBeTruthy();
    expect(loginLink).toBeTruthy();
  });
});