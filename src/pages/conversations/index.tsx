
import { ConversationLayout } from "~/component/conversations/ConversationLayout";

export default function ConversationsPage() {
  return <p className="align-middle flex items-center mx-auto">Please select an option</p>;
}
ConversationsPage.getLayout = function getLayout(page: React.ReactElement) {
  return <ConversationLayout>{page}</ConversationLayout>;
};
