import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define the context shape
interface AppContextType {
  isEffectTrue: boolean;
  enableEffect: () => void; // Changed from toggleEffect to enableEffect for clarity
}

// Create the context with a default value
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isEffectTrue, setIsEffectTrue] = useState(false);

  // Function to enable the effect
  const enableEffect = () => setIsEffectTrue(true);

  // Effect to automatically disable after 1 second
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isEffectTrue) {
      timer = setTimeout(() => {
        setIsEffectTrue(false);
      }, 1000);
    }
    return () => clearTimeout(timer); // Cleanup to avoid memory leaks
  }, [isEffectTrue]);

  return (
    <AppContext.Provider value={{ isEffectTrue, enableEffect }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the boolean context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within a AppProvider");
  }
  return context;
};
