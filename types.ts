
export enum AppMode {
  HOME = 'HOME',
  CHAT = 'CHAT',
  VISION = 'VISION',
  IMAGE_GEN = 'IMAGE_GEN',
  ADMIN = 'ADMIN',
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  image?: string; // base64
  isLoading?: boolean;
}

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
  delay?: number;
}