import { useState, useEffect, useRef } from 'react';
import { Send, Search, Plus, Hash, User, MoreVertical, Paperclip, Smile } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { api } from '../services/api';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import toast from 'react-hot-toast';
import { Database } from '../lib/database.types';

type DBMessage = Database['public']['Tables']['messages']['Row'] & {
  users?: Database['public']['Tables']['users']['Row'];
};

type DBChannel = Database['public']['Tables']['channels']['Row'];

const Messages = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [messages, setMessages] = useState<DBMessage[]>([]);
  const [channels, setChannels] = useState<DBChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [newMessage, setNewMessage] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChannels();
  }, [currentUser]);

  useEffect(() => {
    if (selectedChannel) {
      loadMessages(selectedChannel);
    }
  }, [selectedChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChannels = async () => {
    if (!currentUser?.id) return;
    
    try {
      setLoading(true);
      const channelsData = await api.channels.getUserChannels(currentUser.id);
      setChannels(channelsData || []);
      
      // Select first channel by default
      if (channelsData && channelsData.length > 0) {
        setSelectedChannel(channelsData[0].id);
      }
    } catch (error) {
      console.error('Error loading channels:', error);
      toast.error('Failed to load channels');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (channelId: string) => {
    try {
      const messagesData = await api.messages.getByChannel(channelId);
      setMessages(messagesData || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const directMessages = [
    { id: '2', name: 'Mike Chen', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=1', online: true },
    { id: '3', name: 'Emma Rodriguez', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=1', online: false },
    { id: '4', name: 'David Kim', avatar: 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=1', online: true }
  ];

  const getFilteredMessages = () => {
    if (selectedChannel) {
      return messages.filter(msg => msg.channel_id === selectedChannel);
    }
    // For now, we'll only support channel messages since direct messages require different schema
    return [];
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChannel || !currentUser?.id) return;
    
    try {
      const messageData = {
        channel_id: selectedChannel,
        sender_id: currentUser.id,
        content: newMessage.trim(),
        message_type: 'text' as const
      };

      await api.messages.send(messageData);
      setNewMessage('');
      
      // Reload messages to show the new one
      await loadMessages(selectedChannel);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const MessageBubble = ({ message }: { message: DBMessage }) => {
    const isOwnMessage = message.sender_id === currentUser?.id;
    
    return (
      <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwnMessage 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          {!isOwnMessage && (
            <p className="text-xs font-medium mb-1 opacity-75">{message.users?.name || 'Unknown User'}</p>
          )}
          <p className="text-sm">{message.content}</p>
          <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
            {format(parseISO(message.created_at), 'HH:mm')}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full bg-white">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Messages</h1>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Channels */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Channels</h3>
            <div className="space-y-1">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => {
                    setSelectedChannel(channel.id);
                    setSelectedUser('');
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-gray-100 ${
                    selectedChannel === channel.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <Hash className="w-4 h-4" />
                  <span className="text-sm font-medium">{channel.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Direct Messages */}
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Direct Messages</h3>
            <div className="space-y-1">
              {directMessages.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    setSelectedUser(user.id);
                    setSelectedChannel('');
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-gray-100 ${
                    selectedUser === user.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <div className="relative">
                    <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                      user.online ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <span className="text-sm font-medium">{user.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {(selectedChannel || selectedUser) ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {selectedChannel ? (
                    <>
                      <Hash className="w-5 h-5 text-gray-600" />
                      <div>
                        <h2 className="font-semibold text-gray-900">
                          {channels.find(c => c.id === selectedChannel)?.name}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {channels.find(c => c.id === selectedChannel)?.description || 'No description'}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <User className="w-5 h-5 text-gray-600" />
                      <div>
                        <h2 className="font-semibold text-gray-900">
                          {directMessages.find(u => u.id === selectedUser)?.name}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {directMessages.find(u => u.id === selectedUser)?.online ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {getFilteredMessages().map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              
              {getFilteredMessages().length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder={`Message ${selectedChannel ? `#${channels.find(c => c.id === selectedChannel)?.name}` : directMessages.find(u => u.id === selectedUser)?.name}`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Smile className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a channel or direct message to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;