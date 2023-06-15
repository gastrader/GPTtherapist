import { Separator } from "../../component/ui/separator";
import { Sidebar } from "../../component/conversations/Sidebar";
import { PageContainer } from "../../component/PageContainer";
import { ConversationLayout } from "~/component/conversations/ConversationLayout";

export default function ConversationsPage() {
  return <p>Please select an option</p>;
}
ConversationsPage.getLayout = function getLayout(page: React.ReactElement) {
  return <ConversationLayout>{page}</ConversationLayout>;
};
