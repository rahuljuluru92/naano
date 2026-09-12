// Renders a pasted image URL if one exists, otherwise a deterministic
// initials/color-block avatar -- the fallback DESIGN_SYSTEM.md already
// specifies in place of real photography. Plain <img>, not next/image:
// pasted URLs are arbitrary external domains, which next/image requires
// allow-listing per-domain for -- exactly the friction Phase 2 is skipping.

const PALETTE = ["#3B63F2", "#17181C", "#75777F", "#0EA5E9", "#7C3AED", "#059669"];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function colorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

type InitialsAvatarProps = {
  name: string;
  imageUrl?: string | null;
  size?: number;
};

export default function InitialsAvatar({ name, imageUrl, size = 48 }: InitialsAvatarProps) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={name}
        className="shrink-0 rounded-full border border-border object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{ width: size, height: size, backgroundColor: colorForName(name), fontSize: size * 0.4 }}
    >
      {getInitials(name)}
    </div>
  );
}
