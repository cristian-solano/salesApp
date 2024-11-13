import React from 'react';
import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import CloseSession from '../Components/CloseSession';
import { useNavigate } from 'react-router';
import { signOut, getAuth } from 'firebase/auth';
import userEvent from '@testing-library/user-event';

    jest.mock('react-router', () => ({
        useNavigate: jest.fn(),
    }));
    
    jest.mock('firebase/auth', () => ({
        getAuth: jest.fn(),
        signOut: jest.fn(() => Promise.resolve()),
    }));

  describe('CloseSession Component', () => {
    const navigate = jest.fn();
  
    beforeEach(() => {
      (useNavigate as jest.Mock).mockReturnValue(navigate);
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('renders the CloseSession component with sign-out button', () => {
      render(<CloseSession />);
  
      // Verificar que el botón esté en el documento
   
        const signOutButton = screen.getByRole('button');
        expect(signOutButton).toBeInTheDocument();
      
    });
  
    it('calls signOut and navigate on button click', async () => {
      render(<CloseSession />);

      
     
        const signOutButton = screen.getByRole('button');
        await  userEvent.click(signOutButton);
  
        
        await waitFor(() => expect(signOut).toHaveBeenCalled());
  
        
        await waitFor(() => expect(navigate).toHaveBeenCalledWith('/'));
    });
  
    it('clears localStorage and sessionStorage on sign-out', async () => {
      render(<CloseSession />);
  
      
      localStorage.setItem('test', 'value');
      sessionStorage.setItem('test', 'value');
  
      const signOutButton = screen.getByRole('button');
      await userEvent.click(signOutButton);
  
      
      await waitFor(() => {
        expect(localStorage.getItem('test')).toBeNull();
        expect(sessionStorage.getItem('test')).toBeNull();
      });
    });
  });