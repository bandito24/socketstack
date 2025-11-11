import {ChatRoomItem} from "@/app/(auth)/rooms/ChatRoomItem.tsx";
import {mockMessageIOEvent, mockRooms} from "@/mocks.ts";
import {render, screen} from "@testing-library/react";
import {RoomPreview} from "@/app/(auth)/rooms/ChatRoomList.tsx";


const mockRoomPreview: RoomPreview = {stackCount: 10, lastMessage: mockMessageIOEvent, unreadMessageCount: 2}


vi.mock("@/hooks/useTimeRefresh.ts", () => ({
    default: vi.fn().mockReturnValue(() => ({timeLabel: '123'}))
}))
describe("chat room item", () => {
    beforeEach(()=> vi.clearAllMocks())

    const indicateReadMock = vi.fn()
    it("calls the indicateRead function and is not unread when the active room", () => {
        render(<ChatRoomItem room={mockRooms[0]} activeSlug={'123'}
                             roomPreview={mockRoomPreview} indicateRead={indicateReadMock}/>)
        expect(indicateReadMock).toHaveBeenCalled()
        expect(screen.getByTestId('preview-content')).toHaveTextContent(mockRoomPreview.lastMessage?.content ?? '')
        expect(screen.queryByTestId('preview-count')).not.toBeInTheDocument()
    })
    it("is marked as unread when not the active room", () => {
        render(<ChatRoomItem room={mockRooms[0]} activeSlug={'different-room'}
                             roomPreview={mockRoomPreview} indicateRead={indicateReadMock}/>)
        expect(indicateReadMock).not.toHaveBeenCalled()
        expect(screen.getByTestId('preview-content')).toHaveTextContent(mockRoomPreview.lastMessage?.content ?? '')
        expect(screen.queryByTestId('preview-count')).toBeInTheDocument()
    })
})