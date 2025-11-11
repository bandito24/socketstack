import {ChatWindow} from "@/app/(auth)/rooms/[slug]/ChatWindow.tsx";
import {mockRooms} from "@/mocks.ts";
import {render, screen} from "@testing-library/react";
import {describe} from "vitest";
import {RoomUsersDTO} from "@mytypes/DTOs.ts";
import {collectActiveAndInactive, MembersSheet} from "@/app/(auth)/rooms/[slug]/MembersSheet.tsx";

const alice: RoomUsersDTO = {username: "alice", avatar_color: "red"};
const bob: RoomUsersDTO = {username: "bob", avatar_color: "blue"};
const charlie: RoomUsersDTO = {username: "charlie", avatar_color: "green"};
const mockMembersStack = ['charlie', 'bob']
const allMembers = [alice, bob, charlie]
describe("member sheet", () => {

    it("correctly displays inactive and inactive members on load", async () => {
        useQueryDataMock.mockReturnValue(allMembers)
       render(<MembersSheet isOpen={true} onClose={() => null} room={mockRooms[0]} memberStack={mockMembersStack}/>)
        const inactive = await screen.findAllByTestId(/inactive/i)
        const active = await screen.findAllByTestId(/^active/i)
        expect(inactive).toHaveLength(1)

        expect(active).toHaveLength(2)

    })



    describe('unit for inactive members filters', () => {

        it('correctly filters out active and inactive', () => {


            const {inactive, active} = collectActiveAndInactive(['alice', 'bob'], allMembers)
            expect(inactive.length).toBe(1)
            expect(active.length).toBe(2)

        })
        it('returns empty for invalid args', () => {
            // @ts-ignore
            const {inactive, active} = collectActiveAndInactive(undefined, undefined)
            expect(inactive.length).toBe(0)
            expect(active.length).toBe(0)
        })
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




