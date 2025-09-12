import React from 'react';
import { render, screen } from '@testing-library/react';
import PullRequests from './PullRequests';

// Mock axios since we don't want to make real API calls in tests
jest.mock('axios');

describe('PullRequests Component', () => {
  const mockProps = {
    onImportSuccess: jest.fn(),
    onClose: jest.fn()
  };

  test('renders pull requests modal with correct title', () => {
    render(<PullRequests {...mockProps} />);
    
    expect(screen.getByText('Extrage Cereri de la Stația ITP')).toBeInTheDocument();
    expect(screen.getByText('Extrage Cereri Noi')).toBeInTheDocument();
    expect(screen.getByText('Conectează-te la stația ITP pentru a extrage cererile noi de notificare ale clienților.')).toBeInTheDocument();
  });

  test('renders extract requests button', () => {
    render(<PullRequests {...mockProps} />);
    
    const extractButton = screen.getByText('Extrage Cereri');
    expect(extractButton).toBeInTheDocument();
    expect(extractButton.closest('button')).not.toBeDisabled();
  });

  test('renders close button', () => {
    render(<PullRequests {...mockProps} />);
    
    const closeButtons = screen.getAllByText('Închide');
    expect(closeButtons.length).toBeGreaterThan(0);
  });
});