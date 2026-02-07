import { useLayoutEffect, useRef, useState } from 'react'
import { Message } from '@/interfaces'
import { useAuth } from '@/context/auth-provider'

export default function Messages({ messages }: { messages: Message[] }) {
  const { user } = useAuth()
  const [localMessages, setLocalMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLUListElement>(null)

  useLayoutEffect(() => {
    setLocalMessages(messages.slice(-40))
    setTimeout(scrollToBottom, 0)
  }, [messages])

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight
    }
  }

  return (
    <ul
      ref={messagesEndRef}
      className="space-y-1 text-left px-4 pt-16 pb-3 md:p-3 overflow-y-scroll [scrollbar-width:none]"
    >
      {localMessages.map((message, index) => {
        const isOwnMessage = user && message.userId === user.userId

        return (
          <li
            key={index}
            className={`py-2 flex flex-col ${isOwnMessage ? 'items-end' : ''
              }`}
          >
            <span className="text-sm text-muted-foreground opacity-70">
              {isOwnMessage ? `${message.from} (you)` : message.from}
            </span>
            <span>{message.body}</span>
          </li>
        )
      })}
    </ul>
  )
}
