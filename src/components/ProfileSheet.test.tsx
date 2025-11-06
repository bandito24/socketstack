import useClientAuthSession from "@/utils/useClientAuthSession.tsx";
import {describe, vi} from "vitest";
import React from "react";
import {mockUser} from "@/mocks.ts";
import {useDisplayComponentStore} from "@/hooks/useDisplayComponentStore.ts";
import {render, screen} from "@testing-library/react";
import ProfileSheet from "@/components/ProfileSheet.tsx";

vi.mock("@/utils/useClientAuthSession.tsx", () => ({
    default: vi.fn()
}));
vi.mock("@/hooks/useDisplayComponentStore", () => ({
    useDisplayComponentStore: vi.fn(),
}));



describe("Profile Sheet Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useDisplayComponentStore as any).mockImplementation((selector: any) =>
            selector({
                showProfile: true,
                setShowProfile: vi.fn(),
            })
        );
    });


    it("Does not render with no user signed in", () => {

        (useClientAuthSession as any).mockReturnValue({ data: { user: null } });
        render(<ProfileSheet/>)
        expect(screen.queryByText("Profile")).not.toBeInTheDocument();


    })
    it("Renders user information", () => {
        (useClientAuthSession as any).mockReturnValue({ data: { user: mockUser() } });
        render(<ProfileSheet />);
        expect(screen.getByText("TestUser")).toBeInTheDocument();
    })
})
