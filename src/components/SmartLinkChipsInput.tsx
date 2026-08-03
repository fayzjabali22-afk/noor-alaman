import React, { useState } from 'react';
import { Video, Link as LinkIcon, Trash2, Plus, AlertCircle } from 'lucide-react';

// SocialLink Data Structure
export interface SocialLink {
  id: string;
  url: string;
  platform: 'youtube' | 'tiktok' | 'instagram' | 'x' | 'facebook' | 'vimeo' | 'generic';
  label: string;
  badgeColor: string;
  borderColor: string;
}

interface SmartLinkChipsInputProps {
  links: SocialLink[];
  onChange: (links: SocialLink[]) => void;
  isAr?: boolean;
}

export const SmartLinkChipsInput: React.FC<SmartLinkChipsInputProps> = ({
  links,
  onChange,
  isAr = true,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Automatic Platform Detection via URL Regex Pattern
  const detectPlatform = (url: string): Omit<SocialLink, 'id' | 'url'> => {
    const cleanUrl = url.trim().toLowerCase();

    if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
      return {
        platform: 'youtube',
        label: 'YouTube',
        badgeColor: 'bg-red-500/10 text-red-400 border-red-500/30',
        borderColor: 'border-red-500',
      };
    }
    if (cleanUrl.includes('tiktok.com')) {
      return {
        platform: 'tiktok',
        label: 'TikTok',
        badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
        borderColor: 'border-cyan-400',
      };
    }
    if (cleanUrl.includes('instagram.com')) {
      return {
        platform: 'instagram',
        label: 'Instagram',
        badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
        borderColor: 'border-pink-500',
      };
    }
    if (cleanUrl.includes('twitter.com') || cleanUrl.includes('x.com')) {
      return {
        platform: 'x',
        label: 'X (Twitter)',
        badgeColor: 'bg-slate-400/10 text-slate-200 border-slate-500/30',
        borderColor: 'border-slate-300',
      };
    }
    if (cleanUrl.includes('facebook.com') || cleanUrl.includes('fb.watch')) {
      return {
        platform: 'facebook',
        label: 'Facebook',
        badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        borderColor: 'border-blue-500',
      };
    }
    if (cleanUrl.includes('vimeo.com')) {
      return {
        platform: 'vimeo',
        label: 'Vimeo',
        badgeColor: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
        borderColor: 'border-teal-400',
      };
    }

    return {
      platform: 'generic',
      label: isAr ? 'رابط فيديو' : 'Video Link',
      badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      borderColor: 'border-amber-400',
    };
  };

  // Add Link Handler (Auto-Paste & Enter Trigger)
  const handleAddLink = (rawUrl: string) => {
    const trimmed = rawUrl.trim();
    if (!trimmed) return;

    // Validate URL Syntax
    const isValidUrl = /^(https?:\/\/)?([\w.-]+)+[\w\-_~:/?#[\]@!$&'()*+,;=.]+/i.test(trimmed);
    if (!isValidUrl) {
      setErrorMsg(
        isAr
          ? 'يرجى إدخال رابط فيديو صحيح (مثل: https://...)'
          : 'Please enter a valid video URL (e.g. https://...)'
      );
      return;
    }

    // Duplicate Check
    if (links.some((link) => link.url.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMsg(isAr ? 'هذا الرابط تم إضافته بالفعل' : 'This link has already been added');
      return;
    }

    const platformInfo = detectPlatform(trimmed);
    const newLink: SocialLink = {
      id: `link-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      url: trimmed.startsWith('http') ? trimmed : `https://${trimmed}`,
      ...platformInfo,
    };

    onChange([...links, newLink]);
    setInputValue('');
    setErrorMsg(null);
  };

  // Remove Link Handler
  const handleRemoveLink = (id: string) => {
    onChange(links.filter((link) => link.id !== id));
  };

  return (
    <div className="w-full space-y-3">
      {/* Title & Count Badge */}
      <div className="flex justify-between items-center text-xs md:text-sm font-medium text-slate-200">
        <label htmlFor="smart-link-input" className="flex items-center gap-2">
          <Video className="w-4 h-4 text-amber-400" />
          <span>{isAr ? 'روابط المقطع الداعم (المُدخل الذكي)' : 'Endorsement Video Links'}</span>
          <span className="text-amber-400 font-bold">*</span>
        </label>
        {links.length > 0 && (
          <span className="text-xs text-amber-400/90 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30 font-bold">
            {isAr
              ? `تم إضافة ${links.length} ${links.length === 1 ? 'رابط' : 'روابط'}`
              : `${links.length} link(s) added`}
          </span>
        )}
      </div>

      {/* Unified Smart Input Field */}
      <div className="relative flex items-center">
        <div className="absolute right-3.5 text-slate-400 pointer-events-none">
          <LinkIcon className="w-4 h-4 text-slate-500" />
        </div>

        <input
          id="smart-link-input"
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (errorMsg) setErrorMsg(null);
          }}
          onPaste={(e) => {
            const pastedText = e.clipboardData.getData('text');
            setTimeout(() => handleAddLink(pastedText), 50);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddLink(inputValue);
            }
          }}
          placeholder={
            isAr
              ? 'ألصق رابط الفيديو هنا (YouTube, TikTok, Instagram, X, Facebook...)'
              : 'Paste video link here (YouTube, TikTok, Instagram, X, Facebook...)'
          }
          className="w-full pr-11 pl-20 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-xs md:text-sm focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-all text-right"
          dir="ltr"
        />

        {/* Action Button */}
        <button
          type="button"
          onClick={() => handleAddLink(inputValue)}
          disabled={!inputValue.trim()}
          className="absolute left-2 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-xs font-semibold rounded-lg border border-amber-500/30 transition-all disabled:opacity-0 disabled:pointer-events-none flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAr ? 'إضافة' : 'Add'}</span>
        </button>
      </div>

      {/* Lightweight Error Banner */}
      {errorMsg && (
        <p className="text-xs text-rose-400 font-medium flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </p>
      )}

      {/* Smart Link Chips Display Area */}
      {links.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {links.map((link) => (
            <div
              key={link.id}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${link.badgeColor} backdrop-blur-sm transition-all hover:scale-[1.02]`}
            >
              <span className="font-bold uppercase tracking-wider text-[11px]">{link.label}</span>
              <span className="text-slate-400 max-w-[160px] truncate dir-ltr font-mono text-[11px]" dir="ltr">
                {link.url.replace(/^https?:\/\/(www\.)?/, '')}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveLink(link.id)}
                className="mr-1 text-slate-400 hover:text-rose-400 p-0.5 rounded-full hover:bg-rose-500/10 transition-colors cursor-pointer"
                title={isAr ? 'حذف الرابط' : 'Remove Link'}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Informational Guidance Text */}
      <p className="text-[11px] text-slate-400 font-normal">
        {isAr
          ? '* [الأمر السيادي رقم 55.44] يمكنك إضافة أكثر من رابط لنفس المقطع على منصات مختلفة، وسيتعرف النظام عليها آلياً.'
          : '* [Sovereign Directive 55.44] You can add multiple links for the video across platforms; the system recognizes them automatically.'}
      </p>
    </div>
  );
};
