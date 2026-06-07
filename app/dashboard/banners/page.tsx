'use client';

import { useState } from 'react';
import { useReels } from '@/hooks/useReels';
import { useStories } from '@/hooks/useStories';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Heart, MousePointerClick, MessageCircle, Trash2 } from 'lucide-react';
import type { Reel, Story } from '@/types/reels';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
}

function getMediaUrl(path: string | undefined | null) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${cleanPath}`;
}

async function apiDelete(endpoint: string) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'DELETE',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
}

// ─── Confirmation Dialog ─────────────────────────────────────────────────────
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({ open, title, description, isLoading, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ReelsAndStoriesPage() {
  const { reels, isLoading: loadingReels, refresh: refreshReels } = useReels();
  const { stories, isLoading: loadingStories, refresh: refreshStories } = useStories();

  // Comments state
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);

  // Delete reel state
  const [reelToDelete, setReelToDelete] = useState<Reel | null>(null);
  const [deletingReel, setDeletingReel] = useState(false);

  // Delete story state
  const [storyToDelete, setStoryToDelete] = useState<Story | null>(null);
  const [deletingStory, setDeletingStory] = useState(false);

  // Delete comment
  const handleDeleteComment = async (commentId: number) => {
    try {
      await apiDelete(`/api/reel-comments/${commentId}/`);
      refreshReels();
      if (selectedReel) {
        setSelectedReel({
          ...selectedReel,
          comments: selectedReel.comments?.filter(c => c.id !== commentId),
        });
      }
    } catch (e) {
      console.error(e);
      alert('Error deleting comment');
    }
  };

  // Delete reel
  const handleDeleteReel = async () => {
    if (!reelToDelete) return;
    setDeletingReel(true);
    try {
      await apiDelete(`/api/reels/${reelToDelete.id}/`);
      refreshReels();
      setReelToDelete(null);
    } catch (e) {
      console.error(e);
      alert('Error deleting reel');
    } finally {
      setDeletingReel(false);
    }
  };

  // Delete story
  const handleDeleteStory = async () => {
    if (!storyToDelete) return;
    setDeletingStory(true);
    try {
      await apiDelete(`/api/stories/${storyToDelete.id}/`);
      refreshStories();
      setStoryToDelete(null);
    } catch (e) {
      console.error(e);
      alert('Error deleting story');
    } finally {
      setDeletingStory(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reels & Stories</h1>
        <p className="text-muted-foreground">Manage your visual content and engagement.</p>
      </div>

      <Tabs defaultValue="reels" className="w-full">
        <TabsList>
          <TabsTrigger value="reels">Reels ({reels.length})</TabsTrigger>
          <TabsTrigger value="stories">Stories ({stories.length})</TabsTrigger>
        </TabsList>

        {/* ── Reels Tab ── */}
        <TabsContent value="reels" className="mt-6">
          {loadingReels ? (
            <div className="text-muted-foreground py-12 text-center">Loading Reels…</div>
          ) : reels.length === 0 ? (
            <div className="text-muted-foreground py-12 text-center">No reels found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {reels.map((reel) => (
                <ReelCard
                  key={reel.id}
                  reel={reel}
                  onOpenComments={() => setSelectedReel(reel)}
                  onDelete={() => setReelToDelete(reel)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Stories Tab ── */}
        <TabsContent value="stories" className="mt-6">
          {loadingStories ? (
            <div className="text-muted-foreground py-12 text-center">Loading Stories…</div>
          ) : stories.length === 0 ? (
            <div className="text-muted-foreground py-12 text-center">No stories found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {stories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  onDelete={() => setStoryToDelete(story)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ── Comments Dialog ── */}
      <Dialog open={!!selectedReel} onOpenChange={(open) => !open && setSelectedReel(null)}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Comments — "{selectedReel?.title}"</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            {!selectedReel?.comments?.length ? (
              <p className="text-muted-foreground text-center py-8">No comments yet.</p>
            ) : (
              selectedReel.comments.map((comment) => (
                <div key={comment.id} className="flex items-start justify-between gap-3 p-3 border rounded-lg bg-card/50">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                      User <span className="font-mono">{comment.user_id?.substring(0, 8)}…</span>
                    </p>
                    <p className="text-sm text-foreground break-words">{comment.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(comment.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-red-500 hover:text-red-700 hover:bg-red-500/10"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Reel Confirm ── */}
      <ConfirmDialog
        open={!!reelToDelete}
        title="Delete Reel"
        description={`Are you sure you want to permanently delete "${reelToDelete?.title}"? This action cannot be undone.`}
        isLoading={deletingReel}
        onConfirm={handleDeleteReel}
        onCancel={() => setReelToDelete(null)}
      />

      {/* ── Delete Story Confirm ── */}
      <ConfirmDialog
        open={!!storyToDelete}
        title="Delete Story"
        description={`Are you sure you want to permanently delete this story${storyToDelete?.caption ? ` "${storyToDelete.caption}"` : ''}? This action cannot be undone.`}
        isLoading={deletingStory}
        onConfirm={handleDeleteStory}
        onCancel={() => setStoryToDelete(null)}
      />
    </div>
  );
}

// ─── Reel Card ────────────────────────────────────────────────────────────────
function ReelCard({
  reel,
  onOpenComments,
  onDelete,
}: {
  reel: Reel;
  onOpenComments: () => void;
  onDelete: () => void;
}) {
  const stats = reel.stats ?? { views_count: 0, likes_count: 0, clicks_count: 0, contact_count: 0, saves_count: 0, reel_id: 0, updated_at: '' };
  const commentsCount = reel.comments?.length ?? 0;

  return (
    <Card className="overflow-hidden flex flex-col relative group">
      {/* Media */}
      <div className="relative aspect-[9/16] bg-black">
        {reel.media_path ? (
          reel.media_path.match(/\.(mp4|webm|ogg)$/i) ? (
            <video src={getMediaUrl(reel.media_path)} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" autoPlay muted loop playsInline />
          ) : (
            <img src={getMediaUrl(reel.media_path)} alt={reel.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/40 text-sm">No Media</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant={reel.status === 'active' ? 'default' : 'secondary'}>{reel.status}</Badge>
          {reel.is_sponsored && <Badge variant="outline" className="bg-black/50 text-white border-white/30">Sponsored</Badge>}
        </div>

        {/* Delete button – appears on hover */}
        <button
          onClick={onDelete}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-600/80 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          title="Delete reel"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-semibold text-base leading-snug">{reel.title}</h3>
          {reel.subtitle && <p className="text-white/70 text-xs mt-0.5">{reel.subtitle}</p>}
        </div>
      </div>

      {/* Stats bar */}
      <div className="p-3 grid grid-cols-4 gap-1 text-center border-t">
        <StatItem icon={<Eye className="w-3.5 h-3.5" />} value={stats.views_count} />
        <StatItem icon={<Heart className="w-3.5 h-3.5" />} value={stats.likes_count} />
        <StatItem
          icon={<MessageCircle className="w-3.5 h-3.5" />}
          value={commentsCount}
          onClick={onOpenComments}
          clickable
        />
        <StatItem icon={<MousePointerClick className="w-3.5 h-3.5" />} value={stats.clicks_count} />
      </div>
    </Card>
  );
}

// ─── Story Card ───────────────────────────────────────────────────────────────
function StoryCard({ story, onDelete }: { story: Story; onDelete: () => void }) {
  const viewsCount = story.views?.length || story.views_count || 0;

  return (
    <Card className="overflow-hidden flex flex-col relative group">
      {/* Media */}
      <div className="relative aspect-[9/16] bg-black">
        {story.media_url ? (
          story.media_url.match(/\.(mp4|webm|ogg)$/i) ? (
            <video src={getMediaUrl(story.media_url)} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" autoPlay muted loop playsInline />
          ) : (
            <img src={getMediaUrl(story.media_url)} alt="Story" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/40 text-sm">No Media</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant={story.is_active ? 'default' : 'secondary'}>
            {story.is_active ? 'Active' : 'Expired'}
          </Badge>
        </div>

        {/* Delete button – appears on hover */}
        <button
          onClick={onDelete}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-600/80 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          title="Delete story"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Caption */}
        <div className="absolute bottom-4 left-4 right-4">
          {story.caption && <p className="text-white font-medium text-sm">{story.caption}</p>}
          <p className="text-white/60 text-xs mt-1">Expires: {new Date(story.expires_at).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 flex items-center gap-2 border-t text-muted-foreground">
        <Eye className="w-3.5 h-3.5" />
        <span className="text-xs font-medium">{viewsCount} Views</span>
      </div>
    </Card>
  );
}

// ─── Stat Item ────────────────────────────────────────────────────────────────
function StatItem({
  icon,
  value,
  onClick,
  clickable,
}: {
  icon: React.ReactNode;
  value: number;
  onClick?: () => void;
  clickable?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-0.5 ${
        clickable ? 'cursor-pointer hover:text-primary transition-colors' : ''
      }`}
    >
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-xs font-medium">{value}</span>
    </div>
  );
}
