import {CreateRoomSchema, CreateRoomSchemaType} from "#root/form-schemas.ts";
import {SubmitHandler, useForm, UseFormReturn} from "react-hook-form";
import useRoomForm, {handleFormError, handleFormSuccess} from "@/hooks/useRoomForm.ts";
import {beforeAll, describe, expect, vi} from "vitest";
import {mockHookForm, mockRoom} from "@/mocks.ts";
import {act, renderHook} from "@testing-library/react";


function createMocks() {
    const form = mockHookForm() as unknown as UseFormReturn<any>
    const setPasswordEnabled = vi.fn()
    const setServerErr = vi.fn()
    const setRooms = vi.fn()
    const setOpen = vi.fn()
    const queryClient = {invalidateQueries: vi.fn()}
    const successFn = vi.fn()

    return {form, setPasswordEnabled, setServerErr, setRooms, setOpen, queryClient, successFn}
}



describe("UseRoomFormHook", () => {
    describe("Live hook implementation", () => {
        beforeAll(() => {
            vi.clearAllMocks()

            vi.mock("@tanstack/react-query", () => ({
                useQueryClient: () => ({
                    invalidateQueries: vi.fn(),
                }),
                useMutation: () => ({
                    mutate: vi.fn()
                })
            }));
            vi.mock("@/contexts/RoomProvider.tsx", async () => {
                const actual = await vi.importActual<typeof import("@/contexts/RoomProvider.tsx")>(
                    "@/contexts/RoomProvider.tsx"
                );
                return {
                    ...actual, // keep all real named exports (RoomSchema, Room, etc.)
                    default: () => ({
                        rooms: [],
                        setRooms: vi.fn(),
                    }),
                };
            });
        })


        it("Disables and resets password when password is toggled off", () => {
            const form = mockHookForm() as unknown as UseFormReturn<CreateRoomSchemaType>
            const {result} = renderHook(() => useRoomForm<typeof CreateRoomSchema>('/rooms', form))
            act(() => result.current.handleTogglePassword(false, CreateRoomSchema))
            expect(form.setValue).toHaveBeenCalledWith('password', '')
            expect(form.setValue).toHaveBeenCalledWith('confirm_password', '')
            expect(result.current.passwordEnabled).toBe(false)
        })


    })


    describe("HandleFormError function", () => {
        function init(argument: any) {
            const mocks = createMocks();
            const formError = handleFormError(mocks)
            formError(argument)
            return {mocks}
        }

        it("Enables password for 422 status", () => {
            const {mocks} = init({status: 422})
            expect(mocks.setPasswordEnabled).toHaveBeenCalledWith(true)
            expect(mocks.form.setError).not.toHaveBeenCalled();
            expect(mocks.setServerErr).not.toHaveBeenCalled();
        })
        it("Handles non valid values", () => {
            function check(mocks) {
                expect(mocks.setPasswordEnabled).not.toHaveBeenCalled()
                expect(mocks.form.setError).not.toHaveBeenCalled();
                expect(mocks.setServerErr).toHaveBeenCalled();
            }

            const {mocks: mocks1} = init('test')
            check(mocks1)
            vi.clearAllMocks()
            const {mocks: mocks2} = init({test: 'test'})
            check(mocks2)
        })
    })
    describe("HandleFormSuccess function", () => {

        async function init(argument: any) {
            const mocks = createMocks();
            const formFn = handleFormSuccess(mocks)
            await formFn(argument)
            return {mocks}
        }

        it("Does not proceed for non room object", async () => {
            const {mocks} = await init({test: 123})
            expect(mocks.setRooms).not.toHaveBeenCalled();
            expect(mocks.setOpen).not.toHaveBeenCalled();
        })
        it("Calls necessary functions", async () => {
            const {mocks} = await init(mockRoom())
            expect(mocks.setRooms).toHaveBeenCalled();
        })
    })
})
