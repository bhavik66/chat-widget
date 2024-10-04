# Chat Widget

A customizable real-time chat widget built with React and TypeScript, providing a responsive UI and smooth user experience. The widget supports infinite scrolling, WebSocket integration, and API communication for seamless chat functionality. It uses Vite as the development tool and TailwindCSS for styling. The project also leverages components from `shadcn/ui` to ensure a clean and flexible design system.

## Features

- **Real-time messaging**: Connects to a WebSocket server using `socket.io-client` for instant message updates.
- **Infinite scrolling**: Seamlessly loads chat history as the user scrolls up, powered by `react-infinite-scroll-component`.
- **API integration**: Uses `axios` for backend communication to fetch and send messages.
- **Light and Dark mode**: Fully supports both light and dark themes with TailwindCSS.
- **Customizable UI components**: Modular and reusable components for chat functionality.
- **TypeScript**: Full TypeScript support for type safety and developer productivity.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/chat-widget.git
   cd chat-widget
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:3000` to view and interact with the chat widget.

## Project Structure

The project follows a modular structure for better maintainability and scalability:

- **`src/components/`**:
  - `ChatBubble.tsx`: Renders individual chat message bubbles with timestamps and user information.
  - `ChatWindow.tsx`: Main chat window component displaying the conversation and handling scroll behavior.
  - `ChatWidget.tsx`: Wrapper component for initializing and managing the chat interface.
  - `Message.tsx`: Handles rendering of individual messages and their associated styles.
  
- **`src/hooks/`**:
  - `useConversation.ts`: Manages chat state, handling conversation data and logic.
  - `useMessages.ts`: Fetches and manages chat messages, ensuring efficient updates and retrieval of message history.

- **`src/services/`**:
  - `apiService.ts`: Contains API methods for interacting with the backend using `axios` (e.g., fetching chat history, sending messages).
  - `wsService.ts`: Manages WebSocket connections using `socket.io-client`, listening for and sending real-time message updates.

- **`src/styles/`**:
  - `index.css`: Global CSS file, incorporating TailwindCSS utilities and custom styling for scrollbar and theme management【13†source】.

## Styling

This project uses TailwindCSS for utility-first styling. The theme supports both light and dark modes. Customize the base colors, typography, and spacing through the `tailwind.config.js` file. Additionally, the project uses CSS variables for smooth theme switching and consistent design. Components from `shadcn/ui` are also used to maintain a cohesive and flexible UI design.

**Global CSS**:
- Light and dark theme variables are defined in the `index.css` file for easy customization.
- Custom scrollbars are also styled in `index.css` for a more refined user experience.

## Available Scripts

In the project directory, you can run the following commands:

- **`npm run dev`**: Runs the app in development mode with hot-reloading enabled.
- **`npm run build`**: Builds the app for production into the `dist` folder, optimizing for performance.
- **`npm run preview`**: Previews the production build locally.
- **`npm run lint`**: Runs ESLint to analyze and fix code for potential issues or style inconsistencies.

## Dependencies

- **React**: Core framework for building the UI.
- **Socket.io-client**: Real-time, bidirectional communication between the client and server.
- **Axios**: Promise-based HTTP client for making API requests.
- **TailwindCSS**: Utility-first CSS framework for rapid UI development.
- **React Infinite Scroll**: Implements infinite scrolling for message history.
- **UUID**: Generates unique IDs for messages and users.
- **ESLint and Prettier**: For maintaining code quality and consistency.
- **shadcn/ui**: Provides reusable and flexible UI components for building the chat interface.

## Configuration

- **TailwindCSS**: Tailwind is set up with light and dark theme support. You can adjust the theme in `tailwind.config.js` and customize colors and UI behavior.
- **WebSocket and API Configuration**: WebSocket connection is established through `wsService.ts` and API requests are managed by `apiService.ts`. Modify endpoints as needed based on your server setup.

## How It Works

1. **Message Flow**: 
   - The chat widget sends and receives messages through a WebSocket connection.
   - Messages are fetched from the server and displayed in the `ChatWindow` component.
   - New messages are rendered via `ChatBubble` and appended to the `ChatWindow` as they are sent or received.

2. **Infinite Scrolling**: 
   - When the user scrolls up, the `useMessages` hook triggers an API call to load older messages.
   - The scroll position is maintained, providing a smooth experience as older messages load seamlessly.

3. **Real-Time Updates**:
   - The WebSocket connection listens for incoming messages and pushes them to the conversation in real-time.
   - Any new message from the user is sent through the WebSocket and displayed immediately without needing to refresh the page.