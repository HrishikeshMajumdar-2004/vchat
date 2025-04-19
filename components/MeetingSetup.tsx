'use client'; 
// Indicates that this is a client-side React component, meaning it should only run in the browser.

import { useEffect, useState } from 'react'; 
// Importing React hooks (useEffect and useState) for state management and side effects handling. 
// These are used to track changes in state and run side effects in the component.

import {
  DeviceSettings,
  VideoPreview,
  useCall,
  useCallStateHooks,
} from '@stream-io/video-react-sdk'; 
// Importing components and hooks from the Stream Video SDK to handle video call functionality, such as device settings (microphone/camera), preview of the video, and managing call state.

import { Button } from './ui/button'; 
// Importing a custom Button component from the UI library for consistent styling across the app.

import Alert from './Alert'; 
// Importing a custom Alert component to notify users of important call-related information, like whether the call has started, ended, or other status messages.

const MeetingSetup = ({ setIsSetupComplete }: { setIsSetupComplete: (value: boolean) => void; }) => { 
  // Defines the MeetingSetup component, receiving setIsSetupComplete to notify the parent component when the user has completed the setup process and is ready to join the meeting.

  const { useCallEndedAt, useCallStartsAt } = useCallStateHooks(); 
  // Destructures the hooks for fetching the start and end times of the call from the Stream SDK. 
  // This is needed to determine whether the call has started or ended.

  const callStartsAt = useCallStartsAt(); 
  // Retrieves the scheduled start time of the meeting from the call state hooks, which is used to check if the meeting is upcoming.

  const callEndedAt = useCallEndedAt(); 
  // Retrieves the actual end time of the meeting from the call state hooks. 

  const callTimeNotArrived = callStartsAt && new Date(callStartsAt) > new Date(); 
  // Checks whether the scheduled start time of the call has arrived yet by comparing the scheduled time with the current time. This prevents users from joining too early.

  const callHasEnded = !!callEndedAt; 
  //!! is used to explicitly convert any value to a boolean representation, ensuring it is either true or false based on whether the value is truthy or falsy.
  // Checks if the call has ended by evaluating whether the call has a valid end time. 

  const call = useCall(); 
  // Uses the useCall hook to get the call object, which gives access to call-related actions (like joining, starting, or ending the call).

  if (!call) { 
    // If no call object exists, it indicates that the useCall hook is being used outside the correct context (StreamCall component), so throw an error to prevent the app from misbehaving.
    throw new Error('useStreamCall must be used within a StreamCall component.'); 
    // Ensures that the component is properly nested within the context of a StreamCall component.
  }

  const [isMicCamToggled, setIsMicCamToggled] = useState(false); 
  // Initializes a state variable isMicCamToggled to keep track of whether the user wants to join the meeting with the microphone and camera off. Default is set to false (camera and mic are on).

  useEffect(() => { 
    // useEffect hook is used to trigger side effects, such as enabling/disabling the microphone and camera, whenever the isMicCamToggled state changes.
    if (isMicCamToggled) { 
      // If the user wants to join with mic and camera off (isMicCamToggled is true), disable both.
      call.camera.disable(); 
      call.microphone.disable(); 
    } else { 
      // If the user wants to use both mic and camera, enable them.
      call.camera.enable(); 
      call.microphone.enable(); 
    }
  }, [isMicCamToggled, call.camera, call.microphone]); 
  // The effect will rerun whenever isMicCamToggled, call.camera, or call.microphone changes, ensuring that the camera and microphone settings are properly updated.

  if (callTimeNotArrived) 
    return ( 
      <Alert 
        title={`Your Meeting has not started yet. It is scheduled for ${callStartsAt.toLocaleString()}`} 
      /> 
    ); 
    // If the meeting is scheduled but hasn't started yet, display an alert to inform the user of the scheduled start time, preventing them from joining prematurely.

  if (callHasEnded) 
    return ( 
      <Alert 
        title="The call has been ended by the host" 
        iconUrl="/icons/call-ended.svg" 
      /> 
    ); 
    // If the call has already ended, show an alert informing the user that the call is no longer active. 
    // This helps prevent confusion or attempts to join an inactive meeting.

  return ( 
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white"> 
      {/* Main wrapper for the meeting setup screen, styled to be vertically and horizontally centered 
      with a full screen height. */}
      <h1 className="text-center text-2xl font-bold">Setup</h1> 
      {/* Heading to notify the user that this screen is for meeting setup. */}
      <VideoPreview /> 
      {/* Displays a live preview of the user's video feed before they join the meeting, 
      allowing them to adjust their video settings beforehand. */}
      <div className="flex h-16 items-center justify-center gap-3"> 
        {/* Wrapper for the checkbox and device settings, ensuring they are vertically centered and spaced out. */}
        <label className="flex items-center justify-center gap-2 font-medium"> 
          {/* Label for the checkbox input that allows the user to toggle mic and camera off. */}
          <input 
            type="checkbox" 
            checked={isMicCamToggled} 
            onChange={(e) => setIsMicCamToggled(e.target.checked)} 
          /> 
          {/* Checkbox input for toggling the microphone and camera off/on. */}
          Join with mic and camera off 
        </label> 
        {/* Label text explaining the checkbox's function, so the user knows what it does. */}
        <DeviceSettings /> 
        {/* Device settings component that allows the user to adjust their microphone and camera settings 
        before joining the call, ensuring they have the right equipment set up. */}
      </div> 
      <Button 
        className="rounded-md bg-green-500 px-4 py-2.5" 
        onClick={() => { 
          call.join(); 
          // Triggers the call.join() function to allow the user to enter the meeting after setup is complete.
          setIsSetupComplete(true); 
          // Notifies the parent component that the setup process has been finished, so the parent can proceed.
        }} 
      > 
        Join meeting 
      </Button> 
      {/* Button to allow the user to join the meeting once they have completed the setup. */}
    </div> 
  ); 
  // Renders the meeting setup screen with options to toggle microphone/camera and join the meeting.
};

export default MeetingSetup; 
// Exports the MeetingSetup component so it can be used elsewhere in the app for rendering.
