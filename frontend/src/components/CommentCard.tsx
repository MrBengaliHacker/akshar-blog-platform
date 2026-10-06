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
import { getUsername } from "@/lib/utils";
import { aksharApi } from "@/api";

// Assets
import {
  ThumbsUpIcon,
  TrashIcon,
  SquareArrowOutUpRightIcon,
  Loader2Icon,
} from "lucide-react";

// Types
import type { User, Blog } from "@/types";

type Props = {
  commentId?: string;
  content: string;
  likesCount: number;
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
  likesCount,
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

  const token = localStorage.getItem("accessToken");

  if (!token) {
    toast.error("Please log in to delete this comment");
    return;
  }

  try {
    setIsDeleting(true);

    await aksharApi.delete(`/comments/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success("Comment deleted");

    onDeleteSuccess?.();
  } catch (error: any) {
    console.error("Error deleting comment:", error);

    toast.error(
      error?.response?.data?.message || "Failed to delete comment",
    );
  } finally {
    setIsDeleting(false);
  }
};

  return (
    <div className="@container">
      <div className="group flex flex-col items-start gap-4 p-4 rounded-xl hover:bg-accent/25 @md:flex-row">
        <Avatar
          name={user ? getUsername(user) : "Deleted User"}
          email={user?.email}
          size="40"
          round
        />

        <div className="flex flex-col gap-2 me-auto">
          <div className="flex items-center gap-2">
            {user ? (
              <div className="text-sm text-muted-foreground">
                @{user.username}
              </div>
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

          <div className="flex items-center gap-2 mt-1">
            <Button
              variant="ghost"
              aria-label="Like comment"
            >
              <ThumbsUpIcon />

              {likesCount > 0 && (
                <span className="sr-only">
                  Total likes: {likesCount}
                </span>
              )}
            </Button>

            {canDelete && (
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
            )}
          </div>
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