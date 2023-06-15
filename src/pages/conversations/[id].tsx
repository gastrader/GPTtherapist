import Chatbox from "~/component/conversations/Chatbox";

import { ConversationLayout } from "~/component/conversations/ConversationLayout";

export default function ConversationIdPage() {
  return (

    <Chatbox />

  );
}

ConversationIdPage.getLayout = function getLayout(page: React.ReactElement) {
  return <ConversationLayout>{page}</ConversationLayout>;
};
