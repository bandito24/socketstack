import {usePathnameMock} from "#root/tests/vitest.setup.ts";
import {describe} from "vitest";
import {render, screen} from "@testing-library/react";
import {ChatWindow} from "@/app/(auth)/rooms/[slug]/ChatWindow.tsx";
import {mockRooms} from "@/mocks.ts";

// usePathnameMock.mockReturnValue("/rooms/123");
describe.skip("chat window", () => {

    describe("correctly displays ", () => {
        it("opens dialog to leave group", () => {
            render(<ChatWindow room={mockRooms[0]}/>)
            const leaveRoomItem = screen.getByRole('menuitem', {name: /leave room/i});
        })
    })

})