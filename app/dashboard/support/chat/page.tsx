'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, Paperclip, Smile, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { supportApi, authApi } from '@/lib/api';
import { supabase } from '@/lib/supabase';

export default function ChatPage() {
  const searchParams = useSearchParams();
  const ticketIdFromUrl = searchParams.get('ticket_id');
  
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(ticketIdFromUrl);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get current user for sender identification
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
    } else {
        authApi.getMe().then(user => {
            setCurrentUser(user);
            localStorage.setItem('user', JSON.stringify(user));
        });
    }
    
    fetchTickets();
  }, []);

  useEffect(() => {
    if (selectedTicketId) {
      fetchMessages(selectedTicketId);
      
      // Subscribe to real-time updates for messages
      const channel = supabase
        .channel('public:support_messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'support_messages',
            filter: `ticket_id=eq.${selectedTicketId}`,
          },
          (payload) => {
            // Add new message to list if it's not already there (prevent double insertion if API also returns it)
            setMessages((prev) => {
                if (prev.find(m => m.id === payload.new.id)) return prev;
                return [...prev, payload.new];
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedTicketId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchTickets = async () => {
    try {
      const data = await supportApi.getTickets({ channel: 'chat' });
      setTickets(data);
      if (!selectedTicketId && data.length > 0) {
        setSelectedTicketId(data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch chat tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (ticketId: string) => {
    try {
      console.log('Fetching messages for ticket:', ticketId);
      const data = await supportApi.getMessages(ticketId);
      console.log('Fetched messages:', data);
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicketId) return;

    try {
      const isAdmin = currentUser?.role === 'ADMIN';
      await supportApi.sendMessage({
        ticket: selectedTicketId,
        content: newMessage,
      });
      setNewMessage('');
      // Message will be added via Supabase real-time or we could optimistic update here
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.ticket_number?.toString().includes(searchQuery)
  );

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Live Chat Support</h1>
        <p className="text-muted-foreground">Real-time communication with store owners</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Chat List */}
        <Card className="flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
                <p className="p-4 text-center text-sm text-muted-foreground">Loading...</p>
            ) : filteredTickets.length === 0 ? (
                <p className="p-4 text-center text-sm text-muted-foreground">No active chats</p>
            ) : filteredTickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => setSelectedTicketId(ticket.id)}
                className={`w-full px-4 py-3 border-b text-left hover:bg-muted/50 transition-colors ${selectedTicketId === ticket.id ? 'bg-primary/10' : ''
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">#{ticket.ticket_number} - {ticket.customer_name || 'Customer'}</p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{ticket.subject}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${ticket.status === 'open' ? 'bg-green-500' : 'bg-muted'}`}></div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Chat Window */}
        <div className="lg:col-span-2 flex flex-col h-full">
          {selectedTicket ? (
            <>
              {/* Chat Header */}
              <Card className="flex items-center justify-between p-4 border-b rounded-b-none">
                <div>
                  <h3 className="font-semibold">{selectedTicket.customer_name || 'Customer'}</h3>
                  <p className="text-xs text-muted-foreground">Store: {selectedTicket.store_details?.name}</p>
                </div>
              </Card>

              {/* Messages */}
              <Card className="flex-1 overflow-y-auto p-4 space-y-4 rounded-t-none">
                {messages.map((msg) => {
                    const isMe = (msg.sender === currentUser?.id) || 
                               (currentUser?.role === 'ADMIN' && msg.sender_type === 'support') ||
                               (currentUser?.role !== 'ADMIN' && msg.sender_type === 'customer' && msg.sender === currentUser?.id);
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`max-w-xs rounded-lg p-3 ${isMe
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-foreground'
                                    }`}
                            >
                                <p className="text-sm">{msg.content || msg.message}</p>
                                <p className={`text-[10px] mt-1 ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
              </Card>

              {/* Input Area */}
              <Card className="p-4 rounded-t-none border-t">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </>
          ) : (
            <Card className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a conversation to start chatting
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
