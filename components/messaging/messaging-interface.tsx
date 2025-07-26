"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Search, MoreVertical, Paperclip, Shield, Star, MessageCircle, Users, Clock } from "lucide-react"
import { useWallet } from "@/components/wallet/wallet-provider"
import { useUser } from "@/components/providers/user-provider"
import { supabase, type Message, type User } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface ConversationWithUser {
  id: string
  participant: User
  lastMessage?: Message
  unreadCount: number
  job_id?: string
  created_at: string
}

export default function MessagingInterface() {
  const { isConnected } = useWallet()
  const { user } = useUser()
  const { toast } = useToast()
  const [conversations, setConversations] = useState<ConversationWithUser[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user) {
      loadConversations()
    }
  }, [user])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation)
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadConversations = async () => {
    if (!user) return

    try {
      // Get conversations where user is a participant
      const { data: conversationsData, error: conversationsError } = await supabase
        .from("conversations")
        .select(`
          id,
          participant_1,
          participant_2,
          job_id,
          created_at
        `)
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
        .order("created_at", { ascending: false })

      if (conversationsError) {
        console.error("Error loading conversations:", conversationsError)
        setIsLoading(false)
        return
      }

      if (!conversationsData || conversationsData.length === 0) {
        setConversations([])
        setIsLoading(false)
        return
      }

      // Get participant details and last messages
      const conversationsWithDetails = await Promise.all(
        conversationsData.map(async (conv) => {
          // Get the other participant
          const otherParticipantId = conv.participant_1 === user.id ? conv.participant_2 : conv.participant_1

          const { data: participantData } = await supabase
            .from("users")
            .select("*")
            .eq("id", otherParticipantId)
            .single()

          // Get last message
          const { data: lastMessageData } = await supabase
            .from("messages")
            .select("*")
            .eq("conversation_id", conv.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single()

          return {
            id: conv.id,
            participant: participantData,
            lastMessage: lastMessageData,
            unreadCount: 0, // TODO: Implement unread count
            job_id: conv.job_id,
            created_at: conv.created_at,
          }
        }),
      )

      setConversations(conversationsWithDetails.filter((conv) => conv.participant))

      // Auto-select first conversation
      if (conversationsWithDetails.length > 0 && !selectedConversation) {
        setSelectedConversation(conversationsWithDetails[0].id)
      }
    } catch (error) {
      console.error("Error in loadConversations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })

      if (error) {
        console.error("Error loading messages:", error)
        return
      }

      setMessages(data || [])
    } catch (error) {
      console.error("Error in loadMessages:", error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return

    try {
      const messageData = {
        conversation_id: selectedConversation,
        sender_id: user.id,
        content: newMessage.trim(),
        message_type: "text" as const,
      }

      const { data, error } = await supabase.from("messages").insert([messageData]).select().single()

      if (error) {
        console.error("Error sending message:", error)
        toast({
          title: "Failed to send message",
          description: "Please try again.",
          variant: "destructive",
        })
        return
      }

      // Add message to local state
      setMessages((prev) => [...prev, data])
      setNewMessage("")

      // Update conversation's last message
      loadConversations()
    } catch (error) {
      console.error("Error in sendMessage:", error)
    }
  }

  const createConversation = async (participantId: string, jobId?: string) => {
    if (!user) return

    try {
      const conversationData = {
        participant_1: user.id,
        participant_2: participantId,
        job_id: jobId,
      }

      const { data, error } = await supabase.from("conversations").insert([conversationData]).select().single()

      if (error) {
        console.error("Error creating conversation:", error)
        return
      }

      loadConversations()
      setSelectedConversation(data.id)
    } catch (error) {
      console.error("Error in createConversation:", error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.participant?.username?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const currentConversation = conversations.find((c) => c.id === selectedConversation)

  const renderMessage = (message: Message) => {
    const isOwnMessage = message.sender_id === user?.id

    if (message.message_type === "escrow") {
      return (
        <div key={message.id} className="flex justify-center my-4">
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 max-w-md">
            <div className="flex items-center space-x-2 text-cyan-400 mb-2">
              <Shield size={16} />
              <span className="font-semibold">Escrow Update</span>
            </div>
            <p className="text-cyan-100 text-sm">{message.content}</p>
          </div>
        </div>
      )
    }

    if (message.message_type === "nft") {
      return (
        <div key={message.id} className="flex justify-center my-4">
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 max-w-md">
            <div className="flex items-center space-x-2 text-purple-400 mb-2">
              <Star size={16} />
              <span className="font-semibold">NFT Access Granted</span>
            </div>
            <p className="text-cyan-100 text-sm">{message.content}</p>
          </div>
        </div>
      )
    }

    return (
      <div key={message.id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}>
        <div className={`flex ${isOwnMessage ? "flex-row-reverse" : "flex-row"} items-end space-x-2 max-w-[70%]`}>
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>
              {isOwnMessage ? user?.username?.[0] : currentConversation?.participant?.username?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className={`${isOwnMessage ? "mr-2" : "ml-2"}`}>
            <div
              className={`rounded-lg px-4 py-2 ${
                isOwnMessage ? "bg-cyan-600 text-white" : "bg-gray-800 text-cyan-100"
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
            <p className="text-xs text-cyan-100/50 mt-1 px-2">{new Date(message.created_at).toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isConnected || !user) {
    return (
      <div className="text-center py-20">
        <MessageCircle className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
        <p className="text-cyan-100/80">Please connect your wallet to access messaging</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
        <div className="text-cyan-400 text-xl">Loading messages...</div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex">
      {/* Conversations Sidebar */}
      <div className="w-1/3 border-r border-cyan-500/20 bg-gray-900/30">
        <div className="p-4 border-b border-cyan-500/20">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <MessageCircle className="mr-2" size={20} />
            Messages
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-cyan-400" size={16} />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/50 border-cyan-500/30 text-cyan-100 placeholder-cyan-100/50"
            />
          </div>
        </div>

        <div className="overflow-y-auto h-full">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-cyan-400/50 mx-auto mb-4" />
              <p className="text-cyan-100/70">No conversations yet</p>
              <p className="text-cyan-100/50 text-sm">Start by applying to jobs or posting projects</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`p-4 border-b border-cyan-500/10 cursor-pointer transition-colors hover:bg-cyan-500/5 ${
                  selectedConversation === conversation.id ? "bg-cyan-500/10 border-r-2 border-r-cyan-400" : ""
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{conversation.participant?.username?.[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-cyan-100 font-semibold truncate">{conversation.participant?.username}</h3>
                      <div className="flex items-center space-x-2">
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-cyan-600 text-white text-xs px-2 py-1">{conversation.unreadCount}</Badge>
                        )}
                        <span className="text-xs text-cyan-100/50">
                          {conversation.lastMessage
                            ? new Date(conversation.lastMessage.created_at).toLocaleDateString()
                            : new Date(conversation.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400 mb-2">
                      {conversation.participant?.role}
                    </Badge>

                    <p className="text-sm text-cyan-100/70 truncate">
                      {conversation.lastMessage?.content || "No messages yet"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation && currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-cyan-500/20 bg-gray-900/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{currentConversation.participant?.username?.[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-white font-semibold">{currentConversation.participant?.username}</h3>
                    <p className="text-sm text-cyan-400 capitalize">{currentConversation.participant?.role}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="border-green-500/30 text-green-400">
                    <Clock size={12} className="mr-1" />
                    Active
                  </Badge>
                  <Button variant="ghost" size="icon" className="text-cyan-400">
                    <MoreVertical size={16} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-cyan-400/50 mx-auto mb-4" />
                  <p className="text-cyan-100/70">No messages yet</p>
                  <p className="text-cyan-100/50 text-sm">Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => renderMessage(message))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-cyan-500/20 bg-gray-900/30">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="text-cyan-400">
                  <Paperclip size={16} />
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1 bg-black/50 border-cyan-500/30 text-cyan-100 placeholder-cyan-100/50"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Users className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Select a Conversation</h3>
              <p className="text-cyan-100/70">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
