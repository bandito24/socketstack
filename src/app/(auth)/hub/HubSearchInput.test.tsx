import {beforeEach, describe} from "vitest";
import {findAllByTestId, render, screen} from "@testing-library/react";
import HubSearchInput from "@/app/(auth)/hub/HubSearchInput.tsx";
import RoomResults from "@/app/(auth)/hub/RoomResults.tsx";
import {mockRooms} from "@/mocks.ts";
import userEvent from "@testing-library/user-event";

beforeEach(() => vi.clearAllMocks())
describe("hub search input", () => {
    it("provides the search input to room results which filters rooms", async() => {
       render(<>
       <HubSearchInput/>
        <RoomResults rooms={mockRooms} />
       </>)
        const input = screen.getByLabelText(/^search socketstack/i)
        await userEvent.type(input, "1")
        const results = await screen.findAllByTestId('room-result')
        expect(results).toHaveLength(1)
        expect(results[0]).toHaveTextContent('123')


    })
})


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