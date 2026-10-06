import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

// Custom modules
import { aksharApi } from '@/api';

// Components
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CommentCard } from '@/components/CommentCard';
import { Separator } from '@/components/ui/separator';

// Custom hooks
import { useUser } from '@/hooks/useUser';

// Assets
import { Loader2Icon } from 'lucide-react';

// Types
import type { Comment } from '@/types';

type CommentSectionProps = {
  blogId: string;
  commentsCount: number;
};

export const CommentSection = ({ blogId, commentsCount: initialCommentsCount }: CommentSectionProps) => {
  const user = useUser();

  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [count, setCount] = useState(initialCommentsCount);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await aksharApi.get(`/comments/blog/${blogId}`);
      setComments(data.comments);
    } catch (err) {
      toast.error('Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  }, [blogId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = useCallback(async () => {
    if (!user) {
      toast.error('Please login to comment');
      return;
    }

    const trimmed = newComment.trim();
    if (!trimmed) return;

    const accessToken = localStorage.getItem('accessToken');
    setIsSubmitting(true);

    try {
      const { data } = await aksharApi.post(
        `/comments/blog/${blogId}`,
        { content: trimmed },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      setComments((prev) => [data.comment, ...prev]);
      setCount((prev) => prev + 1);
      setNewComment('');
      toast.success('Comment added');
    } catch (err) {
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  }, [blogId, newComment, user]);

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-semibold'>
        Comments {count > 0 && <span className='text-muted-foreground'>({count})</span>}
      </h2>

      {user ? (
        <div className='space-y-2'>
          <Textarea
            placeholder='Share your thoughts...'
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
            maxLength={1000}
            rows={3}
          />
          <div className='flex justify-end'>
            <Button onClick={handleSubmit} disabled={isSubmitting || !newComment.trim()}>
              {isSubmitting && <Loader2Icon className='animate-spin' />}
              Post comment
            </Button>
          </div>
        </div>
      ) : (
        <p className='text-muted-foreground text-sm'>
          Please login to join the conversation.
        </p>
      )}

      <Separator />

      {isLoading ? (
        <p className='text-muted-foreground text-sm'>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className='text-muted-foreground text-sm'>No comments yet. Be the first to comment!</p>
      ) : (
        <div>
          {comments.map((comment, index) => (
            <div key={comment._id}>
              <CommentCard
                commentId={comment._id}
                content={comment.content}
                likesCount={comment.likesCount}
                user={comment.userId}
                blog={comment.blogId}
                createdAt={comment.createdAt}
                currentUserId={user?._id}
                currentUserRole={user?.role}
                onDeleteSuccess={() => {
                  setComments((prev) =>
                    prev.filter((item) => item._id !== comment._id)
                  );

                  setCount((prev) => Math.max(0, prev - 1));
                }}
              />
              {index < comments.length - 1 && <Separator className='my-1' />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};