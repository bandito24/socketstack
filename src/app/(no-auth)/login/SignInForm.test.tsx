import {authClient} from "@/lib/auth-client.ts";
import {render, Screen, screen} from "@testing-library/react";
import SignInForm from "@/app/(no-auth)/login/SignInForm.tsx";
import userEvent from "@testing-library/user-event";
import {authSignInMock, handleServerErrorMock, pushRouterMock} from "#root/tests/vitest.setup.ts";


function getElements(screen: Screen) {
    return {
        password: screen.getByLabelText<HTMLInputElement>("Password"),
        username: screen.getByLabelText<HTMLInputElement>("Username"),
        submit: screen.getByRole("button", {name: /sign in/i})
    }
}

describe("SignInForm", () => {
    afterEach(() => vi.clearAllMocks());


    it("Allows toggling of password visibility", async () => {
        render(<SignInForm/>)
        const passwordInput = screen.getByLabelText<HTMLInputElement>("Password");
        expect(passwordInput.type).toBe('password')
        await userEvent.type(passwordInput, 'password')
        const toggleButton = screen.getByRole("button", {name: /show password/i});
        await userEvent.click(toggleButton);
        expect(passwordInput.type).toBe('text')
    })
    it("Calls Better Auth On Sign In And Navigates to Rooms", async() => {
        render(<SignInForm/>)
        const {password, username, submit} = getElements(screen)
        await userEvent.type(password, 'password')
        await userEvent.type(username, 'password')
        await userEvent.click(submit)
        expect(authClient.signIn.username).toHaveBeenCalled()
        expect(pushRouterMock).toHaveBeenCalled()

    })
    it("does not navigate for incomplete form", async()=> {
        render(<SignInForm/>)
        const {password, username, submit} = getElements(screen)
        await userEvent.type(username, 'uname')
        await userEvent.click(submit)
        expect(pushRouterMock).not.toHaveBeenCalled()
    })
    it("does not navigate on error", async() => {
        render(<SignInForm/>)
        const {password, username, submit} = getElements(screen)
        authSignInMock.mockRejectedValueOnce(new Error('err'))
        await userEvent.type(username, 'uname')
        await userEvent.type(password, 'password')
        await userEvent.click(submit)
        expect(authClient.signIn.username).toHaveBeenCalled()
        expect(pushRouterMock).not.toHaveBeenCalled()
        expect(handleServerErrorMock).toHaveBeenCalled

    })

})