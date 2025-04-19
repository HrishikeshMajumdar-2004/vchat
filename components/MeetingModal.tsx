import React, { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

// Define props for the MeetingModal component
interface MeetingModalProps {
  isOpen: boolean; // Controls whether the modal is open
  onClose: () => void; // Function to close the modal
  title: string; // Title text displayed in the modal
  className?: string; // Optional extra class for styling the title
  children?: ReactNode; // Optional child components inside the modal
  handleClick?: () => void; // Function executed when the button is clicked
  buttonText?: string; // Optional text for the button
  instantMeeting?: boolean; // Not used in this component, but part of props
  image?: string; // Optional image displayed in the modal
  buttonClassName?: string; // Optional custom class for button styling
  buttonIcon?: string; // Optional icon displayed in the button
}

const MeetingModal = ({
  isOpen,
  onClose,
  title,
  className,
  buttonText,
  handleClick,
  children,
  image,
  buttonIcon,
}: MeetingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex w-full max-w-[520px] flex-col gap-6 border-none bg-dark-1 px-6 py-9 text-white">
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          {image && (
            <div className="flex justify-center">
              <Image src={image} alt="checked" width={72} height={72} />
            </div>
          )}
          <h1 className={cn("text-3xl font-bold leading-[42px]", className)}>
            {title}
          </h1>
          {children}
          <Button
            className={
              "bg-green-1 focus-visible:ring-0 focus-visible:ring-offset-0"
            }
            onClick={handleClick}
          >
            {buttonIcon && (
              <Image
                src={buttonIcon}
                alt="button icon"
                width={13}
                height={13}
              />
            )}{" "}
            &nbsp;
            {buttonText || "Schedule Meeting"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingModal;
