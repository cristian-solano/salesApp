import React from 'react';
import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import Orders from '../Components/Orders';
import { collection, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { BrowserRouter as Router } from 'react-router-dom';
import { db } from '../Firebase/firebase';

// Mock de Firebase Firestore
jest.mock('../Firebase/firebase', () => ({
  db: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  deleteDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

jest.mock('../Components/CloseSession', () => () => <div>Mock CloseSession</div>);
jest.mock('../Components/StateControl', () => (props: any) => (
  <div>
    Mock StateControl
    <button onClick={() => props.update(props.id, props.newStatus)}>Actualizar Estado</button>
  </div>
));

const mockOrders = [
  {
    id: '1',
    email: 'testuser@example.com',
    amount: 500,
    createAt: '01/01/2023',
    currentState: 'pendiente',
    items: [{ product: 'Producto A', price: 200 }, { product: 'Producto B', price: 300 }],
  },
];

describe('Orders Component', () => {
  beforeEach(() => {
    (getDocs as jest.Mock).mockResolvedValue({
      docs: mockOrders.map(order => ({
        id: order.id,
        data: () => ({
          ...order,
          createAt: { toDate: () => new Date(order.createAt) },
        }),
      })),
    });
  });

  it('renders loading message initially', () => {
    render(
      <Router>
        <Orders />
      </Router>
    );
    expect(screen.getByText('Cargando ordenes listas...')).toBeInTheDocument();
  });

  it('renders no orders message when no orders are available', async () => {
    (getDocs as jest.Mock).mockResolvedValue({ docs: [] });

    render(
      <Router>
        <Orders />
      </Router>
    );

    await waitFor(() => expect(screen.getByText('No hay ordenes creadas')).toBeInTheDocument());
  });

  it('renders orders list when orders are available', async () => {
    render(
      <Router>
        <Orders />
      </Router>
    );

    await waitFor(() => expect(screen.getByText('Recibo No. 1')).toBeInTheDocument());
    expect(screen.getByText('Cliente: testuser@example.com')).toBeInTheDocument();
    expect(screen.getByText('Productos')).toBeInTheDocument();
    expect(screen.getByText('Producto A')).toBeInTheDocument();
    expect(screen.getByText('$200')).toBeInTheDocument();
    expect(screen.getByText('$300')).toBeInTheDocument();
    expect(screen.getByText('Total: $500')).toBeInTheDocument();
  });

  it('calls delete function when delete button is clicked', async () => {
    render(
      <Router>
        <Orders />
      </Router>
    );

    await waitFor(() => expect(screen.getByText('Recibo No. 1')).toBeInTheDocument());
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => expect(deleteDoc).toHaveBeenCalled());
  });

  it('calls update function when update button is clicked', async () => {
    render(
      <Router>
        <Orders />
      </Router>
    );

    await waitFor(() => expect(screen.getByText('Recibo No. 1')).toBeInTheDocument());

    const updateButton = screen.getByText('Actualizar Estado');
    fireEvent.click(updateButton);

    await waitFor(() => expect(updateDoc).toHaveBeenCalled());
  });

  it('displays “Compra realizada” message when a purchase is completed', async () => {
    render(
      <Router>
        <Orders />
      </Router>
    );
  
    const buyButton = screen.getByText('Comprar');
    fireEvent.click(buyButton);
  
    await waitFor(() => {
        const successMessage = screen.getByText((content, element) =>
          content.includes('Compra realizada')
        );
        expect(successMessage).toBeInTheDocument();
      });
    });
});
