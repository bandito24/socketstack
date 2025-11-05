import {create} from "zustand";
import {combine} from "zustand/middleware";


export const useRoomSearchStore = create(
    combine({ search: undefined as string | undefined }, (set) => ({
        setSearch: (val: string | undefined) => set({ search: val }),
    }))
)