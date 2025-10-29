import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
type ClockContextType = {
    baseClock: number,
}

const BaseClockContext = createContext<ClockContextType | undefined>(undefined)
export function BaseClockProvider({ children }: { children: ReactNode }) {
    // Create QueryClient once per browser session
    const [baseClock, setBaseClock] = useState<number>(Date.now())

    useEffect(() => {
        const interval = setInterval(() => setBaseClock(Date.now()), 60_000);
        return () => clearInterval(interval);
    }, []);

    return <BaseClockContext.Provider value={{baseClock}}>{children}</BaseClockContext.Provider>;
}

export default function useBaseClockContext(){
    const context = useContext(BaseClockContext)
    if(!context) throw new Error('must use base clock context within appropriate provider')
    return context
}
