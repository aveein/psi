"use client";

type Props = {
  title: string;
  sub?: string;
  actions?: React.ReactNode;
};

export function PageTop({ title, sub, actions }: Props) {
  return (
    <div className="ptop">
      <div className="ptop-l">
        <div>
          <div className="ptop-title">{title}</div>
          {sub && <div className="ptop-sub">{sub}</div>}
        </div>
      </div>
      {actions && <div className="ptop-r">{actions}</div>}
    </div>
  );
}
