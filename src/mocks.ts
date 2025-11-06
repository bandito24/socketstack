
export const mockUser = () => ({
    username: "TestUser",
    avatar_color: "#3366ff",
    createdAt: new Date("2023-01-01").toISOString(),
});
export const mockRoom = () => ({
    id: 101,
    slug: "general-chat",
    name: "General Chat",
    avatar_color: "#6366f1",
    total_members: 12,
    description: "A place for general discussion about anything.",
});

export const mockHookForm = () => ({reset: vi.fn(), setValue: vi.fn(), setError: vi.fn()});
