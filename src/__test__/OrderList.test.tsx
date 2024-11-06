import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import OrderList from '../Components/OrderList';

const mockProducts = [
  { id: '1', product: 'Product A', price: 500 },
  { id: '2', product: 'Product B', price: 600 },
];

jest.mock('../Firebase/firebase', () => ({
  db: jest.fn(),
}));

describe('OrderList Component', () => {
  it('renders the product list with correct information', async() => {
     render(
      <Router>
        <OrderList myproducts={mockProducts} />
      </Router>
    );

    expect(screen.getByText('Productos seleccionados')).toBeInTheDocument();
    expect(screen.getByText('salesapp')).toBeInTheDocument();
    expect(screen.getByText('Product A')).toBeInTheDocument();
    expect(screen.getByText('Product B')).toBeInTheDocument();
    expect(screen.getByText('$500')).toBeInTheDocument();
    expect(screen.getByText('$600')).toBeInTheDocument();
  });

  it('calculates and displays the total price correctly', async() => {
    render(
      <Router>
        <OrderList myproducts={mockProducts} />
      </Router>
    );

    const totalPrice = await mockProducts.reduce((total, item) => total + item.price, 0);
    expect(screen.getByText(`Total: $${totalPrice}`)).toBeInTheDocument();
  });

  it('displays the confirmation message after purchase', async () => {
    render(
      <Router>
        <OrderList myproducts={mockProducts} />
      </Router>
    );

    const buyButton = await screen.getByRole('button', { name: /comprar/i });
    fireEvent.click(buyButton);

    expect(await screen.findByText('Compra realizada')).toBeInTheDocument();
    expect(screen.getByText('Correo:')).toBeInTheDocument();
    expect(screen.getByText('TOTAL: $1100')).toBeInTheDocument();
    expect(screen.getByText('Dirigite a compras')).toBeInTheDocument();
  });
});
