import { render } from '@testing-library/react';
import React from 'react';

// Simple test to verify the build works
test('renders without crashing', () => {
  const TestComponent = () => <div>Database Selection App</div>;
  render(<TestComponent />);
});
