import { AppIcon } from "./app-icon";
import { PRODUCT } from "@/lib/brand";

/**
 * Icon plus wordmark, side by side — the only lockup in the product.
 *
 * The wordmark is live text, so it inherits the theme instead of needing a
 * light and a dark export, and a screen reader gets the product name once:
 * the tile is decorative, the words carry it.
 */
export function BrandLockup({
  size = 30,
  priority = false,
  className = "",
  textClassName = "text-lp-ink dark:text-lp-dark-text",
  showText = true,
}: {
  size?: number;
  priority?: boolean;
  className?: string;
  textClassName?: string;
  showText?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <AppIcon size={size} priority={priority} />
      {showText ? (
        <span
          className={`font-bold tracking-tight ${textClassName}`}
          // Scales with the tile so every placement keeps the same proportion.
          style={{ fontSize: Math.round(size * 0.52) }}
        >
          eGov <span className="text-lp-primary">SuperAgent</span>
        </span>
      ) : (
        <span className="sr-only">{PRODUCT}</span>
      )}
    </span>
  );
}
