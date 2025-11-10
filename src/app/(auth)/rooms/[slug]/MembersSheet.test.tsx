import {ChatWindow} from "@/app/(auth)/rooms/[slug]/ChatWindow.tsx";
import {mockRooms} from "@/mocks.ts";
import {render, screen} from "@testing-library/react";
import {useAuthSessionMock, usePathnameMock} from "#root/tests/vitest.setup.ts";
import {describe} from "vitest";
import {RoomUsersDTO} from "@mytypes/DTOs.ts";
import {collectActiveAndInactive} from "@/app/(auth)/rooms/[slug]/MembersSheet.tsx";



usePathnameMock.mockReturnValue("/rooms/123");
// describe("member sheet", () => {
//
//    describe("correctly displays ", () => {
//        it("opens dialog to leave group", () => {
//            render(<ChatWindow room={mockRooms[0]} />)
//            const leaveRoomItem = screen.getByRole('menuitem', { name: /leave room/i });
//        })
//    })
// })

const alice: RoomUsersDTO = { username: "alice", avatar_color: "red" };
const bob: RoomUsersDTO = { username: "bob", avatar_color: "blue" };
const charlie: RoomUsersDTO = { username: "charlie", avatar_color: "green" };
const allMembers = [alice, bob, charlie]
describe('unit for inactive members filters', () => {
    it('correctly filters out active and inactive', () => {


       const {inactive, active} = collectActiveAndInactive(['alice', 'bob'], allMembers)
        expect(inactive.length).toBe(1)
        expect(active.length).toBe(2)

    })
    it('returns empty for invalid args', () => {
        const {inactive, active} = collectActiveAndInactive(undefined, undefined)
        expect(inactive.length).toBe(0)
        expect(active.length).toBe(0)
    })
})