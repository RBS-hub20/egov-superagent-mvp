"use client";

import Image from "next/image";
import { useTheme } from "@/components/theme/theme-provider";
import { LOGOS } from "@/lib/brand";
import { PRODUCT } from "@/lib/brand";

/**
 * Console lockup.
 *
 * Light uses the same full-colour artwork as the landing hero. Dark swaps to
 * the white lockup: the wordmark's "eGov" half is brand navy and would sink
 * into the #101A33 sidebar.
 */
export function ConsoleLogo({ width = 140 }: { width?: number }) {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const src = dark ? LOGOS.white : "/logo.png";
  // Intrinsic ratios of the two exported assets.
  const ratio = dark ? 640 / 360 : 1200 / 592;

  return (
    <Image
      src={src}
      alt={PRODUCT}
      width={width * 2}
      height={Math.round((width / ratio) * 2)}
      priority
      sizes={`${width}px`}
      className="h-auto select-none"
      style={{ width, maxWidth: "100%" }}
    />
  );
}
