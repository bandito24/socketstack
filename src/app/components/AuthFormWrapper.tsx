import {ReactNode} from "react";

export default function AuthFormWrapper({children, title, subtext}: { children: ReactNode, title: string, subtext: string }) {

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center gap-2">
                    <div
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-3xl">S</span>
                    </div>
                    <h1 className="text-center">{title}</h1>
                    <p className="text-center text-muted-foreground">
                        {subtext}
                    </p>
                </div>
                {children}
            </div>
        </div>


    )
}