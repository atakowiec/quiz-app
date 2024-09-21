import { createContext, ReactNode, useState } from 'react';

export const ReloadApiContext = createContext<ReloadApiContextType | null>(null);

export interface ReloadApiContextType {
  reloadToken: number;
  reloadApi: () => void;
}

export function ReloadApiProvider({ children }: { children: ReactNode }) {
  const [reload, setReload] = useState(1);

  return (
    <ReloadApiContext.Provider value={{ reloadToken: reload, reloadApi: () => setReload(prev => prev + 1) }}>
      {children}
    </ReloadApiContext.Provider>
  );
}