import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginWithEmail from '../Pages/LoginWithEmail';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase/firebase';

// Mock de Firebase
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

// Mock para el método de navegación
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('LoginWithEmail Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form', () => {
    render(
      <Router>
        <LoginWithEmail />
      </Router>
    );

    // Verificar que los elementos del formulario están presentes
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo Electrónico')).toBeInT
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('displays an error message when email or password are empty', async () => {
    render(
      <Router>
        <LoginWithEmail />
      </Router>
    );

    const submitButton = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(submitButton);

    // Esperar que se muestre el mensaje de error en consola
    await waitFor(() => {
      expect(screen.getByText('Escribe tu correo y contraseña')).toBeInTheDocument();
    });
  });

  it('calls signInWithEmailAndPassword with correct credentials', async () => {
    // Simular el inicio de sesión exitoso
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: { uid: '12345', email: 'test@example.com' },
    });

    render(
      <Router>
        <LoginWithEmail />
      </Router>
    );

    // Llenar los campos de correo y contraseña
    fireEvent.change(screen.getByPlaceholderText('email@example.com'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('******'), {
      target: { value: 'password123' },
    });

    // Enviar el formulario
    const submitButton = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(submitButton);

    // Verificar que signInWithEmailAndPassword se llamó con los parámetros correctos
    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');
    });

    // Verificar que la navegación a '/home' ocurrió
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  it('displays an error message on authentication failure', async () => {
    // Simular un error en el inicio de sesión
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(new Error('Authentication error'));

    render(
      <Router>
        <LoginWithEmail />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('email@example.com'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('******'), {
      target: { value: 'wrongpassword' },
    });

    const submitButton = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(submitButton);

    // Esperar a que aparezca el mensaje de error en pantalla
    await waitFor(() => {
      expect(screen.getByText('Error de autenticación, verifique que contraseña y correo sean correctos')).toBeInTheDocument();
    });
  });
});