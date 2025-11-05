'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    useEffect(() => {
        console.error('Error in /rooms:', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <h2 className="text-xl font-semibold mb-2">Something went wrong 💥</h2>
            <p className=" mb-4">{error.message}</p>
            <button
                onClick={() => reset()}
                className="px-4 py-2 rounded-md bg-blue-500  hover:bg-blue-600 transition"
            >
                Try again
            </button>
        </div>
    );
}
