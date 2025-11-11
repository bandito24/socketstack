import "@testing-library/jest-dom";
import {vi} from "vitest";
import {mockRooms, mockUser} from "@/mocks.ts";
import {QueryClient} from "@tanstack/react-query";
import {ReactNode} from "react";


export const authSignInMock = vi.fn()
export const authSignUpMock = vi.fn()
export const useAuthSessionMock = vi.fn(() => ({session: {user: mockUser()}}))
vi.mock("@/lib/auth-client.ts", () => ({
    authClient: {
        signIn: {username: authSignInMock},
        signUp: {email: authSignUpMock},
        useSession: () => useAuthSessionMock
    }
}))

export const usePathnameMock = vi.fn();
export const pushRouterMock = vi.fn();
export const useParamsMock = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushRouterMock,
    }),
    usePathname: usePathnameMock,
    useParams: useParamsMock,
}));

export const handleServerErrorMock = vi.fn()
export const serverRequestPostMock = vi.fn()
export const serverRequestGetMock = vi.fn()
vi.mock("@/utils/serverRequest.ts", () => ({
    default: {
        handleServerError: handleServerErrorMock,
        post: serverRequestPostMock,
        get: serverRequestGetMock
    }
}));


// export const mutationMock = vi.fn();
// export const mutationAsyncMock = vi.fn();
// export const useQueryDataMock = vi.fn()
//
// vi.mock("@tanstack/react-query", () => ({
//     useQueryClient: () => ({
//         invalidateQueries: vi.fn(),
//     }),
//     // useMutation: () => ({
//     //     mutate: mutationMock,
//     //     mutateAsync: mutationAsyncMock,
//     //     isPending: false,
//     //     isError: false,
//     //     isSuccess: false,
//     //     reset: vi.fn(),
//     // }),
//     // useQuery: vi.fn().mockImplementation(() => ({
//     //     data: useQueryDataMock(),
//     //     isLoading: false,
//     //     error: null,
//     //     refetch: vi.fn(),
//     // })),
// }));
export function testQueryClient(){
   return new QueryClient({
       defaultOptions: {
           queries: {
               retry: false,
           },
       },
   })
}




vi.mock("@/contexts/RoomProvider.tsx", async () => {
    const actual = await vi.importActual<typeof import("@/contexts/RoomProvider.tsx")>(
        "@/contexts/RoomProvider.tsx"
    );
    return {
        ...actual, // keep all real named exports (RoomSchema, Room, etc.)
        default: () => ({
            rooms: mockRooms,
            setRooms: vi.fn(),
        }),
    };
});


type Listener = (payload?: any) => void;
function createMockSocket() {
    const listeners: Record<string, Listener[]> = {};

    return {
        on(event: string, cb: Listener) {
            (listeners[event] ||= []).push(cb);
        },
        off(event: string, cb: Listener) {
            listeners[event] = (listeners[event] || []).filter((fn) => fn !== cb);
        },
        emit(event: string, payload?: any) {
            for (const fn of listeners[event] || []) fn(payload);
        },
        connect: vi.fn(),
        disconnect: vi.fn(),
        listeners
    };
}
export const mockSocket = createMockSocket()

// The mock context value
export const useSocketProviderMockValue = {
    clientSocket: mockSocket,
    setClientSocket: vi.fn(),
};

// The default export mock for the hook
export const useSocketProviderMock = vi.fn(() => useSocketProviderMockValue);


vi.mock("@/contexts/SocketProvider", () => ({
    default: useSocketProviderMock,
}));


export function createMockUseRoomFormHook() {
    return {
        onSubmit: vi.fn(),
        mutation: {
            mutate: vi.fn(),
            isPending: false,
            isSuccess: false,
            isError: false,
        },
        open: true,
        setOpen: vi.fn(),
        passwordEnabled: false,
        setPasswordEnabled: vi.fn(),
        serverErr: undefined,
        setServerErr: vi.fn(),
        handleTogglePassword: vi.fn(),
        resetFormAndHide: vi.fn(),
        form: {
            register: vi.fn(),
            handleSubmit: vi.fn(),
            setValue: vi.fn(),
            watch: vi.fn(),
            formState: {errors: {}},
            reset: vi.fn(),
        },
    };
}


class ResizeObserver {
    observe() {
    }

    unobserve() {
    }

    disconnect() {
    }
}

(globalThis as any).ResizeObserver = ResizeObserver;





