import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Calculator from '../pages/index';
import { client } from '../src/lib/client';

// 模拟客户端
jest.mock('../src/lib/client', () => ({
  client: {
    calculate: jest.fn(),
  },
  calculate: jest.fn(),
}));

describe('Calculator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders calculator UI', () => {
    render(<Calculator />);
    expect(screen.getByText('ConnectRPC Calculator')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '=' })).toBeInTheDocument();
  });

  it('performs addition correctly', async () => {
    client.calculate.mockResolvedValueOnce({ result: 8 });
    
    render(<Calculator />);
    
    fireEvent.change(screen.getAllByRole('spinbutton')[0], { target: { value: '5' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '+' } });
    fireEvent.change(screen.getAllByRole('spinbutton')[1], { target: { value: '3' } });
    fireEvent.click(screen.getByRole('button', { name: '=' }));
    
    await waitFor(() => {
      expect(client.calculate).toHaveBeenCalledWith(5, 3, '+');
      expect(screen.getByText('Result: 8')).toBeInTheDocument();
    });
  });

  it('handles division by zero error', async () => {
    client.calculate.mockRejectedValueOnce(
      new Error('division by zero')
    );
    
    render(<Calculator />);
    
    fireEvent.change(screen.getAllByRole('spinbutton')[0], { target: { value: '5' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '/' } });
    fireEvent.change(screen.getAllByRole('spinbutton')[1], { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: '=' }));
    
    await waitFor(() => {
      expect(screen.getByText(/Error: division by zero/)).toBeInTheDocument();
    });
  });

  it('handles invalid operator error', async () => {
    client.calculate.mockRejectedValueOnce(
      new Error('invalid operator: $')
    );
    
    render(<Calculator />);
    
    fireEvent.change(screen.getAllByRole('spinbutton')[0], { target: { value: '5' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '$' } });
    fireEvent.change(screen.getAllByRole('spinbutton')[1], { target: { value: '3' } });
    fireEvent.click(screen.getByRole('button', { name: '=' }));
    
    await waitFor(() => {
      expect(screen.getByText(/Error: invalid operator/)).toBeInTheDocument();
    });
  });
});