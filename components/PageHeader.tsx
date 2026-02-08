import { PropsWithChildren } from "react";

type PageHeaderProps = PropsWithChildren<{
  title: string;
  desc?: string;
}>;

export default function PageHeader({ title, desc, children }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="text-foreground/50">{desc}</div>
      </div>
      {children}
    </div>
  );
}
