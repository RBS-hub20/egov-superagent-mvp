import Image from "next/image";
import { ICON } from "@/lib/brand";

/**
 * The app icon: the navy "SA" tile, corners already cut to transparency so it
 * sits on the white landing and the near-black console without a notch.
 *
 * It carries no wordmark. Anywhere the product needs to be named, pair it with
 * `<BrandLockup>` rather than reaching for a lockup image — one asset, one
 * source of truth, and the text stays selectable and translatable.
 */
export function AppIcon({
  size = 32,
  priority = false,
  className = "",
}: {
  size?: number;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={ICON}
      alt=""
      aria-hidden
      // Twice the layout size so the tile stays sharp on retina.
      width={size * 2}
      height={size * 2}
      priority={priority}
      sizes={`${size}px`}
      className={`select-none ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
