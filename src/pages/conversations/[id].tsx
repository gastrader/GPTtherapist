import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { api } from "../../utils/api";
import { Input } from "../../component/Input";
import { Button } from "../../component/ui/button";
import { useState } from "react";

export default function ConversationIdPage() {
  const router = useRouter();
  const { mutateAsync } = api.conversation.createConversation.useMutation();

  const [message, setMessage] = useState("");

  const conversationId = router.query.id;

  const handleSubmit = async () => {
    const res = await mutateAsync({ message });

    if (res) {
      await router.replace(`/conversations/${res.conversation.id}`);
    }
  };

  if (conversationId === "new") {
    return (
      <div>
        <Input value={message} onChange={(e) => setMessage(e.target.value)} />
        <Button onClick={handleSubmit}>submit</Button>
      </div>
    );
  }

  return <ExistingConversation id={conversationId as string} />;
}

function ExistingConversation({ id }: { id: string }) {
  const queryContext = api.useContext();
  const { data, isLoading } = api.conversation.getConversation.useQuery({ id });

  const { mutateAsync } = api.conversation.updateConversation.useMutation();

  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    const res = await mutateAsync(
      { conversationId: id, message },
      {
        onSuccess: () => {
          void queryContext.conversation.getConversation.invalidate();
          setMessage("");
        },
      }
    );
  };

  if (isLoading || !data) {
    return <div>loading conversation</div>;
  }

  return (
    <div>
      {data.messages.map((msg) => (
        <div key={msg.id}>
          <span>you: {msg.prompt}</span>
          <br />
          <span>ai:{msg.aiResponseText}</span>
        </div>
      ))}
      <div>
        <Input value={message} onChange={(e) => setMessage(e.target.value)} />
        <Button onClick={handleSubmit}>submit</Button>
      </div>
    </div>
  );
}
