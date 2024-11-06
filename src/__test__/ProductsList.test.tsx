import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ProductsList from '../Components/ProductsList';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase/firebase';

// Mock de Firebase
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

// Mock de la función 'collection' y 'getDocs'
const mockProducts = [
  {
    id: '1',
    name_product: 'Producto 1',
    amount_product: 100,
    photo: 'product1.jpg',
  },
  {
    id: '2',
    name_product: 'Producto 2',
    amount_product: 200,
    photo: 'product2.jpg',
  },
];

describe('ProductsList Component', () => {
  beforeEach(() => {
    // Simular respuesta de Firebase
    (collection as jest.Mock).mockReturnValue({});
    (getDocs as jest.Mock).mockResolvedValue({
      docs: mockProducts.map((product) => ({
        id: product.id,
        data: () => product,
      })),
    });
  });

  it('renders loading message initially', () => {
    render(
      <Router>
        <ProductsList />
      </Router>
    );

    // Verificar que se muestra el mensaje de carga inicialmente
    expect(screen.getByText('Cargando productos...')).toBeInTheDocument();
  });

  it('renders products after loading', async () => {
    render(
      <Router>
        <ProductsList />
      </Router>
    );

    // Espera hasta que los productos estén cargados
    await waitFor(() => {
      expect(screen.getByText('Producto 1')).toBeInTheDocument();
      expect(screen.getByText('Producto 2')).toBeInTheDocument();
    });

    // Verificar precios
    expect(screen.getByText('Valor: $100')).toBeInTheDocument();
    expect(screen.getByText('Valor: $200')).toBeInTheDocument();
  });

  it('adds a product to myProducts when clicking on the "Agregar al carrito" button', async () => {
    render(
      <Router>
        <ProductsList />
      </Router>
    );

    // Espera hasta que los productos se hayan cargado
    await waitFor(() => screen.getByText('Producto 1'));

    // Click en el botón de agregar al carrito
    const addButton = screen.getAllByRole('button', { name: /car/i })[0];
    fireEvent.click(addButton);

    // Verificar que el producto fue agregado al carrito
    expect(screen.getByText('Agregado al carrito')).toBeInTheDocument();
  });
});
