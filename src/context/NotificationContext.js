import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', options = {}) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      message,
      type, // success, error, warning, info
      ...options,
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-dismiss after 6 seconds unless persistent
    if (!options.persistent) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, options.duration || 6000);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const success = useCallback((message, options) => 
    addNotification(message, 'success', options), [addNotification]);
  
  const error = useCallback((message, options) => 
    addNotification(message, 'error', options), [addNotification]);
  
  const warning = useCallback((message, options) => 
    addNotification(message, 'warning', options), [addNotification]);
  
  const info = useCallback((message, options) => 
    addNotification(message, 'info', options), [addNotification]);

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        addNotification, 
        removeNotification, 
        success, 
        error, 
        warning, 
        info 
      }}
    >
      {children}
      
      {/* Render notifications */}
      <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999 }}>
        {notifications.map((notification) => (
          <Snackbar
            key={notification.id}
            open={true}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            style={{ position: 'relative', marginBottom: 8 }}
          >
            <Alert
              severity={notification.type}
              onClose={() => removeNotification(notification.id)}
              variant="filled"
            >
              {notification.title && <AlertTitle>{notification.title}</AlertTitle>}
              {notification.message}
            </Alert>
          </Snackbar>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}

// Enhanced API client error handler
export function withNotifications(apiClient, notifications) {
  const originalRequest = apiClient.request.bind(apiClient);
  
  apiClient.request = async function(path, options = {}, retry = true) {
    try {
      const result = await originalRequest(path, options, retry);
      
      // Show success notifications for certain operations
      if (options.method === 'POST' && !options.silent) {
        notifications.success('Operation completed successfully');
      }
      
      return result;
    } catch (error) {
      // Don't show notifications for auth errors (handled by auth context)
      if (error.message.includes('401') || options.silent) {
        throw error;
      }
      
      notifications.error(
        error.message || 'Something went wrong',
        { title: 'Request Failed' }
      );
      throw error;
    }
  };
  
  return apiClient;
}
