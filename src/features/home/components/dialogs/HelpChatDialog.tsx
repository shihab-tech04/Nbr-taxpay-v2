import React, { useState, type FormEvent } from 'react';
import { BookOpen, MessageCircle, PhoneCall, Send } from 'lucide-react';
import { AppButton, AppIconButton } from '../../../../design-system/buttons';
import { AppTextField } from '../../../../design-system/forms';
import type { HomeCopy } from '../../model/home.types';
import { matchHelpAnswer } from '../../model/routeContract';
import { HomeDialogShell } from './HomeDialogShell';

interface ChatMessage {
  id: number;
  from: 'user' | 'assistant';
  text: string;
}

export function HelpChatDialog({
  open,
  onClose,
  c,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  c: HomeCopy;
  onNavigate: (path: string) => void;
}) {
  const [question, setQuestion] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const selectedTopic = c.dialogs.helpTopics.find((topic) => topic.id === selectedTopicId);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;
    const answer = matchHelpAnswer(trimmed, c.dialogs.helpTopics, c.dialogs.helpFallbackAnswer);
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, from: 'user', text: trimmed },
      { id: prev.length + 2, from: 'assistant', text: answer },
    ]);
    setQuestion('');
  };

  return (
    <HomeDialogShell
      open={open}
      onClose={onClose}
      titleId="home2-help-dialog-title"
      title={
        <>
          <MessageCircle className="size-5 text-[#1c3d70]" aria-hidden="true" />
          <span>{c.dialogs.helpTitle}</span>
        </>
      }
      closeLabel={c.dialogs.close}
    >
      <p className="mb-3 text-[13px] font-medium text-[#5d697e]">{c.dialogs.helpSubtitle}</p>

      <div
        role="log"
        aria-live="polite"
        className="max-h-56 space-y-2.5 overflow-y-auto rounded-xl border border-[#dfe5ee] bg-[#f8fafd] p-3.5"
      >
        <p className="rounded-lg bg-white px-3 py-2 text-[13px] text-[#0f1d34] ring-1 ring-[#dfe5ee]">
          {c.dialogs.helpOpening}
        </p>

        {selectedTopic && (
          <div
            data-testid="guide-topic-answer"
            className="rounded-lg bg-[#e6edf8] px-3 py-2.5 text-[13px] text-[#0f1d34]"
          >
            <strong className="block text-[12px] font-bold text-[#1c3d70]">
              {selectedTopic.title}
            </strong>
            <p className="mt-0.5 leading-relaxed">{selectedTopic.answer}</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <p
              className={`max-w-[85%] rounded-lg px-3 py-2 text-[13px] ${
                msg.from === 'user'
                  ? 'bg-[#2f55a4] text-white'
                  : 'bg-white text-[#0f1d34] ring-1 ring-[#dfe5ee]'
              }`}
            >
              {msg.text}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {c.dialogs.helpTopics.map((topic) => (
          <AppButton
            key={topic.id}
            tone={selectedTopicId === topic.id ? 'homeSoft' : 'homeOutlined'}
            size="small"
            onClick={() => setSelectedTopicId(topic.id)}
          >
            {topic.title}
          </AppButton>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-3 flex items-center gap-2" noValidate>
        <AppTextField
          allowPublicLookup
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={c.dialogs.helpQuestionPlaceholder}
          aria-label={c.dialogs.helpQuestionPlaceholder}
          slotProps={{
            htmlInput: {
              maxLength: 250,
            },
          }}
        />
        <AppIconButton
          type="submit"
          tone="homeSubmit"
          aria-label={c.dialogs.helpSendLabel}
          disabled={!question.trim()}
        >
          <Send className="size-4" aria-hidden="true" />
        </AppIconButton>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#dfe5ee] pt-3">
        <AppButton
          tone="ghost"
          size="small"
          startIcon={<BookOpen className="size-4" aria-hidden="true" />}
          onClick={() => {
            onClose();
            onNavigate(
              selectedTopicId
                ? `/support?contract=user_guide&category=${encodeURIComponent(selectedTopicId)}`
                : '/support?contract=user_guide'
            );
          }}
        >
          {c.dialogs.helpOpenGuide}
        </AppButton>
        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#1c3d70]">
          <PhoneCall className="size-3.5" aria-hidden="true" />
          {c.dialogs.helplineLabel}
        </span>
      </div>
      <p className="mt-2 text-[11.5px] text-[#5d697e]">{c.dialogs.helpDisclaimer}</p>
    </HomeDialogShell>
  );
}
