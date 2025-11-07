import {render, Screen, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignUpForm from "@/app/(no-auth)/sign-up/SignUpForm.tsx";
import {authClient} from "@/lib/auth-client.ts";
import {pushRouterMock} from "#root/tests/vitest.setup.ts";





describe("Sign Up Form", () => {
   it("Does not allow you to sign up with password and confirm mismatch", async () => {
       render(<SignUpForm/>)
       const {password, confPassword, username, submit} = getElements(screen)
       await fillForm(screen, {password: '123', confPassword: '321'})
       await userEvent.click(submit)
       expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
       expect(authClient.signUp.email).not.toHaveBeenCalled()
       expect(pushRouterMock).not.toHaveBeenCalled()

   })
})




function getElements(screen: Screen) {
    return {
        password: screen.getByLabelText<HTMLInputElement>("Password"),
        confPassword: screen.getByLabelText<HTMLInputElement>("Confirm Password"),
        username: screen.getByLabelText<HTMLInputElement>("Username"),
        submit: screen.getByRole("button", {name: /create account/i})
    }
}
async function fillForm(
    screen: Screen,
    data: {
        password?: string;
        confPassword?: string;
        username?: string;
    } = {}
) {
    const { password, confPassword, username } = getElements(screen);

    await userEvent.type(password, data.password ?? '123');
    await userEvent.type(confPassword, data.confPassword ?? '123');
    await userEvent.type(username, data.username ?? 'char');

    return { password, confPassword, username }
}
