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
      title="Conversations "
      note="NOTE during development we have disabled the ability to video chat due to high API costs, please use the text chat in the mean time"
      description="Interested in having a conversation with an AI empowered therapist? "
    >
      <div className="hidden border-t bg-background md:block">
        <div className="grid lg:grid-cols-5">
          <Sidebar />
          <div className="col-span-4 flex">
            <Separator orientation="vertical" />
            <div className=" h-full w-full">
              <div className="flex h-[800px] align-middle text-2xl font-semibold">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
