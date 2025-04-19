'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import HomeCard from './HomeCard';
import MeetingModal from './MeetingModal';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';
import Loader from './Loader';
import { Textarea } from './ui/textarea';
import ReactDatePicker from 'react-datepicker';
import { toast } from "sonner"
import { Input } from './ui/input';

// Initial values for form inputs
const initialValues = {
  dateTime: new Date(),
  description: '',
  link: '',
};

// Component for showing four meeting-related actions using cards and modals.
const MeetingTypeList = () => {
  const router = useRouter();

  // Tracks which type of modal is open (schedule, join, or instant meeting)
  const [meetingState, setMeetingState] = useState<
    'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined
  >(undefined);

  // Stores input values for scheduling or joining meetings
  const [values, setValues] = useState(initialValues);

  // Stores details of the created meeting call
  const [callDetail, setCallDetail] = useState<Call>();

  // Access Stream Video SDK client
  const client = useStreamVideoClient();

  // Access authenticated user info from Clerk
  const { user } = useUser();

  // Function to create a new meeting using Stream SDK
  const createMeeting = async () => {
    if (!client || !user) return;
    try {
      // Ensure date and time is selected
      if (!values.dateTime) {
        toast('Please select a date and time');
        return;
      }

      const id = crypto.randomUUID(); // Generate a unique meeting ID
      const call = client.call('default', id); // Create a call of type 'default'
      if (!call) throw new Error('Failed to create meeting');

      // Format meeting start time and description
      const startsAt = values.dateTime.toISOString();
      const description = values.description || 'Instant Meeting';

      // Create or get the call on the backend
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });

      setCallDetail(call); // Store the call details

      // If it's an instant meeting (no description), navigate to meeting page
      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }

      toast('Meeting Created'); // Show success message
    } catch (error) {
      console.error(error);
      toast('Failed to create Meeting'); // Show error message
    }
  };

  // Show loading spinner while SDK or user data is loading
  if (!client || !user) return <Loader />;

  // Construct meeting link using base URL and call ID
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetail?.id}`;

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {/* HomeCard for starting an instant meeting */}
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        className="bg-green-2"
        description="Start an instant meeting"
        handleClick={() => setMeetingState('isInstantMeeting')}
      />

      {/* HomeCard for joining an existing meeting */}
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="via invitation link"
        className="bg-orange-1"
        handleClick={() => setMeetingState('isJoiningMeeting')}
      />

      {/* HomeCard for scheduling a new meeting */}
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        className="bg-purple-1"
        handleClick={() => setMeetingState('isScheduleMeeting')}
      />

      {/* HomeCard for navigating to recordings page */}
      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Meeting Recordings"
        className="bg-yellow-1"
        handleClick={() => router.push('/recordings')}
      />

      {/* Modal for scheduling a meeting (before creation) */}
      {!callDetail ? (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Create Meeting"
          handleClick={createMeeting}
        >
          {/* Description input */}
          <div className="flex flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">
              Add a description
            </label>
            <Textarea
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>

          {/* Date and time picker */}
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">
              Select Date and Time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded bg-dark-3 p-2 focus:outline-none"
            />
          </div>
        </MeetingModal>
      ) : (
        // Modal shown after meeting is scheduled (to copy link)
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Meeting Created"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast('Link Copied');
          }}
          image={'/icons/checked.png'}
          buttonIcon="/icons/copy.svg"
          className="text-center"
          buttonText="Copy Meeting Link"
        />
      )}

      {/* Modal for joining a meeting by link */}
      <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Type the link here"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={() => {
          if (!values.link.trim()) {
            toast("Please enter a meeting link");
            return;
          }
        
          try {
            const url = new URL(values.link.startsWith("http") ? values.link : `${process.env.NEXT_PUBLIC_BASE_URL}/${values.link}`);
            if (!url.pathname.startsWith("/meeting/")) {
              toast("Invalid meeting link");
              return;
            }
            router.push(url.pathname);
          } catch {
            toast("Invalid URL format");
          }
        }}
      >
        <Input
          placeholder="Meeting link"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </MeetingModal>

      {/* Modal for starting an instant meeting */}
      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
    </section>
  );
};

export default MeetingTypeList;
