import { useEffect, useState } from 'react'; 

import { useUser } from '@clerk/nextjs'; 
// Importing the `useUser` hook from Clerk to get the current user's data.

import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'; 
// Importing `Call` and `useStreamVideoClient` from Stream Video SDK to interact with video calls.

export const useGetCalls = () => { 
  // Custom hook to fetch and manage the user's calls (both ended and upcoming).

  const { user } = useUser(); 
  // Getting the current user's data using Clerk's `useUser` hook.

  const client = useStreamVideoClient(); 
  // Getting the Stream Video client using `useStreamVideoClient` to interact with Stream Video SDK.

  const [calls, setCalls] = useState<Call[]>(); 
  // State variable to store the list of calls fetched from Stream Video.

  const [isLoading, setIsLoading] = useState(false); 
  // State variable to track whether the data is still loading.

  useEffect(() => { 
    // useEffect hook to run the function when `client` or `user?.id` changes (indicating a potential update in user state or the Stream client).

    const loadCalls = async () => { 
      // Asynchronous function to load the calls.

      if (!client || !user?.id) return; 
      // If there's no valid client or user ID, exit early, as no data can be fetched.

      setIsLoading(true); 
      // Set loading state to true before starting to fetch data.

      try {
        // Query the Stream Video API for the user's calls, sorting them by the start date in descending order and applying filters.
        const { calls } = await client.queryCalls({
          sort: [{ field: 'starts_at', direction: -1 }], 
          // Sorting calls by the 'starts_at' field in descending order (most recent first).
          filter_conditions: { 
            starts_at: { $exists: true }, 
            // Ensure the 'starts_at' field exists for the call.
            $or: [ 
              { created_by_user_id: user.id }, 
              // Filter for calls where the user is the creator.
              { members: { $in: [user.id] } }, 
              // Filter for calls where the user is a member.
            ],
          },
        });

        setCalls(calls); 
        // Update the state with the list of calls fetched from the query.

      } catch (error) {
        console.error(error); 
        // Log any errors that occur during the fetch process.
      } finally {
        setIsLoading(false); 
        // Once the data is fetched (or an error occurs), set loading state to false.
      }
    };

    loadCalls(); 
    // Calling the `loadCalls` function to fetch the data.

  }, [client, user?.id]); 
  // Dependencies of `useEffect`. It will re-run whenever `client` or `user?.id` changes.

  const now = new Date(); 
  // Get the current date and time for filtering calls.

  const endedCalls = calls?.filter(({ state: { startsAt, endedAt } }: Call) => { 
    // Filtering the calls to get those that have ended or started in the past.
    return (startsAt && new Date(startsAt) < now) || !!endedAt; 
    // Check if the call has started in the past or if it has already ended.
  });

  const upcomingCalls = calls?.filter(({ state: { startsAt } }: Call) => { 
    // Filtering the calls to get those that are upcoming.
    return startsAt && new Date(startsAt) > now; 
    // Only return calls that are scheduled to start in the future.
  });

  return { endedCalls, upcomingCalls, callRecordings: calls, isLoading }; 
  // Return the filtered lists of ended and upcoming calls, all calls as `callRecordings`, and the loading state.
};
