import Chatbox from "~/component/conversations/Chatbox";
import { Separator } from "~/component/ui/separator";
import { Sidebar } from "~/component/conversations/Sidebar";
import { PageContainer } from "~/component/PageContainer";
import { ConversationLayout } from "~/component/conversations/ConversationLayout";

export default function ConversationIdPage() {
  return (

    <Chatbox />

  );
}

ConversationIdPage.getLayout = function getLayout(page: React.ReactElement) {
  return <ConversationLayout>{page}</ConversationLayout>;
};
