'use client';

import { useState, useEffect } from 'react';

interface UrlRecord {
  id: number;
  originalUrl: string;
  shortUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: string;
}

export default function Home() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [urlHistory, setUrlHistory] = useState<UrlRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchUrlHistory();
  }, []);

  const fetchUrlHistory = async () => {
    try {
      const response = await fetch('/api/shorten');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUrlHistory(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching URL history:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!originalUrl.trim()) {
      setError('Vui lòng nhập URL cần rút gọn');
      return;
    }

    // Kiểm tra URL hợp lệ
    try {
      new URL(originalUrl);
    } catch {
      setError('URL không hợp lệ. Vui lòng nhập URL đầy đủ (bao gồm http:// hoặc https://)');
      return;
    }

    setIsLoading(true);
    setError('');
    setShortUrl('');

    try {
      // Gọi API rút gọn link
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra');
      }

      if (data.success) {
        setShortUrl(data.data.shortUrl);
        // Refresh history after creating new short URL
        fetchUrlHistory();
      } else {
        throw new Error('Không thể rút gọn link');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi rút gọn link. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    alert('Đã sao chép link vào clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 dark:text-white mb-4 uppercase">
            📎 IIT Short Link
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Rút gọn link dễ chia sẻ
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16 mx-auto max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* URL Input */}
            <div>
              <label htmlFor="url" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
                Nhập URL cần rút gọn
              </label>
              <input
                type="text"
                id="url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://example.com/very-long-url-that-needs-to-be-shortened..."
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                disabled={isLoading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-400 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Rút gọn link ngay
                </>
              )}
            </button>
          </form>

          {/* Result */}
          {shortUrl && (
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-400">
                  Link đã được rút gọn thành công! 🎉
                </h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                    Link gốc:
                  </label>
                  <div className="p-3 bg-white dark:bg-gray-700 border border-green-300 dark:border-green-600 rounded-lg text-sm text-gray-600 dark:text-gray-300 break-all">
                    {originalUrl}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                    Link rút gọn:
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={shortUrl}
                      readOnly
                      className="flex-1 px-4 py-3 bg-white dark:bg-gray-700 border-2 border-green-300 dark:border-green-600 rounded-lg text-lg font-mono text-gray-800 dark:text-gray-200 focus:outline-none"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Sao chép</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
