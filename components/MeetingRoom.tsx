"use client";

import { useState } from "react";

import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
// Importing components and hooks from the Stream Video SDK to manage video call controls and UI elements.

import { useRouter, useSearchParams } from "next/navigation";
// Importing Next.js hooks: `useRouter` to handle navigation and `useSearchParams` to access query parameters.

import { Users, LayoutList } from "lucide-react";
// Importing icons from the Lucide library for UI elements like user list and layout selector.

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
// Importing UI components for a dropdown menu that lets users choose between different video call layouts.

import Loader from "./Loader";
// Importing a `Loader` component to show a loading spinner while waiting for data or the call to initialize.

import { cn } from "@/lib/utils";
// Importing a utility function to conditionally join class names in the JSX for styling purposes.

import EndCallButton from "./EndCallButton";
// Importing the `EndCallButton` component which provides a button to end the call.

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";
// Defining a custom type that limits the layout options to either 'grid', 'speaker-left', or 'speaker-right'.

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  // Using `useSearchParams` to get the query parameters from the URL (such as ?personal=true).

  const isPersonalRoom = !!searchParams.get("personal");
  // Checking if the query parameter 'personal' exists and converting it to a boolean (true if exists).

  const router = useRouter();
  // Using the `useRouter` hook to programmatically navigate between pages.

  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  // Defining state to store the selected layout, with 'speaker-left' as the default layout.

  const [showParticipants, setShowParticipants] = useState(false);
  // Defining state to control whether the participants list is shown or not (initially hidden).

  const { useCallCallingState } = useCallStateHooks();
  // Destructuring `useCallCallingState` from `useCallStateHooks` to get the current state of the call (e.g., joined, calling).

  const callingState = useCallCallingState();
  // Storing the current call state (such as 'joined', 'calling', etc.) in a variable.

  if (callingState !== CallingState.JOINED) return <Loader />;
  // If the call hasn't been joined yet, display the loader to wait until the call state is 'JOINED'.

  const CallLayout = () => {
    switch (layout) {
      // Switch statement to render different layouts based on the selected layout.

      case "grid":
        return <PaginatedGridLayout />;
      // If 'grid' layout is selected, render the `PaginatedGridLayout` component to show participants in a grid.

      case "speaker-right":
        return <SpeakerLayout participantsBarPosition="left" />;
      // If 'speaker-right' layout is selected, render the `SpeakerLayout` component with the participant bar on the left.

      default:
        return <SpeakerLayout participantsBarPosition="right" />;
      // Default to 'speaker-left' layout, rendering `SpeakerLayout` with the participant bar on the right.
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      {/* Wrapping the video call layout and controls inside a section with some styling for positioning and appearance. */}

      <div className="relative flex size-full items-center justify-center">
        {/* A container for centering the video layout on the screen. */}

        <div className=" flex size-full max-w-[1000px] items-center">
          {/* Setting the maximum width of the video container to 1000px. */}

          <CallLayout />
          {/* Rendering the selected video call layout using the `CallLayout` component. */}
        </div>

        <div
          className={cn("h-[calc(100vh-86px)] hidden ml-2", {
            "show-block": showParticipants,
          })}
        >
          {/* Container for the participants list, initially hidden. The 'show-block' class is added when `showParticipants` is true. */}

          <CallParticipantsList onClose={() => setShowParticipants(false)} />
          {/* Rendering the participants list component, passing a function to close the list when needed. */}
        </div>
      </div>

      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5">
        {/* This div holds the controls and buttons at the bottom of the screen, positioned fixed at the bottom. */}

        <CallControls onLeave={() => router.push(`/`)} />
        {/* Render the call control buttons (like mute, video, and leave), with `onLeave` redirecting to the home page. */}

        <DropdownMenu>
          {/* Dropdown menu wrapper component */}

          <div className="flex items-center">
            {/* Flex container to align dropdown trigger button */}

            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
              <LayoutList size={20} className="text-white" />
              {/* Icon representing layout options, styled white */}
            </DropdownMenuTrigger>
          </div>

          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {["Grid", "Speaker-Left", "Speaker-Right"].map((item, index) => (
              <div key={index}>
                {/* Loop through layout types and render each as a menu item */}

                <DropdownMenuItem
                  onClick={() =>
                    setLayout(item.toLowerCase() as CallLayoutType)
                  }
                >
                  {/* On clicking an item, update the layout state to the selected one
              (converted to lowercase and typed as CallLayoutType)
          */}

                  {item}
                  {/* Display layout option label, e.g., Grid, Speaker-Left */}
                </DropdownMenuItem>

                <DropdownMenuSeparator className="border-dark-1" />
                {/* Visual separator between menu items */}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <CallStatsButton />
        {/* Button to view call statistics, such as quality and performance data. */}

        <button onClick={() => setShowParticipants((prev) => !prev)}>
          {/* Button to toggle the visibility of the participants list. */}

          <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
            <Users size={20} className="text-white" />
            {/* Users icon displayed on the button to indicate participants. */}
          </div>
        </button>

        {!isPersonalRoom && <EndCallButton />}
        {/* If it's not a personal room, render the button to end the call. */}
      </div>
    </section>
  );
};

export default MeetingRoom;
