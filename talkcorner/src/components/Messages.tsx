import { Message } from '@/interfaces'

export default function Messages({ messages }: { messages: Message[] }) {
  return (
    <ul className="space-y-1">
      {messages.map((message, index) => (
        <li key={index}>
          <b>{message.from}</b>: {message.body}
        </li>
      ))}
    </ul>
  )
}
