import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function hashMyPassword(plainText: string): Promise<string> {
    const hash = await bcrypt.hash(plainText, SALT_ROUNDS);
    return hash;
}

export async function verifyMyPassword(plainText: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hash);
}