"use client";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

export function WhiteboardClient({ roomId }: { roomId: string }) {
  return (
    <div className="h-full w-full">
      <Tldraw persistenceKey={roomId} />
    </div>
  );
}
