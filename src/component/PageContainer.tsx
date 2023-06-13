import { type ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
  title: string;
  description?: string;
};
export const PageContainer = ({
  children,
  title,
  description,
}: PageContainerProps) => (
  <div className="flex-grow space-y-6 p-10 pb-16">
    <div className="space-y-0.5">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <p className="pb-2 text-muted-foreground">{description}</p>
    </div>
    {children}
  </div>
);
