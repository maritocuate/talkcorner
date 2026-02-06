import { useLayoutEffect, useRef, useState } from 'react'
import { Message } from '@/interfaces'

export default function Messages({ messages }: { messages: Message[] }) {
  const [localMessages, setLocalMessages] = useState<Message[]>([])
  const [userId, setUserId] = useState<string>('')
  const messagesEndRef = useRef<HTMLUListElement>(null)

  useLayoutEffect(() => {
    checkUser()
    setLocalMessages(messages.slice(-40))
    setTimeout(scrollToBottom, 0)
  }, [messages])

  const checkUser = () => {
    const localUserId = localStorage.getItem('local-userId')
    if (localUserId) setUserId(localUserId)
  }

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight
    }
  }

  return (
    <ul
      ref={messagesEndRef}
      className="space-y-1 text-left p-3 overflow-y-scroll [scrollbar-width:none]"
    >
      {localMessages.map((message, index) => {
        // Use userId for comparison if available, fallback to username for old messages
        const isOwnMessage = message.userId ? message.userId === userId : false

        return (
          <li
            key={index}
            className={`py-2 flex flex-col ${isOwnMessage ? 'items-end' : ''
              }`}
          >
            <span className="text-sm text-muted-foreground">
              {isOwnMessage ? 'You say:' : message.from + ' says:'}
            </span>
            <span>{message.body}</span>
          </li>
        )
      })}
    </ul>
  )
}
