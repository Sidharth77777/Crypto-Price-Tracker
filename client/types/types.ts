export interface ContextValuesType {
    tempEmail: string, 
    setTempEmail: (value:string) => void,

    tempOTP: string;
    setTempOTP: (value:string) => void,

    userEmail: string, 
    setUserEmail: (value:string) => void,

    isLogged: boolean,
    setIsLogged: (value:boolean) => void;
}

export type CoinSuggestion = {
  _id?: string;
  id: string;
  name: string;
  symbol: string;
  platforms?: Record<string, string>;
  relevance?: number;
};

export type CoinAlert = {
  coinId: string;
  contractAddress?: string;
  createdAt: string;
  image?: string;
  isActive: boolean;
  muteEmailNotifications: boolean;
  symbol: string;
  targetPrice: number;
  triggeredAt?: string | null;
  updatedAt: string;
  userId: string;
  __v?: number;
  _id?: string;
}