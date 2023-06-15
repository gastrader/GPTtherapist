
import Chatbox from "~/component/conversations/Chatbox";
import { Separator } from "~/component/ui/separator";
import { Sidebar } from "~/component/conversations/Sidebar";
import { PageContainer } from "~/component/PageContainer";

export default function ConversationIdPage() {
    return (
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
                  <div className=" w-full h-full mx-10">
                    <Chatbox />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
  )
}


