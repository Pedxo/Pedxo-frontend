// src/utility/notificationBus.js
import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
} from './adminApi.js';

function playNotificationSound() {
  const audio = new Audio("/sounds/notification.mp3"); // make sure you have this file in /public/sounds/
  audio.play().catch(err => console.error("Sound play failed:", err));
}


// Create notification context
const NotificationContext = createContext();

// Mock notifications for development/testing
const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    title: 'New Contract Created',
    message: 'Contract #123 "E-commerce Website" has been created and needs developer assignment.',
    type: 'contract',
    priority: 'medium',
    read: false,
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    actionUrl: '/admin/contracts',
    actionText: 'View Contract'
  },
  {
    id: '2',
    title: 'Developer Assignment Complete',
    message: 'John Doe has been successfully assigned to Project Alpha.',
    type: 'assignment',
    priority: 'low',
    read: false,
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    actionUrl: '/admin/assignments',
    actionText: 'View Assignment'
  },
  {
    id: '3',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur tonight at 2:00 AM EST.',
    type: 'system',
    priority: 'high',
    read: true,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    actionUrl: null,
    actionText: null
  }
];

// Notification Provider Component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  // Load notifications from API
  const loadNotifications = useCallback(async (forceRefresh = false) => {
    // Don't fetch if we recently fetched (unless forced)
    if (!forceRefresh && lastFetch && Date.now() - lastFetch < 30000) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getNotifications();
      
      if (result.ok && result.notifications) {
        setNotifications(result.notifications);
        setUnreadCount(result.unreadCount || result.notifications.filter(n => !n.read).length);
      } else {
        // Fallback to mock data for development
        console.warn('Using mock notifications:', result.error);
        setNotifications(MOCK_NOTIFICATIONS);
        setUnreadCount(MOCK_NOTIFICATIONS.filter(n => !n.read).length);
      }
      
      setLastFetch(Date.now());
    } catch (err) {
      console.error('Error loading notifications:', err);
      setError('Failed to load notifications');
      
      // Fallback to mock data
      setNotifications(MOCK_NOTIFICATIONS);
      setUnreadCount(MOCK_NOTIFICATIONS.filter(n => !n.read).length);
    } finally {
      setIsLoading(false);
    }
  }, [lastFetch]);

  // Mark single notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      const result = await markNotificationAsRead(notificationId);
      
      if (result.ok) {
        setNotifications(prev => 
          prev.map(notification =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } else {
        console.warn('Failed to mark notification as read:', result.error);
        // Update locally anyway for UX
        setNotifications(prev => 
          prev.map(notification =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, []);

  // Mark all notifications as read
  const markAllRead = useCallback(async () => {
    try {
      const result = await markAllNotificationsAsRead();
      
      if (result.ok) {
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, read: true }))
        );
        setUnreadCount(0);
      } else {
        console.warn('Failed to mark all notifications as read:', result.error);
        // Update locally anyway for UX
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, read: true }))
        );
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  }, []);

  // Clear/delete single notification
  const clearNotification = useCallback(async (notificationId) => {
    try {
      const result = await deleteNotification(notificationId);
      
      if (result.ok) {
        setNotifications(prev => {
          const updated = prev.filter(n => n.id !== notificationId);
          const removedNotification = prev.find(n => n.id === notificationId);
          if (removedNotification && !removedNotification.read) {
            setUnreadCount(prevCount => Math.max(0, prevCount - 1));
          }
          return updated;
        });
      } else {
        console.warn('Failed to delete notification:', result.error);
        // Update locally anyway for UX
        setNotifications(prev => {
          const updated = prev.filter(n => n.id !== notificationId);
          const removedNotification = prev.find(n => n.id === notificationId);
          if (removedNotification && !removedNotification.read) {
            setUnreadCount(prevCount => Math.max(0, prevCount - 1));
          }
          return updated;
        });
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(async () => {
    try {
      const result = await clearAllNotifications();
      
      if (result.ok) {
        setNotifications([]);
        setUnreadCount(0);
      } else {
        console.warn('Failed to clear all notifications:', result.error);
        // Update locally anyway for UX
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Error clearing all notifications:', err);
    }
  }, []);

  

  // Add new notification (for real-time updates)
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: notification.id || Date.now().toString(),
      title: notification.title || '',
      message: notification.message,
      type: notification.type || 'system',
      priority: notification.priority || 'medium',
      read: false,
      timestamp: notification.timestamp || new Date().toISOString(),
      actionUrl: notification.actionUrl || null,
      actionText: notification.actionText || null
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);


    // Play notification sound for high priority notifications
    if (notification.priority === 'high') {
      playNotificationSound();
    }

    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification(newNotification.title || 'New Notification', {
        body: newNotification.message,
        icon: '/favicon.ico', // Adjust path as needed
        tag: newNotification.id
      });
    }
  }, []);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }, []);

  // Auto-refresh notifications periodically
  useEffect(() => {
    loadNotifications(); // Initial load

    const interval = setInterval(() => {
      loadNotifications();
    }, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [loadNotifications]);

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  const contextValue = {
    notifications,
    unreadCount,
    isLoading,
    error,
    loadNotifications,
    markAsRead,
    markAllRead,
    clearNotification,
    clearAllNotifications,
    addNotification,
    requestNotificationPermission
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use notifications
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    // Fallback implementation for when used outside of provider
    console.warn('useNotifications used outside of NotificationProvider, using fallback');
    
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [unreadCount, setUnreadCount] = useState(MOCK_NOTIFICATIONS.filter(n => !n.read).length);

    const markAsRead = useCallback((id) => {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }, []);

    const markAllRead = useCallback(() => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    }, []);

    const clearNotification = useCallback((id) => {
      setNotifications(prev => {
        const updated = prev.filter(n => n.id !== id);
        const removed = prev.find(n => n.id === id);
        if (removed && !removed.read) {
          setUnreadCount(prevCount => Math.max(0, prevCount - 1));
        }
        return updated;
      });
    }, []);

    const clearAllNotifications = useCallback(() => {
      setNotifications([]);
      setUnreadCount(0);
    }, []);

    return {
      notifications,
      unreadCount,
      isLoading: false,
      error: null,
      loadNotifications: () => {},
      markAsRead,
      markAllRead,
      clearNotification,
      clearAllNotifications,
      addNotification: () => {},
      requestNotificationPermission: () => Promise.resolve(false)
    };
  }
  
  return context;
};

