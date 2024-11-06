import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Register from '../Pages/Register';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../Firebase/firebase';

// Mock de Firebase
jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
}));

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the registration form fields correctly', () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    expect(screen.getByText('Crear Cuenta')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre Completo')).toBeInTheDocument();
    expect(screen.getByLabelText('No. de identificación')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo Electrónico:')).toBeInTheDocument();
    expect(screen.getByLabelText('Nueva contraseña')).toBeInTheDocument();
    expect(screen.getByLabelText('Repetir contraseña')).toBeInTheDocument();
  });

  it('validates form fields and shows error messages', async () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    const submitButton = screen.getByRole('button', { name: /registrarse/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('El correo es obligatorio')).toBeInTheDocument();
    });
  });

  it('shows password mismatch error', async () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    fireEvent.input(screen.getByPlaceholderText('Contraseña'), { target: { value: 'password123' } });
    fireEvent.input(screen.getByPlaceholderText('Confirmar contraseña'), { target: { value: 'differentPassword' } });

    const submitButton = screen.getByRole('button', { name: /registrarse/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
    });
  });

  it('creates a user and stores data in Firestore on successful registration', async () => {
    // Simulación de respuesta exitosa al crear el usuario
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: { uid: '12345' },
    });

    render(
      <Router>
        <Register />
      </Router>
    );

    // Completar los campos de formulario
    fireEvent.input(screen.getByPlaceholderText('Escribe tu nombre'), { target: { value: 'Test User' } });
    fireEvent.input(screen.getByPlaceholderText('Numero de identificación'), { target: { value: '123456789' } });
    fireEvent.input(screen.getByPlaceholderText('email@example.com'), { target: { value: 'test@example.com' } });
    fireEvent.input(screen.getByPlaceholderText('Contraseña'), { target: { value: 'password123' } });
    fireEvent.input(screen.getByPlaceholderText('Confirmar contraseña'), { target: { value: 'password123' } });

    const submitButton = screen.getByRole('button', { name: /registrarse/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');
      expect(addDoc).toHaveBeenCalledWith(collection(db, 'Clients'), {
        uid: '12345',
        name_client: 'Test User',
        email: 'test@example.com',
        nit_client: '123456789',
      });
    });

    // Verificar mensaje de confirmación
    expect(screen.getByText(/Se ha registrado a Test User con el Id 123456789/i)).toBeInTheDocument();
  });

  it('displays error message if registration fails', async () => {
    // Simulación de error al crear el usuario
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue({
      code: 'auth/error-code',
      message: 'Error message',
    });

    render(
      <Router>
        <Register />
      </Router>
    );

    fireEvent.input(screen.getByPlaceholderText('Escribe tu nombre'), { target: { value: 'Test User' } });
    fireEvent.input(screen.getByPlaceholderText('Numero de identificación'), { target: { value: '123456789' } });
    fireEvent.input(screen.getByPlaceholderText('email@example.com'), { target: { value: 'test@example.com' } });
    fireEvent.input(screen.getByPlaceholderText('Contraseña'), { target: { value: 'password123' } });
    fireEvent.input(screen.getByPlaceholderText('Confirmar contraseña'), { target: { value: 'password123' } });

    const submitButton = screen.getByRole('button', { name: /registrarse/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');
      expect(screen.getByText(/Ocurrió un error al crear el usuario. Intenta nuevamente./i)).toBeInTheDocument();
    });
  });
});