import React, { createContext, useContext } from 'react';

interface BusinessTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

interface ThemeContextType {
  theme: BusinessTheme;
  setTheme: (theme: BusinessTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = React.useState<BusinessTheme>({
    primaryColor: '#1E90FF',
    secondaryColor: '#D4AF37',
    accentColor: '#FFFFFF',
  });

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useBusinessTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useBusinessTheme must be used within ThemeProvider');
  }
  return context;
};
