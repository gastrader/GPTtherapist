import {
  ScrollText,
  Mic,
  Pencil,
  CloudOff,
  List,
  MessageSquare,
  Coins,
} from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";
import { useBuyCredits } from "../../hooks/useBuyCredits";
import { api } from "~/utils/api";
import { Skeleton } from "../ui/skeleton";
import { format } from "date-fns";

type SidebarProps = {
  ignore?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export function Sidebar({}: SidebarProps) {
  const { buyCredits } = useBuyCredits();

  return (
    <div className="flex flex-grow flex-col space-y-4 py-4">
      <div className="px-4 py-2">
        <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
          Start A New Conversation
        </h2>
        <div className="space-y-1">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="w-full justify-start"
          >
            <Link href="/conversations/new">
              <ScrollText className="mr-2 h-4 w-4" />
              Text Me
            </Link>
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
        <ConversationList />
      </div>
      <Button
        variant="secondary"
        size="lg"
        className="mx-auto flex w-auto items-center justify-center text-sm"
        onClick={() => {
          buyCredits().catch(console.error);
        }}
      >
        <Coins className="mr-2 h-4 w-4" />
        Buy Credits
      </Button>
    </div>
  );
}

function ConversationList() {
  const { data: conversations, isLoading } =
    api.conversation.conversations.useQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-4 w-[250px]" />
        ))}
      </div>
    );
  }

  return (
    <>
      <h2 className="relative px-6 text-lg font-semibold tracking-tight">
        Conversations
      </h2>
      <ScrollArea className="h-[300px] px-2">
        <div className="space-y-1 p-2">
          {conversations?.map((conversation) => (
            <Link
              key={conversation.id}
              href={`/conversations/${conversation.id}`}
              passHref
            >
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start font-normal"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Conversation: {format(conversation.updatedAt, "d-M-yyyy")}
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </>
  );
}
