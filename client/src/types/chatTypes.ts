export interface ConversationType {
  _id: string;
  members: string[];
  updatedAt: string;
  lastMessage: {
    text: string;
    sender: string;
  };
}

export interface MessageType {
  _id?: string;
  conversationId?: string;
  sender: string;
  text: string;
  createdAt: number;
  seen?: boolean;
}

export interface senderTypingType {
  senderId: string;
  conversationId: string;
  status: boolean;
}
export interface notificationType {
  _id: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  text: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: 0;
}
export interface newNotification {
  receiverId: string;
  conversationId: string;
  status: boolean;
}