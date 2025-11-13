'use client';

import { Instagram, MessageCircle } from 'lucide-react';
import { contactInfo } from '@/config/contact';

interface SocialLinksProps {
  instagramUrl?: string;
  wechatId?: string;
  whatsappNumber?: string;
  carInfo?: string;
}

export default function SocialLinks({
  instagramUrl = contactInfo.instagramUrl,
  wechatId = contactInfo.wechatId,
  whatsappNumber = contactInfo.whatsappNumber,
  carInfo,
}: SocialLinksProps) {
  const whatsappMessage = carInfo
    ? `Hello, I'm interested in: ${carInfo}`
    : 'Hello, I would like to inquire about your cars.';

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  
  // Handle Instagram URL - if it's just a username, add the full URL
  const getInstagramUrl = () => {
    if (!instagramUrl) return '';
    if (instagramUrl.startsWith('http')) return instagramUrl;
    if (instagramUrl.startsWith('@')) return `https://instagram.com/${instagramUrl.slice(1)}`;
    return `https://instagram.com/${instagramUrl}`;
  };

  return (
    <div className="space-y-3">
      {instagramUrl && (
        <a
          href={getInstagramUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
        >
          <Instagram size={22} />
          <span className="font-medium">Instagram</span>
        </a>
      )}

      {wechatId && (
        <div className="flex items-center gap-3 px-5 py-3 bg-green-500 text-white rounded-xl">
          <MessageCircle size={22} />
          <span className="font-medium">WeChat: {wechatId}</span>
        </div>
      )}

      {whatsappNumber && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-5 py-3 bg-green-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
        >
          <MessageCircle size={22} />
          <span className="font-medium">WhatsApp</span>
        </a>
      )}
    </div>
  );
}

