import { useToast } from "@/hooks/use-toast";

// Network error types
export enum NetworkErrorType {
  OFFLINE = "OFFLINE",
  TIMEOUT = "TIMEOUT",
  SERVER_ERROR = "SERVER_ERROR",
  BLOCKCHAIN_ERROR = "BLOCKCHAIN_ERROR",
  WALLET_ERROR = "WALLET_ERROR",
  UNKNOWN = "UNKNOWN"
}

// Network error class
export class NetworkError extends Error {
  type: NetworkErrorType;
  originalError?: Error;
  
  constructor(message: string, type: NetworkErrorType = NetworkErrorType.UNKNOWN, originalError?: Error) {
    super(message);
    this.name = "NetworkError";
    this.type = type;
    this.originalError = originalError;
  }
}

// Function to detect network error type
export function detectNetworkErrorType(error: any): NetworkErrorType {
  // Check if browser is offline
  if (!navigator.onLine) {
    return NetworkErrorType.OFFLINE;
  }
  
  // Check for timeout errors
  if (
    error.message?.includes("timeout") || 
    error.message?.includes("timed out") ||
    error.code === "ETIMEDOUT"
  ) {
    return NetworkErrorType.TIMEOUT;
  }
  
  // Check for server errors
  if (
    error.status >= 500 || 
    error.message?.includes("server") ||
    error.message?.includes("5xx")
  ) {
    return NetworkErrorType.SERVER_ERROR;
  }
  
  // Check for blockchain specific errors
  if (
    error.message?.includes("blockchain") ||
    error.message?.includes("transaction") ||
    error.message?.includes("gas") ||
    error.message?.includes("execution")
  ) {
    return NetworkErrorType.BLOCKCHAIN_ERROR;
  }
  
  // Check for wallet errors
  if (
    error.message?.includes("wallet") ||
    error.message?.includes("sign") ||
    error.message?.includes("rejected") ||
    error.message?.includes("cancelled")
  ) {
    return NetworkErrorType.WALLET_ERROR;
  }
  
  return NetworkErrorType.UNKNOWN;
}

// Function to get user-friendly error message
export function getUserFriendlyErrorMessage(error: any): string {
  const errorType = detectNetworkErrorType(error);
  
  switch (errorType) {
    case NetworkErrorType.OFFLINE:
      return "You appear to be offline. Please check your internet connection and try again.";
    
    case NetworkErrorType.TIMEOUT:
      return "The request timed out. The network might be congested or the server might be experiencing issues.";
    
    case NetworkErrorType.SERVER_ERROR:
      return "The server encountered an error. Please try again later.";
    
    case NetworkErrorType.BLOCKCHAIN_ERROR:
      return "There was an error with the blockchain transaction. This could be due to network congestion, insufficient gas, or other blockchain issues.";
    
    case NetworkErrorType.WALLET_ERROR:
      return "There was an error with your wallet. The transaction may have been rejected or cancelled.";
    
    default:
      return error instanceof Error 
        ? error.message 
        : typeof error === 'string' 
          ? error 
          : "An unknown error occurred. Please try again.";
  }
}

// Retry function with exponential backoff
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let retries = 0;
  
  while (true) {
    try {
      return await fn();
    } catch (error: any) {
      retries++;
      
      // Don't retry if max retries reached or if it's not a retryable error
      const errorType = detectNetworkErrorType(error);
      const isRetryable = [
        NetworkErrorType.TIMEOUT, 
        NetworkErrorType.SERVER_ERROR,
        NetworkErrorType.BLOCKCHAIN_ERROR
      ].includes(errorType);
      
      if (retries >= maxRetries || !isRetryable) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = initialDelay * Math.pow(2, retries - 1);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Hook for handling network errors in components
export function useNetworkErrorHandler() {
  const { toast } = useToast();
  
  const handleNetworkError = (error: any, customMessage?: string) => {
    console.error("Network error:", error);
    
    const errorMessage = getUserFriendlyErrorMessage(error);
    
    toast({
      title: customMessage || "Network Error",
      description: errorMessage,
      variant: "destructive",
    });
    
    return errorMessage;
  };
  
  return { handleNetworkError };
}

// Function to check if the user is online
export function isOnline(): boolean {
  return navigator.onLine;
}

// Function to add online/offline event listeners
export function setupNetworkListeners(
  onOffline: () => void,
  onOnline: () => void
): () => void {
  window.addEventListener('offline', onOffline);
  window.addEventListener('online', onOnline);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('offline', onOffline);
    window.removeEventListener('online', onOnline);
  };
}