import { useState } from "react";
import { Link } from "react-router";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

// Components
import Avatar from "react-avatar";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

// Custom modules
import { getUsername, getErrorMessage } from "@/lib/utils";
import { aksharApi } from "@/api";

// Assets
import {
  TrashIcon,
  SquareArrowOutUpRightIcon,
  Loader2Icon,
} from "lucide-react";

// Types
import type { AxiosError } from "axios";
import type { User, Blog, ErrorResponse } from "@/types";

type Props = {
  commentId?: string;
  content: string;
  user: User | null;
  blog: Blog;
  createdAt: string;
  currentUserId?: string;
  currentUserRole?: "user" | "admin";
  onDeleteSuccess?: () => void;
};

export const CommentCard = ({
  commentId,
  content,
  user,
  blog,
  createdAt,
  currentUserId,
  currentUserRole,
  onDeleteSuccess,
}: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const canDelete =
    !!commentId &&
    !!currentUserId &&
    (currentUserId === user?._id || currentUserRole === "admin");

  const handleDelete = async () => {
    if (!commentId || !canDelete || isDeleting) {
      return;
    }

    try {
      setIsDeleting(true);

      await aksharApi.delete(`/comments/${commentId}`);

      toast.success("Comment deleted");

      onDeleteSuccess?.();
    } catch (err) {
      toast.error("Failed to delete comment", {
        description: getErrorMessage(
          (err as AxiosError<ErrorResponse>).response?.data,
        ),
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="@container">
      <div className="group flex flex-col items-start gap-4 p-4 rounded-xl hover:bg-accent/25 @md:flex-row">
        {user ? (
          <Link
            to={`/profile/${user._id}`}
            viewTransition
            aria-label={`Profile of ${user.username}`}
          >
            <Avatar
              name={getUsername(user)}
              email={user.email}
              src={user.avatar || undefined}
              size="40"
              round
            />
          </Link>
        ) : (
          <Avatar
            name="Deleted User"
            size="40"
            round
          />
        )}

        <div className="flex flex-col gap-2 me-auto">
          <div className="flex items-center gap-2">
            {user ? (
              <Link
                to={`/profile/${user._id}`}
                viewTransition
                className="text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                @{user.username}
              </Link>
            ) : (
              <div className="text-sm text-destructive/80 italic">
                <Tooltip delayDuration={250}>
                  <TooltipTrigger>Account deleted</TooltipTrigger>

                  <TooltipContent>
                    This account has been removed
                  </TooltipContent>
                </Tooltip>
              </div>
            )}

            <div className="size-1 rounded-full bg-muted-foreground/50" />

            <div className="text-sm text-muted-foreground">
              <Tooltip delayDuration={250}>
                <TooltipTrigger>
                  {formatDistanceToNow(createdAt, {
                    addSuffix: true,
                  })}
                </TooltipTrigger>

                <TooltipContent>
                  {new Date(createdAt).toLocaleString("en-US", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="max-w-[60ch]">{content}</div>

          {canDelete && (
            <div className="flex items-center gap-2 mt-1">
              <Button
                variant="ghost"
                aria-label="Remove comment"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <TrashIcon />
                )}

                {isDeleting ? "Removing..." : "Remove"}
              </Button>
            </div>
          )}
        </div>

        {blog && (
          <>
            <div className="max-w-80 grid grid-cols-[120px_minmax(200px,1fr)] gap-3 @max-3xl:hidden">
              <AspectRatio
                ratio={21 / 9}
                className="rounded-lg overflow-hidden"
              >
                <img
                  src={blog.banner.url}
                  width={blog.banner.width}
                  height={blog.banner.height}
                  alt={blog.title}
                />
              </AspectRatio>

              <div className="line-clamp-3 max-w-[30ch] text-sm text-muted-foreground my-1">
                {blog.title}
              </div>
            </div>

            <Button
              variant="ghost"
              className="@3xl:invisible @xl:group-hover:visible @xl:group-focus-within:visible"
              asChild
            >
              <Link
                to={`/blogs/${blog.slug}`}
                viewTransition
              >
                <span className="@md:hidden">Go to blog</span>

                <SquareArrowOutUpRightIcon />
              </Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};