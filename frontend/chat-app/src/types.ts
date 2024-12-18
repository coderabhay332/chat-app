export interface ChatMessage {
    type: 'chat';
    payload: {
      message: string;
      sender?: 'self' | 'other';
    };
  }
  
  export interface JoinMessage {
    type: 'join';
    payload: {
      roomId: string;
    };
  }
  
  export type WebSocketMessage = ChatMessage | JoinMessage;
  
  export interface Styles {
    [key: string]: React.CSSProperties;
  }