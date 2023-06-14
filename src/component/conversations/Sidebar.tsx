import {
    LayoutGrid,
    ScrollText,
    ListMusic,
    Mic,
    Pencil,
    CloudOff,
    List,
    MessageCircle,
    MessageSquare
} from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"

type Playlist = (typeof conversations)[number]

const conversations = [
    "Gavin",
    "Evan",
    "Player",
    "Pimp",
    "Gavin",
    "Evan",
    "Player",
    "Pimp",
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    playlists: Playlist[]
}

export function Sidebar({ className }: SidebarProps) {
    return (
        <div className={cn("pb-12", className)}>
            <div className="space-y-4 py-4">
                <div className="px-4 py-2">
                    <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                        Start A New Conversation
                    </h2>
                    <div className="space-y-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                        >
                            <ScrollText className="mr-2 h-4 w-4" />
                            Text Me
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                            <Mic className="mr-2 h-4 w-4" />
                            Talk to Me
                        </Button>
                    </div>
                </div>
                <div className="px-4 py-2">
                    <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                        Resources
                    </h2>
                    <div className="space-y-1">
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                            <CloudOff className="mr-2 h-4 w-4" />
                            Meditate
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                            <Pencil className="mr-2 h-4 w-4" />
                            Journal
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                            <List className="mr-2 h-4 w-4" />
                            To-Do List
                        </Button>
                    </div>
                </div>
                <div className="py-2">
                    <h2 className="relative px-6 text-lg font-semibold tracking-tight">
                        Conversations
                    </h2>
                    <ScrollArea className="h-[300px] px-2">
                        <div className="space-y-1 p-2">
                            {conversations?.map((conversation, i) => (
                                <Button
                                    key={`${conversation}-${i}`}
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start font-normal"
                                >
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    {conversation}
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}