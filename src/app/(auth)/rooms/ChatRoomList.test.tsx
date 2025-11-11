import {mockSocket, useParamsMock} from "#root/tests/vitest.setup.ts";
import ChatRoomList, {updateRoomPreview} from "@/app/(auth)/rooms/ChatRoomList.tsx";
import {mockEmptyRoomPreview, mockMemberEvent, mockMessageIOEvent, mockRooms} from "@/mocks.ts";
import {render, screen} from "@testing-library/react";


useParamsMock.mockImplementation(() => ({slug: '123'}))

function renderComponent() {
    render(<ChatRoomList rooms={mockRooms}/>);
}

describe.only("chat room list", () => {
    it("renders all rooms passed in as components", () => {
        renderComponent();
        expect(screen.getAllByTestId(/^chatroom-item/i)).toHaveLength(mockRooms.length)
    })
    it("has unread messages that are cleared by clicking on the room item", () => {
        renderComponent();
        expect(screen.queryByTestId(/^preview-count/i)).not.toBeInTheDocument()
        expect(Object.keys(mockSocket.listeners)).toContain("member-event");
    })
})


describe("unit: updateRoomPreviewState", () => {
    it("it modifies only the stack count with memberEvent", () => {
        const preview = mockEmptyRoomPreview();
        const result = updateRoomPreview(mockMemberEvent(), null, preview)
        expect(result.stackCount).toBe(3)
        expect({...preview, stackCount: null}).toEqual({...result, stackCount: null})
    })
    it("updates lastMessage but not unread count on MessageIO for active room", () => {

        const {room_id} = mockMessageIOEvent()
        const preview = mockEmptyRoomPreview()
        const result = updateRoomPreview(mockMessageIOEvent(), room_id, preview)
        expect(result.stackCount).toBe(3)
        expect(result.lastMessage).toEqual(mockMessageIOEvent())
        expect(result.unreadMessageCount).toBe(0)
    })
    it("updates lastMessage and unread count on MessageIO for active room", () => {
        const preview = mockEmptyRoomPreview()
        const result = updateRoomPreview(mockMessageIOEvent(), '9999', preview)
        expect(result.stackCount).toBe(3)
        expect(result.lastMessage).toEqual(mockMessageIOEvent())
        expect(result.unreadMessageCount).toBe(1)
    })
})