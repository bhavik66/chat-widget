import ChatWidget from '@/components/ChatWidget';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AppWithChat() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Full-stack Async Exercise: Chat Widget Demo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Welcome to the Chat Widget Demo! This page demonstrates the
            implementation of a chat feature as part of a full-stack async
            exercise.
          </p>
          <p className="mb-2">
            The chat widget below supports the following actions:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Send a message to the chatbot</li>
            <li>Receive responses from the chatbot</li>
            <li>Delete a message you've sent</li>
            <li>Edit a message you've sent</li>
          </ul>
          <p>
            Feel free to interact with the chat widget and explore its
            functionality. The design aims to be user-friendly and responsive,
            following modern UI practices.
          </p>
        </CardContent>
      </Card>

      <ChatWidget />
    </div>
  );
}
