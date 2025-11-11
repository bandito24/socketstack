import RoomResults from "@/app/(auth)/hub/RoomResults.tsx";
import {mockRooms, oneMoreMockRoom} from "@/mocks.ts";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {pushRouterMock, serverRequestPostMock, testQueryClient} from "#root/tests/vitest.setup.ts";
import {beforeEach} from "vitest";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Room} from "@/contexts/RoomProvider.tsx";

function renderComponent(rooms: Room[] = []) {
    const queryClient = testQueryClient()
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    render(<QueryClientProvider client={queryClient}>
        <RoomResults rooms={rooms}/>
    </QueryClientProvider>)
    return invalidateSpy
}

describe("room results", () => {
    beforeEach(() => vi.clearAllMocks())
    it("marks the correct rooms as already joined", () => {
        renderComponent([...mockRooms, oneMoreMockRoom])
        expect(screen.getAllByText(/Already joined/)).toHaveLength(4);
        expect(screen.getAllByRole('button', {name: 'Join Room'})).toHaveLength(1)
    })
    it("Calls function to join room on button click", async () => {
        const invalidateSpy = renderComponent([oneMoreMockRoom])

        await userEvent.click(screen.getByRole('button', {name: 'Join Room'}))
        expect(serverRequestPostMock).toHaveBeenCalledWith('rooms/room_users', expect.anything())
        expect(invalidateSpy).toHaveBeenCalled()
        expect(pushRouterMock).toHaveBeenCalled()
    })
    it("does not call navigate away or invalidate tanstack on failure", async() => {

        serverRequestPostMock.mockImplementationOnce(() => {throw new Error("this is an error")});
        const invalidateSpy = renderComponent([oneMoreMockRoom])
        await userEvent.click(screen.getByRole('button', {name: 'Join Room'}))
        expect(invalidateSpy).not.toHaveBeenCalled()
        expect(pushRouterMock).not.toHaveBeenCalled()

    })

})