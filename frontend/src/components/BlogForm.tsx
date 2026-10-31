import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

// Custom hooks
import { useCategories } from '@/hooks/useCategories';

// Components
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Tiptap } from '@/components/Tiptap';

// Assets
import { GalleryThumbnailsIcon, XIcon } from 'lucide-react';

// Types
type BlogFormData = {
  banner_image?: Blob;
  title: string;
  content: string;
  category: string;
};

type BlogStatus = 'draft' | 'published';

type FormDefaultValue = {
  bannerUrl: string;
  title: string;
  content: string;
  category: string;
  status: BlogStatus;
};

type BlogFormProps = {
  defaultValue?: FormDefaultValue;
  onSubmit: (formData: BlogFormData, status: BlogStatus) => void;
};

export const BlogForm: React.FC<BlogFormProps> = ({
  defaultValue,
  onSubmit,
}) => {
  const categories = useCategories();

  const [data, setData] = useState<BlogFormData>({
    title: defaultValue?.title || '',
    content: defaultValue?.content || '',
    category: defaultValue?.category || '',
  });

  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<
    string | undefined
  >(defaultValue?.bannerUrl);

  const status = defaultValue?.status || 'draft';

  const hasBanner = useMemo(
    () => Boolean(bannerPreviewUrl),
    [bannerPreviewUrl],
  );

  const submit = (status: BlogStatus) => {
    if (!bannerPreviewUrl) {
      toast.error('Please add a cover image');
      return;
    }

    if (!data.title.trim()) {
      toast.error('Please add a title');
      return;
    }

    if (!data.category) {
      toast.error('Please choose a topic');
      return;
    }

    onSubmit(
      {
        banner_image: data.banner_image,
        title: data.title,
        content: data.content,
        category: data.category,
      },
      status,
    );
  };

  return (
    <div className="relative space-y-5">
      <div className="relative min-h-9 isolate">
        {!hasBanner && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="absolute top-0.5 left-0.5 overflow-hidden"
                asChild
              >
                <Label>
                  <GalleryThumbnailsIcon />
                  Add a cover...
                  <Input
                    type="file"
                    accept=".jpg, .jpeg, .png, .webp"
                    name="banner_image"
                    className="sr-only"
                    onChange={(event) => {
                      if (!event.target.files) return;

                      setData((prevData) => ({
                        ...prevData,
                        banner_image: event.target.files?.[0],
                      }));

                      setBannerPreviewUrl(
                        URL.createObjectURL(event.target.files?.[0]),
                      );
                    }}
                  />
                </Label>
              </Button>
            </TooltipTrigger>

            <TooltipContent side="right">
              Maximum banner size 2MB <br /> Format should be JPG, PNG, or WEBP
            </TooltipContent>
          </Tooltip>
        )}

        {hasBanner && (
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 left-2 z-30"
            aria-label="Remove banner image"
            onClick={() => {
              setData((prevData) => ({
                ...prevData,
                banner_image: undefined,
              }));
              setBannerPreviewUrl(undefined);
            }}
          >
            <XIcon />
          </Button>
        )}

        <AnimatePresence>
          {hasBanner && (
            <motion.figure
              className="rounded-xl overflow-hidden border"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 240 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                type: 'spring',
                visualDuration: 0.25,
                bounce: 0.2,
              }}
            >
              <img
                src={bannerPreviewUrl}
                alt={data.title}
                className="w-full h-full object-cover"
              />
            </motion.figure>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-3">
        <Label
          htmlFor="category"
          className="text-muted-foreground"
        >
          Topic
        </Label>

        <Select
          value={data.category}
          onValueChange={(value) =>
            setData((prevData) => ({ ...prevData, category: value }))
          }
        >
          <SelectTrigger
            id="category"
            className="w-52"
          >
            <SelectValue placeholder="Choose a topic" />
          </SelectTrigger>

          <SelectContent>
            {categories.map(({ slug, name }) => (
              <SelectItem
                key={slug}
                value={slug}
              >
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Textarea
        name="title"
        maxLength={180}
        className="text-4xl! font-semibold tracking-tight border-none ring-0! bg-transparent! px-0 resize-none shadow-none"
        placeholder="New post title here..."
        onChange={(event) =>
          setData((prevData) => ({
            ...prevData,
            title: event.target.value,
          }))
        }
        value={data.title}
      />

      <div className="relative border inset-ring-border rounded-xl">
        <Tiptap
          onUpdate={({ editor }) => {
            setData((prevData) => ({
              ...prevData,
              content: editor.getHTML(),
            }));
          }}
          content={data.content}
        />
      </div>

      <div className="flex justify-end items-center gap-2 sticky bottom-0 py-4 bg-background isolate after:absolute after:bottom-full after:w-full after:h-10 after:bg-linear-to-t after:from-background after:to-transparent after:z-0 after:pointer-events-none">
        <Button
          variant="outline"
          onClick={() => submit('draft')}
        >
          Save as draft
        </Button>

        <Button onClick={() => submit('published')}>
          {status === 'draft' ? 'Publish' : 'Save changes'}
        </Button>
      </div>
    </div>
  );
};