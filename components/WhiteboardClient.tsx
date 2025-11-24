"use client";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

export function WhiteboardClient({ roomId }: { roomId: string }) {
  return (
    <div className="w-full h-full">
      <Tldraw persistenceKey={roomId} />
    </div>
  );
}
