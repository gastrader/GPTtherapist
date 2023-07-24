import { useRouter } from "next/router";
import Chatbox from "~/component/conversations/Chatbox";

import { ConversationLayout } from "~/component/conversations/ConversationLayout";
import Videobox from "~/component/conversations/Videobox";

export default function ConversationIdPage() {
  const router = useRouter()
  const { type } = router.query
  if (router.isFallback){
    return <div>Loading...</div>
  }
  return (
    <>
      {type === 'text' && <Chatbox />}
      {type === 'video' && <Videobox />}
    </>
  );
}

ConversationIdPage.getLayout = function getLayout(page: React.ReactElement) {
  return <ConversationLayout>{page}</ConversationLayout>;
};
