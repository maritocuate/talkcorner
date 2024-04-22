import { Message } from '@/interfaces'

export default function Messages({ messages }: { messages: Message[] }) {
  return (
    <ul className="space-y-1 text-left p-3">
      {messages.map((message, index) => (
        <li key={index} className="py-2">
          <b className="text-primary">{message.from}</b>: {message.body}
        </li>
      ))}
    </ul>
  )
}
