import {describe} from "vitest";
import {getAvatarLetters} from "@/lib/utils.ts";


describe("getAvatarLetters", () => {
    it("Separates two words", () => {
        expect(getAvatarLetters("My TEST")).toBe("MT")
    })
    it("Separates two words with special chars", () => {
        expect(getAvatarLetters("my-.tEST")).toBe("MT")
    })
    it("handles single char letters", () => {
        expect(getAvatarLetters("M")).toBe("M")
    })
})