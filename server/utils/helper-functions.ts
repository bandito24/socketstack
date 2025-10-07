export function slugify(text: string) {
    return text
        .normalize('NFD')                 // 1️⃣ split accented characters into base + accent
        .replace(/[\u0300-\u036f]/g, '')  // 2️⃣ remove accents
        .toLowerCase()                    // 3️⃣ lowercase everything
        .trim()                           // 4️⃣ remove leading/trailing spaces
        .replace(/[^a-z0-9]+/g, '-')      // 5️⃣ replace non-alphanumeric with hyphen
        .replace(/^-+|-+$/g, '');         // 6️⃣ remove leading/trailing hyphens
}