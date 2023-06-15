import React, { type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Separator } from "../ui/separator";
import { PageContainer } from "../PageContainer";

type ConvoLayoutProps = {
  children: ReactNode;
};

export const ConversationLayout = ({ children }: ConvoLayoutProps) => {
  return (
    <PageContainer
      title="Conversations"
      description="Interested in having a conversation with an AI empowered therapist?"
    >
      <div className="hidden border-t bg-background md:block">
        <div className="grid lg:grid-cols-5">
          <Sidebar />
          <div className="col-span-4 flex">
            <Separator orientation="vertical" />
            <div className=" mx-10 h-full w-full">
              <div className="flex h-full items-center justify-center align-middle text-2xl font-semibold tracking-tight">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
