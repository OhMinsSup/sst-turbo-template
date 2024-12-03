import React, { useState } from "react";
import { useNavigation } from "@remix-run/react";

import { Button } from "@template/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@template/ui/components/dialog";

import { Icons } from "~/components/icons";

export interface SidebarFormComponentProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formId: string;
}

export interface SidebarAddItemDialogProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  formId: string;
  children: (props: SidebarFormComponentProps) => React.ReactNode;
}

export default function SidebarAddItemDialog({
  title,
  description,
  formId,
  children,
}: SidebarAddItemDialogProps) {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();

  const isSubmittingForm = navigation.state === "submitting";

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <Icons.Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        {children({ setOpen, formId })}
        <DialogFooter>
          <Button
            disabled={isSubmittingForm}
            aria-disabled={isSubmittingForm}
            type="submit"
            form={formId}
          >
            {isSubmittingForm ? (
              <Icons.Spinner className="mr-2 size-4 animate-spin" />
            ) : null}
            등록
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
