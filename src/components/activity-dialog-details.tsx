import { FakeNewsDetails } from "@/app/(admin)/admin/atividades/_components/fake-news-details";
import { PostOrNotDetails } from "@/app/(admin)/admin/atividades/_components/post-or-not-details";
import { TFakeNewsContent, TPostOrNotContent } from "@/utils/activity-types";
import { activityType } from "@/utils/enums";
import { Activity } from "@prisma/client";
import { Eye } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Separator } from "./ui/separator";

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
        {activity.type === "POST_OR_NOT" && (
          <PostOrNotDetails
            postOrNot={activity.content as unknown as TPostOrNotContent}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
