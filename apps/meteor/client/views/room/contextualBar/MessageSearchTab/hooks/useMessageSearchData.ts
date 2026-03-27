import { useState, useEffect } from 'react';
import { getMessages } from '../../../../../../lib/messages'; // adjust path

export const useMessageSearchData = (roomId: string, searchQuery: string) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const data = await getMessages(roomId, searchQuery);
        setMessages(data);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [roomId, searchQuery]);

  return { messages, loading };
};
