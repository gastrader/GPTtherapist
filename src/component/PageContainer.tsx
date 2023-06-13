import { type ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
};
export const PageContainer = ({ children }: PageContainerProps) => (
  <div className="flex-grow space-y-6 p-10 pb-16">{children}</div>
);
