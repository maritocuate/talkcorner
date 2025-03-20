import { useLayoutEffect, useRef, useState } from 'react'
import { Message } from '@/interfaces'

export default function Messages({ messages }: { messages: Message[] }) {
  const [localMessages, setLocalMessages] = useState<Message[]>([])
  const [userName, setUserName] = useState<string>('')
  const messagesEndRef = useRef<HTMLUListElement>(null)

  useLayoutEffect(() => {
    checkUser()
    setLocalMessages(messages.slice(-40))
    setTimeout(scrollToBottom, 0)
  }, [messages])

  const checkUser = () => {
    const localUserName = localStorage.getItem('local-username')
    if (localUserName) setUserName(localUserName)
  }

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight
    }
  }

  return (
    <ul
      ref={messagesEndRef}
      className="space-y-1 text-left p-3 overflow-y-scroll"
    >
      {localMessages.map((message, index) => (
        <li
          key={index}
          className={`py-2 flex flex-col ${
            message.from === userName ? 'items-end' : ''
          }`}
        >
          <span className="text-sm text-muted-foreground">
            {message.from === userName ? 'You say:' : message.from + ' says:'}
          </span>
          <span>{message.body}</span>
        </li>
      ))}
    </ul>
  )
}
