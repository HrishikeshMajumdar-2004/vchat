'use client'; // Indicates that this component is client-side only (not SSR)

import React from "react"; // React library for creating components
import Image from "next/image"; // Image component from Next.js for optimized image loading
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; // Provides visually hidden content for accessibility
import {
  Sheet, // Component that provides a sheet-style UI (a sliding panel)
  SheetClose, // Close button for the sheet
  SheetContent, // Content area of the sheet
  SheetHeader, // Header section of the sheet
  SheetTitle, // Title section within the sheet
  SheetTrigger, // Trigger element to open the sheet (e.g., hamburger icon)
} from "@/components/ui/sheet"; // Importing custom components for the UI
import Link from "next/link"; // Next.js link component for client-side navigation
import { sidebarLinks } from "@/constants"; // Array of objects containing the sidebar links data
import { usePathname } from "next/navigation"; // Hook to get the current path of the page
import { cn } from "@/lib/utils"; // Utility function to combine class names conditionally

const MobileNav = () => {
  const pathname = usePathname();

  return (
    <div>
      <section className="w-full max-w-[264px]">
        <Sheet>
          <SheetTrigger asChild>
            <Image
              src="/icons/hamburger.svg"
              width={36}
              height={36}
              alt="hamburger icon"
              className="cursor-pointer sm:hidden"
            />
          </SheetTrigger>
          <SheetContent side="left" className="border-none bg-dark-1">
            <SheetHeader>
              <SheetTitle>
                <VisuallyHidden>My Accessible Sheet</VisuallyHidden>
              </SheetTitle>
            </SheetHeader>
            <Link href="/" className="flex items-center gap-1">
              <Image
                src="/icons/logo.jpg"
                width={32}
                height={32}
                alt="VChat logo"
              />
              <p className="text-[26px] font-extrabold text-white">VChat</p>
            </Link>
            <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
            {/* Without asChild: Radix UI components will render their own wrapper around the child element, affecting the structure and styling.
            With asChild: You are telling the Radix component to use your child element as-is, applying the component’s behavior without wrapping it. */}
              <SheetClose asChild>
                <section className=" flex h-full flex-col gap-6 pt-16 text-white">
                  {sidebarLinks.map((item) => {
                    const isActive = pathname === item.route;

                    return (
                      <SheetClose asChild key={item.route}>
                        <Link
                          href={item.route}
                          key={item.label}
                          className={cn(
                            "flex gap-4 items-center p-4 rounded-lg w-full max-w-60",
                            {
                              "bg-blue-1": isActive,
                            }
                          )}
                        >
                          <Image
                            src={item.imgURL}
                            alt={item.label}
                            width={20}
                            height={20}
                          />
                          <p className="font-semibold">{item.label}</p>
                        </Link>
                      </SheetClose>
                    );
                  })}
                </section>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </section>
    </div>
  );
};

export default MobileNav;
