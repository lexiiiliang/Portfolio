export function Callout({ type, title, children }: {
  type?: string;
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="callout">
      {type ? <span className="callout-tag">{type}</span> : null}
      {title ? <strong className="callout-title">{title}</strong> : null}
      <div className="callout-body">{children}</div>
    </div>
  );
}
