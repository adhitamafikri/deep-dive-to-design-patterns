/**
 * This example demonstrates the Singleton pattern
 * I use this example because I have used this pattern to solve a state management problem in my Kokatto Live Chat SDK,
 * where I need the entities like WebSocketConnection, SessionHandler, and KKTLiveChatSDK to be able to share the latest state of our program
 * ----
 * In order for those entities to share the same state, we need the StateManager to be a singleton
 */

interface Message {
  id?: string;
  content: string;
  sender: string;
  timestamp: number;
}

interface Attachment {
  id?: string;
  url: string;
  type: string;
  size: number;
  file?: File;
}

class StateManager {
  private static instance: StateManager;

  private connectionStatus: "connected" | "connecting" | "disconnected" =
    "disconnected";
  private messages: Array<Message> = [];
  private attachments: Array<Attachment> = [];

  static getInstance(): StateManager {
    if (!this.instance) {
      this.instance = new StateManager();
    }

    return this.instance;
  }

  setConnectionStatus(status: "connected" | "connecting" | "disconnected") {
    this.connectionStatus = status;
  }
  getConnectionStatus(): "connected" | "connecting" | "disconnected" {
    return this.connectionStatus;
  }

  pushMessage(message: Message) {
    console.log("Pushing message:", message);
    this.messages = [...this.messages, message];
  }
  getMessages(): Array<Message> {
    return this.messages;
  }

  pushAttachment(attachment: Attachment) {
    this.attachments.push(attachment);
  }
  getAttachments(): Array<Attachment> {
    return this.attachments;
  }
}

/**
 * Using StateManager on the other entities
 * ---
 * SessionHandler as the entity that would communicate directly with the WebSocketConnection
 * KKTLiveChatSDK as the entity that would be the interface to the application that uses the SDK
 */
class SessionHandler {
  constructor() {
    console.log("SessionHandler constructor");
  }

  connect() {
    StateManager.getInstance().setConnectionStatus("connecting");
  }
  disconnect() {
    StateManager.getInstance().setConnectionStatus("disconnected");
  }

  sendMessage(message: Message) {
    StateManager.getInstance().pushMessage(message);
  }
  sendAttachment(attachment: Attachment) {
    StateManager.getInstance().pushAttachment(attachment);
  }
  getMessages() {
    return StateManager.getInstance().getMessages();
  }
  getAttachments() {
    return StateManager.getInstance().getAttachments();
  }
}

class KKTLiveChatSDK {
  sessionHandler: SessionHandler;

  constructor() {
    console.log("KKTLiveChatSDK constructor");
    this.sessionHandler = new SessionHandler();
  }

  connect() {
    this.sessionHandler?.connect();
  }
  disconnect() {
    this.sessionHandler?.disconnect();
  }

  sendMessage(message: Message) {
    this.sessionHandler?.sendMessage(message);
  }
  sendAttachment(attachment: Attachment) {
    this.sessionHandler?.sendAttachment(attachment);
  }
  getMessages() {
    return this.sessionHandler?.getMessages();
  }
  getAttachments() {
    return this.sessionHandler?.getAttachments();
  }
}

// Using the the KKTLiveChatSDK
const sdk = new KKTLiveChatSDK();
sdk.connect();
sdk.sendMessage({
  content: "Hello, how are you?",
  sender: "John Doe",
  timestamp: Date.now(),
});
sdk.sendMessage({
  content: "I need your help to fix my computer",
  sender: "John Doe",
  timestamp: Date.now(),
});

console.log("\nMessages to send:");
sdk.getMessages().forEach((message) => {
  console.log(message);
});
