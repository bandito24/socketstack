import {beforeEach, describe} from "vitest";
import {act, renderHook} from "@testing-library/react";
import {useDisplayComponentStore} from "@/hooks/useDisplayComponentStore.ts";



function initHook() {
    const showProfileHook = renderHook(() =>
        useDisplayComponentStore((s) => s.showProfile)
    );
    const setShowProfileHook = renderHook(() =>
        useDisplayComponentStore((s) => s.setShowProfile)
    );
    return {
        get showProfile() {
            return showProfileHook.result.current;
        },
        setShowProfile: setShowProfileHook.result.current,
    };
}

describe("UseDisplayComponentStore Hook", () => {
    beforeEach(() => {
        useDisplayComponentStore.setState({showProfile: false})
    })
    it("Updates state with direct variable", () => {
        const hk = initHook();
        act(() => {
            hk.setShowProfile(true)
        })
        expect(hk.showProfile).toBe(true)
    })
    it("Updates state with fn", () => {
        const hk = initHook();
        act(() => {
            hk.setShowProfile((prev) => !prev)
        })
        expect(hk.showProfile).toBe(true)
    })



})


