import "@testing-library/jest-dom";


export const authSignInMock = vi.fn()
export const authSignUpMock = vi.fn()
vi.mock("@/lib/auth-client.ts", () => ({
    authClient: {signIn: {username: authSignInMock}, signUp: {email: authSignUpMock}}
}))

export const pushRouterMock = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushRouterMock
    })
}))

export const handleServerErrorMock = vi.fn()
vi.mock("@/utils/serverRequest.ts", () => ({
    default: {
        handleServerError: handleServerErrorMock,
    }
}));



// export const mockFormSetError = vi.fn()
//
// // Partially mock the module
// vi.mock("react-hook-form", async () => {
//     const actual = await vi.importActual<typeof import("react-hook-form")>("react-hook-form");
//     return {
//         ...actual,            // Keep all real exports
//         useForm: (...args) => {
//             const form = (actual as any).useForm(...args);
//             return {
//                 ...form,
//                 setError: mockFormSetError,  // 🔁 Replace only this
//             };
//         },
//     };
// });
//

