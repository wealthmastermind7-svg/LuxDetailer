import React, { createContext, useState, useCallback, ReactNode } from "react";

interface MascotContextType {
  message: string | null;
  setMascotMessage: (message: string | null) => void;
}

export const MascotContext = createContext<MascotContextType>({
  message: null,
  setMascotMessage: () => {},
});

interface MascotProviderProps {
  children: ReactNode;
}

export function MascotProvider({ children }: MascotProviderProps) {
  const [message, setMessage] = useState<string | null>(null);

  const setMascotMessage = useCallback((msg: string | null) => {
    setMessage(msg);
  }, []);

  return (
    <MascotContext.Provider value={{ message, setMascotMessage }}>
      {children}
    </MascotContext.Provider>
  );
}

export function useMascot() {
  const context = React.useContext(MascotContext);
  if (!context) {
    throw new Error("useMascot must be used within MascotProvider");
  }
  return context;
}
