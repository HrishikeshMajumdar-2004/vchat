'use client'; // This directive is used to indicate that this file should be treated as a client-side component in Next.js.

import Image from 'next/image'; // Importing the Image component from Next.js to optimize image loading.
import Link from 'next/link'; // Importing the Link component from Next.js for client-side navigation.
import { usePathname } from 'next/navigation'; // Importing the `usePathname` hook from Next.js to access the current pathname.

import { sidebarLinks } from '@/constants'; // Importing a constant containing the sidebar links, assumed to be an array of objects with route, label, and imgURL properties.
import { cn } from '@/lib/utils'; // Importing a utility function to handle className management conditionally (likely combines class names).

const Sidebar = () => {
  const pathname = usePathname(); // Using the `usePathname` hook to get the current URL path.

  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col  justify-between  bg-dark-1 p-6 pt-28 text-white max-sm:hidden lg:w-[264px]">
      {/* The section element represents the sidebar layout, which is sticky and stays visible on the screen during scrolling.
          `max-sm:hidden` hides the sidebar on small screens, and `lg:w-[264px]` defines a fixed width for large screens. */}

      <div className="flex flex-1 flex-col gap-6">
        {/* The container that holds the sidebar links, arranged vertically with gaps between them. */}
        {sidebarLinks.map((item) => {
          // Iterating through the sidebarLinks array to render each link in the sidebar.
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
          // Checking if the current route matches the link's route or if the current path is a sub-route of the link.

          return (
            <Link
              href={item.route} // Setting the href attribute to the route defined in `sidebarLinks`.
              key={item.label} // Using the item's label as a unique key for the list item.
              className={cn(
                'flex gap-4 items-center p-4 rounded-lg justify-start', // Default classes for layout: flexbox for positioning, padding, rounded corners.
                {
                  'bg-green-1': isActive, // Conditionally adding the background color if the link is active (matches the current path).
                }
              )}
            >
              {/* This Link component from Next.js allows client-side navigation without full page reloads. */}
              <Image
                src={item.imgURL} // The image source is dynamically set based on the link's image URL.
                alt={item.label} 
                width={24} 
                height={24} 
              />
              <p className="text-lg font-semibold max-lg:hidden">
                {/* The label for the link, styled with larger font size and bold text. It is hidden on smaller screens (`max-lg:hidden`). */}
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Sidebar; 
