'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
}

interface VideoSectionProps {
  videos?: Video[];
}

export default function VideoSection({ videos = [] }: VideoSectionProps) {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  // Default video if none provided
  const defaultVideos: Video[] = videos.length > 0 ? videos : [
    {
      id: '1',
      title: 'Who We Are – About VAAM Motors',
      description: 'Learn about our company, our mission, and why customers trust us for their vehicle needs.',
      thumbnailUrl: '/images/placeholder-video.jpg',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Replace with actual video URL
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Who We Are – About VAAM Motors
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our story and commitment to excellence
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {defaultVideos.map((video) => (
            <div key={video.id} className="relative group">
              {playingVideo === video.id ? (
                <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
                  <iframe
                    src={video.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <button
                    onClick={() => setPlayingVideo(null)}
                    className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div
                  className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => setPlayingVideo(video.id)}
                >
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                    <div className="bg-red-600 rounded-full p-6 group-hover:scale-110 transition-transform">
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{video.title}</h3>
                    <p className="text-gray-200 text-sm">{video.description}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

