export function Localized({ en, zh }: { en: React.ReactNode; zh: React.ReactNode }) {
  return (
    <>
      <span className="copy-en">{en}</span>
      <span className="copy-zh">{zh}</span>
    </>
  );
}
