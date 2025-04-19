// The StreamVideoProvider is responsible for:

// Initializing and configuring the video client with necessary authentication and user details.
// Providing the video client context to the rest of the app.
// Handling authentication token management.
// Abstracting away the complex setup logic from individual components.

'use client'; 

import { tokenProvider } from "@/actions/stream.actions"; 
// Importing the token provider for Stream API to authenticate the video client.

import Loader from "@/components/Loader"; 
// Importing the Loader component to show a loading spinner while the video client is being initialized.

import { useUser } from "@clerk/nextjs"; 
// Importing the `useUser` hook from Clerk to access user data (like user ID, username, etc.).

import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-sdk"; 
// Importing necessary components and hooks from the Stream Video SDK for video functionality.

import { ReactNode, useEffect, useState } from "react"; 
// Importing React hooks and types for managing state, side effects, and typing children elements.

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY; 
// Retrieving the Stream API key from the environment variables to use with the Stream SDK.

const StreamVideoProvider = ({ children }: { children: ReactNode }) => { 
  // Defining a functional component that wraps children components and provides video functionality.

  const [videoClient, setVideoClient] = useState<StreamVideoClient>(); 
  // Initializing state to store the video client instance once it's created.

  const { user, isLoaded } = useUser(); 
  // Using the `useUser` hook from Clerk to access the current authenticated user's data and load state.

  useEffect(() => { 
    // Using `useEffect` to run the client initialization logic when the user and authentication state are loaded.

    if (!isLoaded || !user) return; 
    // If the user data isn't loaded or the user is not available, do nothing.

    if (!apiKey) throw new Error("Stream API key is missing"); 
    // If the Stream API key is missing, throw an error.

    const client = new StreamVideoClient({ 
      // Creating a new instance of `StreamVideoClient` using the API key and user details.
      apiKey: apiKey, 
      user: {
        id: user?.id, // Setting the user ID from Clerk.
        name: user?.username || user?.id, // Setting the username (or fallback to user ID).
        image: user?.imageUrl, // Setting the user image if available.
      },
      tokenProvider, // Providing the token provider for authentication.
    });

    setVideoClient(client); 
    // Setting the `videoClient` state with the newly created client.

  }, [user, isLoaded]); 
  // Dependency array ensures that the effect runs when either `user` or `isLoaded` changes.

  if (!videoClient) return <Loader />; 
  // If the video client is not yet initialized, return the `Loader` component.

  return <StreamVideo client={videoClient}>{children}</StreamVideo>; 
  // Wrap the children components with the `StreamVideo` component, passing the video client as a prop.
};

export default StreamVideoProvider; 
// Exporting the `StreamVideoProvider` component for use in other parts of the app.
