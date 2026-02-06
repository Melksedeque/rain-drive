import { ImageResponse } from "next/og";

export const runtime = "edge";

export function generateImageMetadata() {
  return [
    {
      contentType: "image/png",
      size: { width: 16, height: 16 },
      id: "16",
    },
    {
      contentType: "image/png",
      size: { width: 32, height: 32 },
      id: "32",
    },
    {
      contentType: "image/png",
      size: { width: 48, height: 48 },
      id: "48",
    },
    {
      contentType: "image/png",
      size: { width: 192, height: 192 },
      id: "192",
    },
  ];
}

export default function Icon({ id }: { id: string }) {
  const size = parseInt(id) || 32;
  const iconSize = Math.floor(size * 0.625);
  const borderRadius = Math.floor(size * 0.25);
  const strokeWidth = Math.max(1.5, size / 16);

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: size,
          background: "#0ea5e9", // sky-500
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: `${borderRadius}px`,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
          <path d="M16 14v6" />
          <path d="M8 14v6" />
          <path d="M12 16v6" />
        </svg>
      </div>
    ),
    {
      width: size,
      height: size,
    }
  );
}
