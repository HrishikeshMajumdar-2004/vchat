"use client";

import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
// Importing necessary hooks from the Stream SDK to access the call and participant state.

import { Button } from "./ui/button";

import { useRouter } from "next/navigation";
// Importing the `useRouter` hook from Next.js to navigate after the call ends.

const EndCallButton = () => {
  const call = useCall();
  // Using the `useCall` hook to access the current call instance.

  const router = useRouter();
  // Initializing the router for redirecting to a different page after the call ends.

  if (!call)
    throw new Error(
      "useStreamCall must be used within a StreamCall component."
    );
  // If the call instance is not available (e.g., not within a StreamCall component), throw an error.

  const { useLocalParticipant } = useCallStateHooks();
  // Destructuring the `useLocalParticipant` hook from `useCallStateHooks` to get the local participant.

  const localParticipant = useLocalParticipant();
  // Using `useLocalParticipant` to retrieve the local participant's data.

  const isMeetingOwner =
    localParticipant &&
    call.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;
  // Checking if the local participant is the owner of the meeting based on userId and createdBy.

  if (!isMeetingOwner) return null;
  // If the local participant is not the owner, return `null`, meaning the button won't be rendered.

  const endCall = async () => {
    // Defining an asynchronous function that ends the call and redirects the user.
    await call.endCall();
    // Ending the call by calling the `endCall` method on the `call` instance.

    router.push("/");
    // After the call ends, navigate the user to the homepage (`/`).
  };

  return (
    <Button onClick={endCall} className="bg-red-500">
      End call for everyone
    </Button>
  );
};

export default EndCallButton;
