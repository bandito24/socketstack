import { create } from 'zustand'
import { combine } from 'zustand/middleware'

interface InitialStates  {
    showProfile: boolean
    showJoinRoom: boolean
    showCreateRoom: boolean
}
type UpdateState<T> = (prevState: T) => T
type StoreUpdateState = (setter: boolean | UpdateState<boolean>) => void;


interface SetterStates {
    setShowProfile: StoreUpdateState
    setShowJoinRoom: StoreUpdateState
    setShowCreateRoom: StoreUpdateState
}

export const useDisplayComponentStore = create<InitialStates & SetterStates>()(combine(
    {showProfile: false, showJoinRoom: false, showCreateRoom: false}, (set) => ({
        setShowProfile: setter => set(state => ({
            showProfile: typeof setter === 'function' ? setter(state.showProfile) : setter
        })),
        setShowJoinRoom: (setter) =>
            set((state) => ({
                showJoinRoom:
                    typeof setter === "function"
                        ? setter(state.showJoinRoom)
                        : setter,
            })),
        setShowCreateRoom: (setter) =>
            set((state) => ({
                showCreateRoom:
                    typeof setter === "function"
                        ? setter(state.showCreateRoom)
                        : setter,
            })),

    })
))