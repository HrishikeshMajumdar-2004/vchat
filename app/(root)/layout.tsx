import StreamVideoProvider from "@/providers/StreamClientProvider";
import React, { ReactNode } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      {/* When you wrap your app with the StreamVideoProvider, you can access the video client and its context anywhere in the app. For instance, child components like MeetingRoom, MeetingSetup can all access the StreamVideoClient without needing to manage the client themselves. They simply render the StreamVideo component to access video-related functionality. */}
      <StreamVideoProvider>{children}</StreamVideoProvider>
      Footer
    </main>
  );
};

export default RootLayout;
