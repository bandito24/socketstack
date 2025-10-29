import {User} from "better-auth";
import Link from "next/link";
import {Button} from "@/components/ui/button.tsx";
import {authClient} from "@/lib/auth-client.ts";
import LogoutButton from "@/app/(no-auth)/LogoutButton.tsx";
import {getServerAuthSession} from "@/utils/getServerAuthSession.tsx";
import Header from "@/components/header/Header.tsx";
import {MessageSquare, Shield, Trash2, Users, Zap, Lock} from "lucide-react";
import {Card} from "@/components/ui/card.tsx";

export default async function Home() {
    const data = await getServerAuthSession();
    const signedIn =  !!data?.user


    return (

        <div className="size-full flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
            <div className="max-w-4xl w-full space-y-8">
                {/* Hero Section */}
                <div className="text-center space-y-4 mt-96">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <MessageSquare className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-gray-900">Welcome to SocketStack</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        A completely anonymous messaging platform that prioritizes your privacy above all else
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="grid md:grid-cols-2 gap-4">
                    <Card className="p-6 space-y-3 border-2 border-gray-100 hover:border-indigo-200 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                            <Shield className="h-5 w-5 text-indigo-600" />
                        </div>
                        <h3 className="text-gray-900">Completely Anonymous</h3>
                        <p className="text-gray-600">
                            No email, no phone number, no personal information required. Just a username and you're in.
                        </p>
                    </Card>

                    <Card className="p-6 space-y-3 border-2 border-gray-100 hover:border-indigo-200 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Trash2 className="h-5 w-5 text-purple-600" />
                        </div>
                        <h3 className="text-gray-900">Zero Data Storage</h3>
                        <p className="text-gray-600">
                            We don't store any messages. When the last person leaves a room, all messages are permanently lost.
                        </p>
                    </Card>

                    <Card className="p-6 space-y-3 border-2 border-gray-100 hover:border-indigo-200 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                            <Zap className="h-5 w-5 text-pink-600" />
                        </div>
                        <h3 className="text-gray-900">Peer-to-Peer Router</h3>
                        <p className="text-gray-600">
                            SocketStack acts as a smart router, connecting users directly. Chat history is shared by active participants.
                        </p>
                    </Card>

                    <Card className="p-6 space-y-3 border-2 border-gray-100 hover:border-indigo-200 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <Lock className="h-5 w-5 text-green-600" />
                        </div>
                        <h3 className="text-gray-900">Password Protected Rooms</h3>
                        <p className="text-gray-600">
                            Create private rooms with password protection for secure conversations with specific groups.
                        </p>
                    </Card>
                </div>

                {/* How It Works */}
                <Card className="p-8 space-y-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-100">
                    <div className="flex items-center gap-2">
                        <Users className="h-6 w-6 text-indigo-600" />
                        <h3 className="text-gray-900">How It Works</h3>
                    </div>
                    <p className="text-gray-700">
                        SocketStack relies on concurrent connections to provide chat history. When you join a room,
                        active members share the conversation history with you. This means messages exist only in the
                        collective memory of connected users.
                    </p>
                    <p className="text-gray-700">
                        Once everyone leaves a room, the conversation is gone forever. This ensures complete privacy
                        and gives you full control over your digital footprint.
                    </p>
                </Card>

                {/* CTA Button */}
                <div className="flex justify-center pt-4">
                    <Button
                        asChild
                        size="lg"
                        className="px-8 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                    >
                        <Link href={!signedIn ? "/sign-up" : "/rooms"}>
                            {signedIn ? "Continue" : "Get Started"} with SocketStack
                        </Link>
                    </Button>
                </div>

                {/* Footer Note */}
                <p className="text-center text-sm text-gray-500">
                    By using SocketStack, you acknowledge that all messages are ephemeral and will be lost when no users remain in a room.
                </p>
            </div>
        </div>
    );
}






