"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { WS_BASE_URL } from "@/config/api";
import { api } from "@/lib/api/client";

type WebSocketMessage = {
  type: string;
  data?: unknown;
  timestamp?: number;
};

type WebSocketHookOptions = {
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
};

export function useWebSocket(options: WebSocketHookOptions = {}) {
  const {
    onMessage,
    onConnect,
    onDisconnect,
    onError,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
  } = options;

  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectCountRef = useRef(0);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    const token = api.getToken();
    if (!token) {
      console.error("No authentication token available");
      return;
    }

    try {
      const wsUrl = `${WS_BASE_URL}?token=${token}`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        reconnectCountRef.current = 0;
        onConnect?.();
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          onMessage?.(message);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        onDisconnect?.();

        // Attempt reconnection
        if (reconnectCountRef.current < reconnectAttempts) {
          reconnectCountRef.current += 1;
          reconnectTimerRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      wsRef.current.onerror = (error) => {
        onError?.(error);
      };
    } catch (error) {
      console.error("Failed to connect WebSocket:", error);
    }
  }, [onMessage, onConnect, onDisconnect, onError, reconnectAttempts, reconnectInterval]);

  const disconnect = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    sendMessage,
    connect,
    disconnect,
  };
}

// Hook for real-time notifications
export function useRealtimeNotifications(onNotification?: (notification: unknown) => void) {
  const { isConnected, sendMessage } = useWebSocket({
    onMessage: (message) => {
      if (message.type === "notification") {
        onNotification?.(message.data);
      }
    },
  });

  const markAsRead = useCallback(
    (notificationId: string) => {
      sendMessage({
        type: "mark_read",
        data: { notificationId },
      });
    },
    [sendMessage]
  );

  return {
    isConnected,
    markAsRead,
  };
}

// Hook for real-time ticket updates
export function useRealtimeTickets(onTicketUpdate?: (ticket: unknown) => void) {
  const { isConnected } = useWebSocket({
    onMessage: (message) => {
      if (message.type === "ticket_update" || message.type === "ticket_created") {
        onTicketUpdate?.(message.data);
      }
    },
  });

  return { isConnected };
}

// Hook for real-time meeting captions
export function useRealtimeCaptions(
  meetingId: string,
  onCaption?: (caption: { text: string; timestamp: number; speaker?: string }) => void
) {
  const { isConnected, sendMessage } = useWebSocket({
    onMessage: (message) => {
      if (message.type === "caption" && message.data) {
        onCaption?.(message.data as { text: string; timestamp: number; speaker?: string });
      }
    },
  });

  const sendCaption = useCallback(
    (text: string) => {
      sendMessage({
        type: "caption",
        data: {
          meetingId,
          text,
          timestamp: Date.now(),
        },
      });
    },
    [sendMessage, meetingId]
  );

  return {
    isConnected,
    sendCaption,
  };
}
