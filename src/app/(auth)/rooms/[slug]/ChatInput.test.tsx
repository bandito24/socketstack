import ChatInput from "@/app/(auth)/rooms/[slug]/ChatInput.tsx";
import {mockRooms} from "@/mocks.ts";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {beforeAll} from "vitest";

const mockSend = vi.fn()

async function addText(text: string): Promise<HTMLInputElement> {
    render(<ChatInput room={mockRooms[0]} onSend={(val) => mockSend(val)}/>)
    const input: HTMLInputElement = screen.getByLabelText(/enter/i)
    await userEvent.type(input, text)
    return input
}

describe("chat input", () => {

    beforeEach(() => vi.resetAllMocks())


    it("sends a message on pressing enter", async () => {
            await addText('hello');
            await userEvent.keyboard('{Enter}');
            expect(mockSend).toHaveBeenCalledWith('hello')

        }
    )
    it("trims a message and does not send an empty message", async () => {
        const input = await addText('    ');
        await userEvent.keyboard('{Enter}');
        expect(mockSend).not.toHaveBeenCalled()
        await userEvent.type(input, '       123')
        await userEvent.keyboard('{Enter}');
        expect(mockSend).toHaveBeenCalledWith('123')
    })
    it("is empty after sending a message", async () => {
        const input = await addText('123');
        await userEvent.keyboard('{Enter}');
        expect(input.value).toBe('')
    })
})