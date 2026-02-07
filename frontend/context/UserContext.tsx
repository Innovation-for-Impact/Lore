// UserContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types/constants';
import { DeviceEventEmitter } from 'react-native';

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener("REFRESH_FAILED", () => {
      setUser(null);
    })
    return () => subscription.remove();
  })

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
