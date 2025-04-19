"use client";
import Alert from "@/components/Alert";
import Loader from "@/components/Loader";
import MeetingRoom from "@/components/MeetingRoom";
import MeetingSetup from "@/components/MeetingSetup";
import { useGetCallById } from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";

const Meeting = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();

  // State to track if setup is complete
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  // Handle the call ID once it's valid
  const [callId, setCallId] = useState<string | null>(null);

  useEffect(() => {
    // Set the callId only if it's a valid string
    if (typeof id === "string") {
      setCallId(id);
    }
  }, [id]);

  // Always call the useGetCallById hook, even if callId is null
  const { call, isCallLoading } = useGetCallById(callId ?? "");

  // Show loader while the call data is loading
  if (!isLoaded || !callId || isCallLoading) {
    return <Loader />;
  }

  // If no call is found, show the error message
  if (!call) {
    return (
      <p className="text-center text-3xl font-bold text-white">
        Call Not Found
      </p>
    );
  }

  // Check if the current user is not allowed to join the call:
  // - The call type is "invited" (i.e., only invited users can join)
  // - And either there is no authenticated user,
  // - Or the user is not in the list of call members
  const notAllowed =
    call.type === "invited" &&
    (!user || !call.state.members.find((m) => m.user.id === user.id));

  if (notAllowed)
    return <Alert title="You are not allowed to join this meeting" />;

  // Render the meeting setup or room once everything is ready
  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default Meeting;