// Notification utility functions
export const createNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.warn("Could not play notification sound:", error);
  }
};

// Helper to format notification time
export const formatNotificationTime = (timestamp) => {
  if (!timestamp) return 'Just now';
  
  const now = new Date();
  const notificationTime = new Date(timestamp);
  const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

// Helper to get notification icon based on type
export const getNotificationIcon = (type) => {
  const icons = {
    assignment: '👤',
    contract: '📋',
    system: '⚙️',
    warning: '⚠️',
    success: '✅'
  };
  return icons[type] || '📢';
};

// Helper to get notification priority styling
export const getNotificationPriorityClass = (priority) => {
  const classes = {
    high: 'border-l-4 border-red-500',
    medium: 'border-l-4 border-yellow-500',
    low: 'border-l-4 border-blue-500'
  };
  return classes[priority] || 'border-l-4 border-gray-300';
};

// Mock notification generator for testing
export const generateMockNotification = (type = 'system') => {
  const types = ['assignment', 'contract', 'system', 'warning', 'success'];
  const priorities = ['high', 'medium', 'low'];
  
  const selectedType = types.includes(type) ? type : types[Math.floor(Math.random() * types.length)];
  const priority = priorities[Math.floor(Math.random() * priorities.length)];
  
  const messages = {
    assignment: [
      'New developer has been assigned to Project Alpha',
      'Assignment completed for E-commerce Website project',
      'Developer John Doe requested reassignment'
    ],
    contract: [
      'New contract created: Mobile App Development',
      'Contract #123 has been updated',
      'Contract deadline approaching for Project Beta'
    ],
    system: [
      'System maintenance scheduled for tonight',
      'Database backup completed successfully',
      'New admin features available'
    ],
    warning: [
      'High server load detected',
      'Multiple failed login attempts detected',
      'Low disk space warning'
    ],
    success: [
      'Payment processed successfully',
      'Project milestone reached',
      'System update completed'
    ]
  };
  
  const typeMessages = messages[selectedType];
  const message = typeMessages[Math.floor(Math.random() * typeMessages.length)];
  
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    title: selectedType.charAt(0).toUpperCase() + selectedType.slice(1) + ' Notification',
    message,
    type: selectedType,
    priority,
    read: false,
    timestamp: new Date().toISOString(),
    actionUrl: selectedType === 'contract' ? '/admin/contracts' : 
               selectedType === 'assignment' ? '/admin/assignments' : null,
    actionText: selectedType === 'contract' ? 'View Contract' :
                selectedType === 'assignment' ? 'View Assignment' : null
  };
};

// Real-time notification connection (WebSocket/SSE placeholder)
export const connectToNotificationStream = (onNotification) => {
  // This would implement WebSocket or Server-Sent Events
  console.log('Connecting to notification stream...');
  
  // Mock real-time notifications for development
  const interval = setInterval(() => {
    if (Math.random() > 0.95) { // 5% chance every 10 seconds
      const mockNotification = generateMockNotification();
      onNotification(mockNotification);
    }
  }, 10000);
  
  // Return cleanup function
  return () => {
    console.log('Disconnecting from notification stream...');
    clearInterval(interval);
  };
};

// Export default useNotifications for convenience
export default useNotifications;