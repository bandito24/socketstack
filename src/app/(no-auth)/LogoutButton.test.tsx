import LogoutButton from "@/app/(no-auth)/LogoutButton.tsx";
import {fireEvent, render, screen} from "@testing-library/react";
import React from "react";

vi.mock("@/lib/auth-client.ts", () => ({
    authClient:  {signOut: vi.fn()}
}))
vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: vi.fn() }),
}));
import { authClient } from "@/lib/auth-client.ts";
describe("LogoutButton",  () => {

    it("Calls auth client signOut form better auth when clicked", async() => {
        render(<LogoutButton/>)
        const button = screen.getByText("Logout");
        expect(screen.getByText("Logout")).toBeInTheDocument();
        fireEvent.click(button)
        expect(authClient.signOut).toHaveBeenCalled();
    })

})