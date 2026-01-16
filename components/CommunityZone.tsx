import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, MessageSquare, Send, Heart, Share2, MoreHorizontal } from 'lucide-react';

interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
}

const CommunityZone: React.FC = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'Alex Trader',
      avatar: 'AT',
      content: t('marketAnalysis'),
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      likes: 24,
      comments: 8,
      shares: 3
    },
    {
      id: '2',
      author: 'Sarah Invest',
      avatar: 'SI',
      content: t('strategyShare'),
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      likes: 42,
      comments: 12,
      shares: 7
    },
    {
      id: '3',
      author: 'Mike Forex',
      avatar: 'MF',
      content: t('riskManagementTips'),
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      likes: 18,
      comments: 5,
      shares: 2
    }
  ]);
  const [comments, setComments] = useState<{ [postId: string]: Comment[] }>({
    '1': [
      {
        id: 'c1',
        author: 'John Doe',
        avatar: 'JD',
        content: t('comment1'),
        timestamp: new Date(Date.now() - 1800000).toISOString()
      },
      {
        id: 'c2',
        author: 'Jane Smith',
        avatar: 'JS',
        content: t('comment2'),
        timestamp: new Date(Date.now() - 3600000).toISOString()
      }
    ]
  });
  const [newPost, setNewPost] = useState('');
  const [activeTab, setActiveTab] = useState<'posts' | 'groups'>('posts');

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.trim()) {
      const post: Post = {
        id: Math.random().toString(36).substr(2, 9),
        author: 'You',
        avatar: 'Y',
        content: newPost,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: 0,
        shares: 0
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  return (
    <div className="modern-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          {t('communityZone')}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-3 py-1 rounded-full text-xs ${activeTab === 'posts'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
          >
            {t('posts')}
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-3 py-1 rounded-full text-xs ${activeTab === 'groups'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
          >
            {t('groups')}
          </button>
        </div>
      </div>

      {activeTab === 'posts' ? (
        <div className="space-y-6">
          {/* Create Post */}
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <form onSubmit={handlePostSubmit}>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder={t('shareThoughts')}
                className="w-full bg-slate-800 text-white placeholder-slate-400 border border-slate-600 rounded-lg p-3 mb-3 resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500"
                rows={3}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm"
                >
                  <Send className="h-4 w-4" />
                  {t('post')}
                </button>
              </div>
            </form>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="bg-slate-700/30 p-4 rounded-lg">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                    {post.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-semibold text-white">{post.author}</h4>
                      <button className="text-slate-400 hover:text-white">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-slate-400 text-xs">
                      {new Date(post.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>

                <p className="text-white mb-4">{post.content}</p>

                <div className="flex gap-4 text-slate-400 text-sm">
                  <button className="flex items-center gap-1 hover:text-emerald-400">
                    <Heart className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-400">
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-purple-400">
                    <Share2 className="h-4 w-4" />
                    <span>{post.shares}</span>
                  </button>
                </div>

                {/* Comments Section */}
                <div className="mt-4 space-y-3">
                  {comments[post.id]?.map(comment => (
                    <div key={comment.id} className="flex items-start gap-2 ml-6">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-yellow-500 to-red-500 flex items-center justify-center text-white text-xs">
                        {comment.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="bg-slate-600/50 p-2 rounded-lg">
                          <div className="flex justify-between">
                            <h5 className="font-medium text-white text-sm">{comment.author}</h5>
                            <span className="text-xs text-slate-400">
                              {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-300 text-sm">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center gap-2 ml-6 mt-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs">
                      Y
                    </div>
                    <input
                      type="text"
                      placeholder={t('writeComment')}
                      className="flex-1 bg-slate-700 text-white placeholder-slate-400 border border-slate-600 rounded-full px-4 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <h3 className="font-semibold text-white mb-2">🚀 {t('scalpingGroup')}</h3>
              <p className="text-slate-400 text-sm mb-3">{t('scalpingDesc')}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">{t('members')} 248</span>
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded text-xs">
                  {t('join')}
                </button>
              </div>
            </div>

            <div className="bg-slate-700/50 p-4 rounded-lg">
              <h3 className="font-semibold text-white mb-2">💡 {t('fundamentalAnalysis')}</h3>
              <p className="text-slate-400 text-sm mb-3">{t('faDesc')}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">{t('members')} 156</span>
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded text-xs">
                  {t('join')}
                </button>
              </div>
            </div>

            <div className="bg-slate-700/50 p-4 rounded-lg">
              <h3 className="font-semibold text-white mb-2">📊 {t('technicalAnalysis')}</h3>
              <p className="text-slate-400 text-sm mb-3">{t('taDesc')}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">{t('members')} 312</span>
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded text-xs">
                  {t('join')}
                </button>
              </div>
            </div>

            <div className="bg-slate-700/50 p-4 rounded-lg">
              <h3 className="font-semibold text-white mb-2">💰 {t('riskManagement')}</h3>
              <p className="text-slate-400 text-sm mb-3">{t('rmDesc')}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">{t('members')} 189</span>
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded text-xs">
                  {t('join')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityZone;