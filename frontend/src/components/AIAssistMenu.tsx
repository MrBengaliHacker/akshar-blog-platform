import { useState } from 'react';
import { useCurrentEditor } from '@tiptap/react';
import { toast } from 'sonner';

// Custom modules
import { aksharApi } from '@/api';
import { getErrorMessage } from '@/lib/utils';

// Components
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

// Assets
import { SparklesIcon, Loader2Icon } from 'lucide-react';

// Types
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@/types';

type AiAction =
  | 'improve'
  | 'expand'
  | 'tone_formal'
  | 'tone_casual'
  | 'continue'
  | 'summarize'
  | 'title'
  | 'fullBlog'
  | 'freePrompt';

type AiUsage = { used: number; limit: number; remaining: number };

// The server sends the usage also with the "daily limit reached" error
type AiErrorResponse = ErrorResponse & { usage?: AiUsage };

// Must match the limit in the backend route
const MAX_PROMPT_LENGTH = 10000;

const REWRITE_ACTIONS: { action: AiAction; label: string }[] = [
  { action: 'improve', label: 'Improve writing' },
  { action: 'expand', label: 'Expand' },
  { action: 'tone_formal', label: 'Make it formal' },
  { action: 'tone_casual', label: 'Make it casual' },
];

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Plain text -> paragraphs for the editor
const toHtml = (text: string) =>
  text
    .trim()
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`)
    .join('');

// The AI sometimes wraps HTML in a code fence
const cleanHtml = (text: string) =>
  text.replace(/^```(?:html)?\s*/i, '').replace(/\s*```$/, '').trim();

export const AIAssistMenu = () => {
  const { editor } = useCurrentEditor();

  const [usage, setUsage] = useState<AiUsage | null>(null);
  const [loading, setLoading] = useState(false);
  const [askAction, setAskAction] = useState<'fullBlog' | 'freePrompt' | null>(null);
  const [askText, setAskText] = useState('');
  const [result, setResult] = useState<{ title: string; text: string } | null>(null);

  if (!editor) return null;

  const outOfUses = usage?.remaining === 0;

  // Load how many AI requests are left, when the menu opens
  const loadUsage = (open: boolean) => {
    if (!open) return;

    aksharApi
      .get('/ai/usage')
      .then(({ data }) => setUsage(data.usage))
      .catch(() => {});
  };

  // Sends one request. Returns the text, or null when it failed.
  const callAi = async (action: AiAction, prompt: string) => {
    if (prompt.length > MAX_PROMPT_LENGTH) {
      toast.error(
        `The text is too long (max ${MAX_PROMPT_LENGTH} characters). Select a smaller part.`,
      );
      return null;
    }

    setLoading(true);
    editor.setEditable(false); // nobody types while we wait for the answer

    try {
      const { data } = await aksharApi.post('/ai/assist', { action, prompt });

      setUsage(data.usage);

      const text = String(data.text ?? '').trim();

      if (!text) {
        toast.error('The AI gave an empty answer. Please try again.');
        return null;
      }

      return text;
    } catch (err) {
      const errorData = (err as AxiosError<AiErrorResponse>).response?.data;

      if (errorData?.usage) setUsage(errorData.usage);

      toast.error(getErrorMessage(errorData));
      return null;
    } finally {
      editor.setEditable(true);
      setLoading(false);
    }
  };

  // Improve, expand, change tone: replaces the selected text
  const handleRewrite = async (action: AiAction) => {
    const { from, to, empty } = editor.state.selection;

    if (empty) {
      toast.error('Select the text you want to change first');
      return;
    }

    const selected = editor.state.doc.textBetween(from, to, '\n');
    const text = await callAi(action, selected);

    if (!text) return;

    if (/\n\s*\n/.test(text)) {
      // Several paragraphs: insert them as blocks
      editor.chain().focus().insertContentAt({ from, to }, toHtml(text)).run();
    } else {
      // One paragraph: plain text inside the sentence (no new paragraph,
      // and nothing from the AI answer is read as HTML)
      const plain = text.replace(/\s*\n\s*/g, ' ');

      editor
        .chain()
        .focus()
        .command(({ tr }) => {
          tr.insertText(plain, from, to);
          return true;
        })
        .run();
    }
  };

  // Continue writing, summary, title ideas: uses the whole post
  const handleWholePost = async (action: 'continue' | 'summarize' | 'title') => {
    const content = editor.getText().trim();

    if (!content) {
      toast.error('Write something first');
      return;
    }

    const text = await callAi(action, content);

    if (!text) return;

    if (action === 'continue') {
      editor.chain().focus('end').insertContent(toHtml(text)).run();
    } else {
      setResult({
        title: action === 'title' ? 'Title ideas' : 'Summary',
        text,
      });
    }
  };

  // Write a full blog, or ask the AI anything
  const handleAsk = async () => {
    const prompt = askText.trim();

    if (!askAction || !prompt) return;

    const text = await callAi(askAction, prompt);

    if (!text) return; // keep the dialog open, so the text is not lost

    editor
      .chain()
      .focus('end')
      .insertContent(askAction === 'fullBlog' ? cleanHtml(text) : toHtml(text))
      .run();

    setAskAction(null);
    setAskText('');
  };

  return (
    <>
      <DropdownMenu onOpenChange={loadUsage}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={loading}
            className="ms-auto"
          >
            {loading ? <Loader2Icon className="animate-spin" /> : <SparklesIcon />}
            AI
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-60"
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-muted-foreground">
              {usage
                ? `${usage.remaining} of ${usage.limit} AI requests left today`
                : 'AI assistant'}
            </DropdownMenuLabel>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-muted-foreground">
              Selected text
            </DropdownMenuLabel>

            {REWRITE_ACTIONS.map(({ action, label }) => (
              <DropdownMenuItem
                key={action}
                disabled={outOfUses}
                onSelect={() => handleRewrite(action)}
              >
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-muted-foreground">
              Whole post
            </DropdownMenuLabel>

            <DropdownMenuItem
              disabled={outOfUses}
              onSelect={() => handleWholePost('continue')}
            >
              Continue writing
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={outOfUses}
              onSelect={() => handleWholePost('summarize')}
            >
              Summarize
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={outOfUses}
              onSelect={() => handleWholePost('title')}
            >
              Suggest titles
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem
              disabled={outOfUses}
              onSelect={() => setAskAction('fullBlog')}
            >
              Write a full blog from a topic
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={outOfUses}
              onSelect={() => setAskAction('freePrompt')}
            >
              Ask AI anything
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Topic or question */}
      <Dialog
        open={askAction !== null}
        onOpenChange={(open) => {
          if (!open && !loading) setAskAction(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {askAction === 'fullBlog' ? 'Write a full blog' : 'Ask AI anything'}
            </DialogTitle>

            <DialogDescription>
              {askAction === 'fullBlog'
                ? 'Write the topic. The blog is added at the end of your post.'
                : 'Write what you need. The answer is added at the end of your post.'}
            </DialogDescription>
          </DialogHeader>

          <Textarea
            value={askText}
            onChange={(event) => setAskText(event.target.value)}
            placeholder={
              askAction === 'fullBlog'
                ? 'For example: 5 habits that make studying easier'
                : 'For example: Give me an idea for the opening line'
            }
            maxLength={MAX_PROMPT_LENGTH}
            rows={4}
          />

          <DialogFooter>
            <Button
              variant="outline"
              disabled={loading}
              onClick={() => setAskAction(null)}
            >
              Cancel
            </Button>

            <Button
              disabled={loading || !askText.trim()}
              onClick={handleAsk}
            >
              {loading && <Loader2Icon className="animate-spin" />}
              {loading ? 'Writing' : 'Generate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Summary and title ideas */}
      <Dialog
        open={result !== null}
        onOpenChange={(open) => {
          if (!open) setResult(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{result?.title}</DialogTitle>
          </DialogHeader>

          <p className="whitespace-pre-wrap text-sm">{result?.text}</p>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setResult(null)}
            >
              Close
            </Button>

            <Button
              onClick={() => {
                navigator.clipboard
                  .writeText(result?.text ?? '')
                  .then(() => toast.success('Copied'))
                  .catch(() => toast.error('Could not copy'));
              }}
            >
              Copy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};