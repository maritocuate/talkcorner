import { Message } from '@/interfaces'

export default function Messages({ messages }: { messages: Message[] }) {
  return (
    <ul className="space-y-1 text-left p-3">
      {messages.map((message, index) => (
        <li key={index} className="py-2 flex flex-col">
          <span className="text-sm text-muted-foreground">
            {message.from} says:
          </span>
          <span>{message.body}</span>
        </li>
      ))}
    </ul>
  )
}
