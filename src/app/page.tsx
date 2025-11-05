import {User} from "better-auth";
import Link from "next/link";
import {Button} from "@/components/ui/button.tsx";
import {authClient} from "@/lib/auth-client.ts";
import LogoutButton from "@/app/(no-auth)/LogoutButton.tsx";
import {getServerAuthSession} from "@/utils/getServerAuthSession.tsx";
import Header from "@/components/header/Header.tsx";
import {MessageSquare, Shield, Trash2, Users, Zap, Lock, Radio, Cog} from "lucide-react";
import {Card} from "@/components/ui/card.tsx";
import {ReactNode} from "react";
import {cn} from "@/lib/utils.ts";

export default async function Home() {
    const data = await getServerAuthSession();
    const signedIn = !!data?.user


    return (

        <div className="w-full overflow-scroll flex justify-center p-8">
            <div className="max-w-4xl w-full space-y-8">
                {/* Hero Section */}
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div
                            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <MessageSquare className="h-8 w-8 stroke-background"/>
                        </div>
                    </div>
                    <h1 className="text-xl md:text-2xl">Welcome to SocketStack</h1>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto">
                        A completely anonymous messaging platform that prioritizes your privacy above all else
                    </p>
                </div>
                <div className="flex justify-center pt-4">
                    <Button
                        asChild
                        size="lg"
                        className="px-8 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                    >
                        <Link className="" href={!signedIn ? "/sign-up" : "/rooms"}>
                            {signedIn ? "Continue" : "Get Started"} with SocketStack
                        </Link>
                    </Button>
                </div>

                {/* Feature Cards */}
                <div className="grid md:grid-cols-2 gap-4">
                    <CardWrapper classes={"bg-primary/5"}>
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Shield className="h-5 w-5 text-primary"/>
                        </div>
                        <h3 className="text-foreground">Completely Anonymous</h3>
                        <p className="text-muted-foreground">
                            No email, no phone number, no personal information required. Just a username and you're in.
                        </p>
                    </CardWrapper>


                    <CardWrapper classes={"bg-chart-2/5"}>
                        <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
                            <Trash2 className="h-5 w-5 text-chart-2"/>
                        </div>
                        <h3 className="text-foreground">Zero Data Storage</h3>
                        <p className="text-muted-foreground">
                            We don't store any messages. When the last person leaves a room, all messages are
                            permanently lost.
                        </p>
                    </CardWrapper>


                    <CardWrapper classes={"bg-chart-3/5"}>
                        <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
                            <Zap className="h-5 w-5 text-chart-3"/>
                        </div>
                        <h3 className="text-foreground">Peer-to-Peer Router</h3>
                        <p className="text-muted-foreground">
                            SocketStack acts as a smart router, connecting users directly. Chat history is shared by
                            active participants.
                        </p>
                    </CardWrapper>


                    <CardWrapper classes={"bg-chart-5/5"}>
                        <div className="w-10 h-10 rounded-lg bg-chart-5/10 flex items-center justify-center">
                            <Lock className="h-5 w-5 text-chart-5"/>
                        </div>
                        <h3 className="text-foreground">Password Protected Rooms</h3>
                        <p className="text-muted-foreground">
                            Create private rooms with password protection for secure conversations with specific groups.
                        </p>
                    </CardWrapper>


                    <CardWrapper classes={"bg-chart-4/20"}>
                        <div className="w-10 h-10 rounded-lg bg-chart-4/20 flex items-center justify-center">
                            <Radio className="h-5 w-5 text-chart-4"/>
                        </div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-foreground">Room Hub Discovery</h3>
                            <span className="px-2 py-0.5 text-xs bg-chart-4/20 text-chart-4 rounded-full">New</span>
                        </div>
                        <p className="text-muted-foreground">
                            Browse and discover public rooms in the Room Hub. Share your room with others by
                            broadcasting it with a description.
                        </p>
                    </CardWrapper>


                    <CardWrapper classes={"bg-chart-1/5"}>
                        <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-info"/>
                        </div>
                        <h3 className="text-foreground">Live Member Counts</h3>
                        <p className="text-muted-foreground">
                            See who's online in real-time. Click on member counts to view active and offline
                            participants in any room.
                        </p>
                    </CardWrapper>
                </div>

                {/* How It Works */}
                <Card className="p-8 space-y-4 bg-gradient-to-r from-primary/5 to-chart-2/5 border-primary/20">
                    <div className="flex items-center gap-2">
                        <Cog className="h-6 w-6 text-primary"/>
                        <h3 className="text-foreground">How It Works</h3>
                    </div>
                    <p className="text-foreground/90">
                        SocketStack relies on concurrent connections to provide chat history. When you join a room,
                        active members share the conversation history with you. This means messages exist only in the
                        collective memory of connected users.
                    </p>
                    <p className="text-foreground/90">
                        Once everyone leaves a room, the conversation is gone forever. This ensures complete privacy
                        and gives you full control over your digital footprint.
                    </p>
                </Card>


                {/* CTA Button */}


                {/* Footer Note */}
                <p className="text-center text-sm text-gray-500 pb-20">
                    By using SocketStack, you acknowledge that all messages are ephemeral and will be lost when no users
                    remain in a room.
                </p>
            </div>
        </div>
    );
}

function CardWrapper({children, classes}: { children: ReactNode, classes?: string }) {

    return (
        <Card
        className={cn("p-6 space-y-0 md:space-y-3 hover:border-primary/50 transition-colors", classes ?? '')}
        >
            {children}
        </Card>
    )
}






