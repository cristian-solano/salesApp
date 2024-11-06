import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginWithGoogle from '../Pages/LoginWithGoogle';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../Firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';

// Mock de Firebase
jest.mock('firebase/auth', () => ({
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn().mockImplementation(() => ({
    credentialFromResult: jest.fn(),
    credentialFromError: jest.fn(),
  })),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
}));

// Mock para el método de navegación
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('LoginWithGoogle Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the Google sign-in button and text', () => {
    render(
      <Router>
        <LoginWithGoogle />
      </Router>
    );

    expect(screen.getByText('Sign Up with Google')).toBeInTheDocument();
    expect(screen.getByText('Bienvenido a Salesapp')).toBeInTheDocument();
    expect(screen.getByText('Ingresa uniendote con tu cuenta de Google')).toBeInTheDocument();
  });

  it('calls signInWithPopup on button click', async () => {
    // Simulación de respuesta exitosa de inicio de sesión con Google
    (signInWithPopup as jest.Mock).mockResolvedValue({
      user: { uid: '12345', displayName: 'Test User', email: 'test@example.com' },
      credential: { accessToken: 'test-token' },
    });

    render(
      <Router>
        <LoginWithGoogle />
      </Router>
    );

    const button = screen.getByRole('button', { name: /sign up with google/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalledWith(auth, expect.any(GoogleAuthProvider));
    });

    // Verificar que se llamó la función de navegación hacia "/home"
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });

  it('displays error messages on sign-in failure', async () => {
    // Simulación de error en el inicio de sesión
    (signInWithPopup as jest.Mock).mockRejectedValue({
      code: 'auth/error-code',
      message: 'Error message',
      customData: { email: 'error@example.com' },
    });

    render(
      <Router>
        <LoginWithGoogle />
      </Router>
    );

    const button = screen.getByRole('button', { name: /sign up with google/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalledWith(auth, expect.any(GoogleAuthProvider));
    });

    // Verificar que el mensaje de error se haya impreso en la consola
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(
        'Error code:',
        'auth/error-code',
        'Error message:',
        'Error message'
      );
      expect(console.log).toHaveBeenCalledWith('Email:', 'error@example.com');
    });
  });

  it('calls setDoc to store user data in Firestore on successful login', async () => {
    // Simulación de inicio de sesión exitoso
    (signInWithPopup as jest.Mock).mockResolvedValue({
      user: { uid: '12345', displayName: 'Test User', email: 'test@example.com' },
      credential: { accessToken: 'test-token' },
    });

    render(
      <Router>
        <LoginWithGoogle />
      </Router>
    );

    const button = screen.getByRole('button', { name: /sign up with google/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(setDoc).toHaveBeenCalledWith(
        expect.any(Object), 
        {
          uid: '12345',
          name_client: 'Test User',
          email: 'test@example.com',
          nit_client: '',
        },
        { merge: true }
      );
    });
  });
});