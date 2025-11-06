import { create } from 'zustand'
import { combine } from 'zustand/middleware'

interface InitialStates  {
    showProfile: boolean

}
type UpdateState<T> = (prevState: T) => T
type StoreUpdateState = (setter: boolean | UpdateState<boolean>) => void;


interface SetterStates {
    setShowProfile: StoreUpdateState
}

export const useDisplayComponentStore = create<InitialStates & SetterStates>()(
    combine(
        { showProfile: false },
        (set) => ({
            setShowProfile: (setter) =>
                set((state) => ({
                    showProfile:
                        typeof setter === "function"
                            ? setter(state.showProfile)
                            : setter,
                })),
        })
    )
);