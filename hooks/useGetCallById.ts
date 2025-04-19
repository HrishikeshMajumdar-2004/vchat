import { useEffect, useState } from "react";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
// Call is the type that represents a call object in Stream Video.
// useStreamVideoClient is a custom hook provided by Stream to interact with their video client.

// useGetCallById is the custom hook function.
// The hook accepts an id as a parameter. The type string | string[] means that id can either be a single string or an array of strings.
export const useGetCallById = (id: string | string[]) => {
  const [call, setCall] = useState<Call>();
  //call is a state variable that will hold the data of the call fetched from the Stream API. Initially, it is undefined.
  const [isCallLoading, setIsCallLoading] = useState(true);
  //isCallLoading is a state variable that tracks whether the call is being loaded or not. Initially, it is set to true because the call data is being fetched.
  const client = useStreamVideoClient();
  //This client is needed to interact with the Stream Video API, specifically for querying calls, streaming, and other video-related functionality.

  useEffect(() => {
    if (!client) return;

    const loadCall = async () => {
      try {
        // https://getstream.io/video/docs/react/guides/querying-calls/#filters
        const { calls } = await client.queryCalls({
          filter_conditions: { id },
        });
        //loadCall is an asynchronous function that queries the Stream API for calls matching the provided id using client.queryCalls with a filter_conditions object and returns the matching calls.

        if (calls.length > 0) setCall(calls[0]);
        //If there is at least one call (calls.length > 0), it updates the call state with the first call (calls[0]).

        setIsCallLoading(false);
        //Once the data is fetched (whether the call is found or not), it updates the isCallLoading state to false, indicating that the loading process is finished and the component can display the actual content.
      } catch (error) {
        console.error(error);
        setIsCallLoading(false);
      }
    };

    loadCall();
  }, [client, id]);
  //The useEffect hook will run every time the client or id changes (these are dependencies for this effect).
  // Inside the effect, it calls the loadCall function to fetch the call data.

  return { call, isCallLoading };
};
