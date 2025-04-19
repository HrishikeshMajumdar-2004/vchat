"use client";

import { Call, CallRecording } from "@stream-io/video-react-sdk";
// Importing the Call and CallRecording components from Stream Video SDK for managing calls and recordings.

import Loader from "./Loader";

import { useGetCalls } from "@/hooks/useGetCalls";
// Importing a custom hook that fetches the list of calls.

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import MeetingCard from "./MeetingCard";
// Importing the MeetingCard component to display individual call details.

const CallList = ({ type }: { type: "ended" | "upcoming" | "recordings" }) => {
  // Defining a component that takes a "type" prop to determine which type of calls to display (ended, upcoming, or recordings).

  const router = useRouter();
  // Using the router to navigate to different pages when a meeting card is clicked.

  const { endedCalls, upcomingCalls, callRecordings, isLoading } =
    useGetCalls();
  // Using the custom hook to get data about ended calls, upcoming calls, recordings, and loading state.

  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  // Defining a state variable to store the list of recordings separately.

  const getCalls = () => {
    // Function to return the appropriate list of calls based on the "type" prop.
    switch (type) {
      case "ended":
        return endedCalls;
      // Return the list of ended calls if the type is 'ended'.
      case "recordings":
        return recordings;
      // Return the list of recordings if the type is 'recordings'.
      case "upcoming":
        return upcomingCalls;
      // Return the list of upcoming calls if the type is 'upcoming'.
      default:
        return [];
      // Return an empty array by default if no valid type is provided.
    }
  };

  const getNoCallsMessage = () => {
    // Function to return the appropriate message when no calls are found.
    switch (type) {
      case "ended":
        return "No Previous Calls";
      // Message to display if there are no ended calls.
      case "upcoming":
        return "No Upcoming Calls";
      // Message to display if there are no upcoming calls.
      case "recordings":
        return "No Recordings";
      // Message to display if there are no recordings.
      default:
        return "";
      // Return an empty string if no valid type is provided.
    }
  };

  useEffect(() => {
    // useEffect hook to fetch recordings when the type is 'recordings'.
    const fetchRecordings = async () => {
      const callData = await Promise.all(
        callRecordings?.map((meeting) => meeting.queryRecordings()) ?? []
        // Query the recordings for each meeting, ensuring that the callRecordings is not null or undefined.
      );

      const recordings = callData
        .filter((call) => call.recordings.length > 0)
        // Filter out calls with no recordings.
        .flatMap((call) => call.recordings);
      // Flatten the list of recordings from multiple calls into a single array.

      setRecordings(recordings);
      // Update the state with the list of recordings.
    };

    if (type === "recordings") {
      fetchRecordings();
      // Only fetch recordings if the type is 'recordings'.
    }
  }, [type, callRecordings]);
  // Re-run the effect whenever the "type" or "callRecordings" changes.

  if (isLoading) return <Loader />;
  // If the data is still loading, render the Loader component.

  const calls = getCalls();
  // Get the appropriate list of calls based on the "type" prop.

  const noCallsMessage = getNoCallsMessage();
  // Get the message to display when there are no calls.

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {/* Creating a grid layout to display the list of calls. */}

      {calls && calls.length > 0 ? (
        // Check if there are calls to display.
        calls.map((meeting: Call | CallRecording) => (
          // Iterate through the list of calls (either Call or CallRecording).
          <MeetingCard
            key={(meeting as Call).id}
            // Set the key of each MeetingCard to the call's ID.
            icon={
              type === "ended"
                ? "/icons/previous.svg"
                : // Show the 'previous' icon if the type is 'ended'.
                type === "upcoming"
                ? "/icons/upcoming.svg"
                : // Show the 'upcoming' icon if the type is 'upcoming'.
                  "/icons/recordings.svg"
              // Show the 'recordings' icon if the type is 'recordings'.
            }
            title={
              (meeting as Call).state?.custom?.description ||
              (meeting as CallRecording).filename?.substring(0, 20) ||
              "No Description"
              // Display the meeting description, file name (truncated), or 'No Description' if unavailable.
            }
            date={
              (meeting as Call).state?.startsAt?.toLocaleString() ||
              (meeting as CallRecording).start_time?.toLocaleString()
              // Display the meeting start date (formatted as a locale string).
            }
            isPreviousMeeting={type === "ended"}
            // Set whether this is a previous meeting based on the 'ended' type.
            link={
              type === "recordings"
                ? (meeting as CallRecording).url
                : // For recordings, use the URL of the recording.
                  `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${
                    (meeting as Call).id
                  }`
              // For other types, use the meeting's URL.
            }
            buttonIcon1={type === "recordings" ? "/icons/play.svg" : undefined}
            // Display the 'play' button icon if the type is 'recordings'.
            buttonText={type === "recordings" ? "Play" : "Start"}
            // Set the button text to 'Play' for recordings and 'Start' for other types.
            handleClick={
              type === "recordings"
                ? () => router.push(`${(meeting as CallRecording).url}`)
                : () => router.push(`/meeting/${(meeting as Call).id}`)
              // Navigate to the meeting or recording URL when the button is clicked.
            }
          />
        ))
      ) : (
        <h1 className="text-2xl font-bold text-white">{noCallsMessage}</h1>
        // If no calls are found, display the 'no calls' message.
      )}
    </div>
  );
};

export default CallList;
