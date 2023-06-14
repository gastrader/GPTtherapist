import { ScrollArea, ScrollBar } from "../../component/ui/scroll-area"
import { Separator } from "../../component/ui/separator"
import { Sidebar } from "../../component/conversations/Sidebar"

import { PlusCircle } from "lucide-react"
import { Button } from "../../component/ui/button"

import { PageContainer } from "../../component/PageContainer";

export default function ConversationIdPage() {

    return(
        <PageContainer
            title="Conversations"
            description="Interested in having a conversation with an AI empowered therapist?">
            <div className="hidden md:block">
                <div className="border-t">
                    <div className="bg-background">
                        <div className="grid lg:grid-cols-5">
                            <Sidebar className="hidden lg:block" playlists={[]} />
                            <div className="col-span-4 flex">
                                <Separator orientation="vertical" />
                                <div className=" bg-blue-50 w-full h-full mx-10">
                                    <div>
                                        INSERT CHAT IN HERE
                                    </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    )
}