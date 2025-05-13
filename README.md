The project is a full-featured video conferencing web application designed to provide a smooth and interactive real-time communication experience. It allows users to instantly create meetings, join meetings via invitation links, schedule future meetings with custom descriptions and times, and view past recordings. The application features a responsive and user-friendly interface built with reusable components and custom modals for a seamless experience. It uses a video SDK to handle real-time video calls, integrates a date-time picker for scheduling, and includes feedback mechanisms like toasts for user notifications.

Languages & Frameworks: JavaScript / TypeScript , ReactJS , Next.js

Styling & UI: Tailwind CSS , shadcn/ui

Video Functionality: Stream Video React SDK (for real-time video conferencing)

Authentication: Clerk (for user authentication and management)

**Home Page**

The Home page displays the current time and full date at the top using Indian locale formatting. Below that, it provides four key options: New Meeting, Join Meeting, Schedule Meeting, and View Recordings, each leading to a specific workflow. On the top right, the user’s profile avatar is shown, allowing access to account-related actions like sign out or viewing details.
![Screenshot 2025-05-11 223421](https://github.com/user-attachments/assets/a180d55d-258b-4532-86be-7756f3501885)

**New Meeting - Start an Instant Meeting**
The New Meeting functionality allows users to start an instant video call with a single click. When the user selects "New Meeting," a unique meeting ID is generated, and they are immediately redirected to a dedicated meeting room.Before entering the meeting room, a modal appears prompting the user to confirm starting the instant meeting. Inside the room, real-time video and audio streams are established , enabling seamless communication with others who join using the same meeting link. 

https://github.com/user-attachments/assets/df9c8c1d-cf9e-4e68-ad70-6d8e3ad476a4

**Schedule Meeting**
When you choose to schedule a meeting, a meeting modal pops up asking you to add a short note about the meeting and pick a date and time. After you fill in the details and create the meeting, another meeting modal shows up telling you the meeting is ready. It also gives you a button to copy the meeting link, so you can easily share it with others.

**Join Meeting**
When a user wants to join a meeting using a link, a popup appears asking them to type the link. After entering it and clicking "Join Meeting," the app checks if the link is valid. If it's missing "https\://", the app adds it. Then it checks if the link contains "/meeting/"—if not, it shows an error. If everything looks good, the app takes the user to the meeting page using the link they entered.



https://github.com/user-attachments/assets/036392e2-807f-4c9d-b5ca-b8850ac53a71

In the video above, a user schedules a meeting and copies the generated meeting link to their clipboard. The user then joins the meeting by selecting the "Join meeting via invitation link" option and pasting the copied link.
As the meeting host, the user can share this same link with others. Invitees can join the meeting by pasting the shared link into the "Join meeting via invitation link" field, allowing them to connect directly to the session.



**Upcoming Page**
On the Upcoming page, the app shows a list of meetings that are scheduled but haven't happened yet. It first checks if the meetings are still loading—if yes, it shows a loading screen. Once loaded, it displays each upcoming meeting with details like the title, date, and a “Start” button. If there are no upcoming meetings, it shows a message saying "No Upcoming Calls". When the user clicks on a meeting card, they are taken to the meeting page to join or view it.

**Previous Page**
When the user navigates to the "Previous" tab, the CallList component is rendered with the type="ended" prop. This triggers the custom hook useGetCalls() to fetch all ended (past) calls for the logged-in user. Once fetched, the ended calls are passed to the MeetingCard component, which displays each meeting’s time, title (if any). If no past meetings exist, a “No Previous Calls” message is shown.
![Screenshot 2025-05-11 231012](https://github.com/user-attachments/assets/3385b2f2-3694-495c-bf73-9baf9aabeb2f)

**Recordings Page**
It asks each past meeting if it has any recordings saved. Then it collects all the recordings and saves them to show on the page. If there are recordings, each one is shown as a card with details like the title, time, and a play button. If no recordings are found, a message is shown instead.
