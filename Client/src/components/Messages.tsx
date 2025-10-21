import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Message {
  id: number
  sender: string
  avatar: string
  preview: string
  timestamp: string
  unread: boolean
  listingTitle: string
}

// Mock messages data
const mockMessages: Message[] = [
  {
    id: 1,
    sender: 'John Doe',
    avatar: 'JD',
    preview: 'Hi, is this item still available?',
    timestamp: '2 hours ago',
    unread: true,
    listingTitle: 'Laptop Dell XPS 15',
  },
  {
    id: 2,
    sender: 'Jane Smith',
    avatar: 'JS',
    preview: 'Can we negotiate the price?',
    timestamp: '5 hours ago',
    unread: true,
    listingTitle: 'iPhone 13 Pro',
  },
  {
    id: 3,
    sender: 'Mike Johnson',
    avatar: 'MJ',
    preview: 'Thank you for the quick response!',
    timestamp: '1 day ago',
    unread: false,
    listingTitle: 'Bicycle Mountain Bike',
  },
  {
    id: 4,
    sender: 'Sarah Williams',
    avatar: 'SW',
    preview: 'Where can we meet?',
    timestamp: '2 days ago',
    unread: false,
    listingTitle: 'Sofa 3-seater',
  },
]

export default function Messages() {
  const { t } = useTranslation()
  const [messages] = useState<Message[]>(mockMessages)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20 pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          {t('messages.title', 'Messages')}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {t('messages.conversations', 'Conversations')}
                </h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {messages.map((message) => (
                  <button
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      selectedMessage?.id === message.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {message.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-gray-900 dark:text-white truncate">
                            {message.sender}
                          </p>
                          {message.unread && (
                            <div className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate mb-1">
                          {message.listingTitle}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                          {message.preview}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl h-[600px] flex flex-col">
              {selectedMessage ? (
                <>
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {selectedMessage.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedMessage.sender}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedMessage.listingTitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                      {/* Received message */}
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                          {selectedMessage.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-md">
                            <p className="text-gray-900 dark:text-white">{selectedMessage.preview}</p>
                          </div>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {selectedMessage.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={t('messages.typeMessage', 'Type a message...')}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                      <button className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-lg transition-all duration-200">
                        {t('messages.send', 'Send')}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <svg
                      className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400">
                      {t('messages.selectConversation', 'Select a conversation to view messages')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
