type ArrowIconProps = {
  direction?: "up" | "up-right";
};

export function ArrowIcon({ direction = "up-right" }: ArrowIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{ display: "block", flexShrink: 0 }}
    >
      <path
        d="M12 19V5M5 12l7-7 7 7"
        transform={direction === "up-right" ? "rotate(45 12 12)" : undefined}
      />
    </svg>
  );
}
