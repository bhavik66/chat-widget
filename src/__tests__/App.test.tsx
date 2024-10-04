import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // for better assertion methods
import AppWithChat from '@/App';
// Assuming this is the path for ChatWidget

// Mock the ChatWidget component
jest.mock('@/components/ChatWidget', () => () => (
  <div data-testid="chat-widget">ChatWidget</div>
));

describe('AppWithChat Component', () => {
  it('should render the heading and paragraph', () => {
    render(<AppWithChat />);

    // Check for the heading
    const headingElement = screen.getByRole('heading', {
      name: /welcome to my app/i,
    });
    expect(headingElement).toBeInTheDocument();

    // Check for the paragraph
    const paragraphElement = screen.getByText(
      /this is the main content of the application/i,
    );
    expect(paragraphElement).toBeInTheDocument();
  });

  it('should render the ChatWidget component', () => {
    render(<AppWithChat />);

    // Check that the ChatWidget is rendered
    const chatWidget = screen.getByTestId('chat-widget');
    expect(chatWidget).toBeInTheDocument();
  });
});
