import {render, screen, Screen, within} from "@testing-library/react";
import {CreateChatroom} from "@/app/(auth)/rooms/CreateChatRoom.tsx";
import userEvent from "@testing-library/user-event";
import {beforeEach} from "vitest";


async function getElements(screen: Screen) {
    const broadcastSwitch = screen.getByRole('switch', { name: /broadcast/i })
    const passwordSwitch = screen.getByRole('switch', { name: /password/i })
    const nameInput = screen.getByLabelText(/name/i);
    const dialog = await screen.findByRole('dialog');
    const submit = within(dialog).getByRole('button', { name: /create/i });
    return {broadcastSwitch, nameInput, passwordSwitch, submit}
}
async function fillPasswordInputs(
    screen: Screen,
    passwords: { password?: string; confirm?: string } = {}
) {

    const passwordInput = await screen.findByLabelText('Password');
    const confirmPasswordInput = await screen.findByLabelText(/confirm password/i);

    if (passwords.password) {
        await userEvent.type(passwordInput, passwords.password);
    }

    if (passwords.confirm) {
        await userEvent.type(confirmPasswordInput, passwords.confirm);
    }

    return { passwordInput, confirmPasswordInput };
}
async function openPage(screen: Screen){
    await userEvent.click(screen.getByRole('button', {name: /create/i}))
}

beforeEach(() => vi.clearAllMocks())



describe("Create Room Component", () => {
    it("does not allow the user to use password and broadcast", async () => {
        render(<CreateChatroom btnVariant={'main'}/>)
        await openPage(screen)
        const {broadcastSwitch, nameInput, passwordSwitch, submit} = await getElements(screen)
        await userEvent.click(broadcastSwitch)
        expect(broadcastSwitch).toBeChecked() //Should be true
        await userEvent.click(passwordSwitch)
        expect(broadcastSwitch).not.toBeChecked() //Setting password makes it false
        expect(passwordSwitch).toBeChecked();
        await userEvent.click(broadcastSwitch)
        expect(broadcastSwitch).not.toBeChecked() //Prevents from being true while password is selected
        await fillPasswordInputs(screen, {password: '123', confirm: '123'})
        await userEvent.type(nameInput, '123');
        await userEvent.click(submit)
        expect(mutationAsyncMock).toHaveBeenCalledWith(expect.objectContaining({broadcasting: false}))
    })
    it("does not allow a broadcasted room without a description", async () => {
        render(<CreateChatroom btnVariant={'main'}/>)
        await openPage(screen)
        const {broadcastSwitch, nameInput, submit} = await getElements(screen)
        await userEvent.click(broadcastSwitch)
        await userEvent.type(nameInput, '123');
        await userEvent.click(submit)
        expect(mutationAsyncMock).not.toHaveBeenCalled();

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


