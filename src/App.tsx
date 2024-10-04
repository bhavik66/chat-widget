import ChatWidget from '@/components/ChatWidget';

export default function AppWithChat() {
  return (
    <div>
      {/* Your main application content goes here */}
      <h1>Welcome to My App</h1>
      <p>This is the main content of the application.</p>

      {/* Chat widget */}
      <ChatWidget />
    </div>
  );
}
