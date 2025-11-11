import { beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChatSidebar } from "@/app/(auth)/rooms/ChatSidebar.tsx";
import {usePathnameMock} from "#root/tests/vitest.setup.ts";
import userEvent from "@testing-library/user-event";






describe("Chat Sidebar", () => {
    beforeEach(() => vi.clearAllMocks());

    it("Hides sidebar on mobile screens for in-room path", () => {
        usePathnameMock.mockReturnValue("/rooms/123");
        render(<ChatSidebar />);

        expect(usePathnameMock).toHaveBeenCalled();
        const parent = screen.getByRole("region");
        expect(parent).toHaveClass("hidden");
    });
    it("correctly filters based on search input", async () => {
        render(<ChatSidebar />);
        const input = screen.getByLabelText(/search chats/i)
        await userEvent.type(input, '1')
        const visibleRooms = await screen.findAllByTestId(/^chatroom-item/)
        expect(visibleRooms).toHaveLength(1)
        await userEvent.clear(input);
        const visibleRooms2 = await screen.findAllByTestId(/^chatroom-item/)
        expect(visibleRooms2).toHaveLength(4)
    })
    it("will bring up the create room window", () => {
        render(<ChatSidebar />);

    })
});

const mutationMock = vi.fn();
const mutationAsyncMock = vi.fn();
const useQueryDataMock = vi.fn()

vi.mock("@tanstack/react-query", () => ({
    useQueryClient: () => ({
        invalidateQueries: vi.fn(),
    }),
    useMutation: () => ({
        mutate: mutationMock,
        mutateAsync: mutationAsyncMock,
        isPending: false,
        isError: false,
        isSuccess: false,
        reset: vi.fn(),
    }),
    useQuery: vi.fn().mockImplementation(() => ({
        data: useQueryDataMock(),
        isLoading: false,
        error: null,
        refetch: vi.fn(),
    })),
}));