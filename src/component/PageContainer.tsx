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
  <div className="flex-grow">
    <div className="space-y-0.5 px-5 py-3">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <p className="pb-2 text-muted-foreground">{description}</p>
    </div>
    {children}
  </div>
);
