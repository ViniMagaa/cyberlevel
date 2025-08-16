import { Activity } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Eye } from "lucide-react";
import { Separator } from "./ui/separator";
import { activityType } from "@/utils/enums";
import { FakeNewsDetails } from "@/app/(admin)/admin/atividades/_components/fake-news-details";
import { TFakeNewsContent } from "@/utils/activity-schemas";

type ActivityDialogDetailsProps = {
  activity: Activity;
};

export function ActivityDialogDetails({
  activity,
}: ActivityDialogDetailsProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-neutral-700!">
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-7xl">
        <DialogHeader>
          <DialogTitle>{activity.title}</DialogTitle>
          <DialogDescription>{activityType[activity.type]}</DialogDescription>
        </DialogHeader>
        <Separator />
        {activity.type === "FAKE_NEWS" && (
          <FakeNewsDetails
            fakeNews={activity.content as unknown as TFakeNewsContent}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
