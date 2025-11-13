'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDataset } from '@/lib/data/useDataset';
import { BarChart3, TrendingUp, Users, MessageSquare, MapPin, Heart } from 'lucide-react';
import { useMemo } from 'react';
import type { EnrichedTweet, NamedEntity } from '@/types/dataset';

export function DatasetInsights() {
  const { dataset, isLoading, error } = useDataset();

  const insights = useMemo(() => {
    if (!dataset) return null;

    const tweets = dataset.tweets || [];
    const enrichedTweets = dataset.enrichedTweets || [];
    const users = dataset.users || [];

    // Sentiment distribution
    const sentimentCounts = enrichedTweets.reduce(
      (acc: Record<string, number>, tweet: EnrichedTweet) => {
        if (tweet.sentiment) {
          acc[tweet.sentiment] = (acc[tweet.sentiment] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    const totalSentiment = (Object.values(sentimentCounts) as number[]).reduce((a, b) => a + b, 0);
    const sentimentDistribution =
      totalSentiment > 0
        ? {
            positive: ((sentimentCounts.positive || 0) / totalSentiment) * 100,
            neutral: ((sentimentCounts.neutral || 0) / totalSentiment) * 100,
            negative: ((sentimentCounts.negative || 0) / totalSentiment) * 100,
          }
        : {
            positive: 0,
            neutral: 0,
            negative: 0,
          };

    // Top entities
    const entityCounts = new Map<string, { count: number; category: string }>();
    enrichedTweets.forEach((tweet: EnrichedTweet) => {
      tweet.entities?.forEach((entity: NamedEntity) => {
        const key = entity.text;
        if (entityCounts.has(key)) {
          entityCounts.get(key)!.count++;
        } else {
          entityCounts.set(key, { count: 1, category: entity.category });
        }
      });
    });

    const topEntities = Array.from(entityCounts.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([text, data]) => ({ text, ...data }));

    // Geographic distribution
    const locationCounts = new Map<string, number>();
    users.forEach((user) => {
      if (user.location) {
        const location = user.location;
        locationCounts.set(location, (locationCounts.get(location) || 0) + 1);
      }
    });

    const topLocations = Array.from(locationCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([location, count]) => ({ location, count }));

    // Engagement metrics
    const totalRetweets = tweets.reduce(
      (sum, t) => sum + (t.public_metrics?.retweet_count || 0),
      0
    );
    const totalLikes = tweets.reduce((sum, t) => sum + (t.public_metrics?.like_count || 0), 0);
    const totalReplies = tweets.reduce((sum, t) => sum + (t.public_metrics?.reply_count || 0), 0);

    const avgRetweets = tweets.length > 0 ? Math.round(totalRetweets / tweets.length) : 0;
    const avgLikes = tweets.length > 0 ? Math.round(totalLikes / tweets.length) : 0;
    const avgReplies = tweets.length > 0 ? Math.round(totalReplies / tweets.length) : 0;

    // Top influential users
    const topUsers = users
      .sort(
        (a, b) =>
          (b.public_metrics?.followers_count || 0) - (a.public_metrics?.followers_count || 0)
      )
      .slice(0, 5)
      .map((user) => ({
        name: user.name,
        username: user.username,
        followers: user.public_metrics?.followers_count || 0,
        verified: user.verified || false,
      }));

    // Users with geo data
    const usersWithGeo = users.filter((u) => u.geo).length;
    const geoPercentage = users.length > 0 ? Math.round((usersWithGeo / users.length) * 100) : 0;

    return {
      sentimentDistribution,
      topEntities,
      topLocations,
      engagement: { avgRetweets, avgLikes, avgReplies, totalRetweets, totalLikes },
      topUsers,
      stats: {
        totalTweets: tweets.length,
        totalUsers: users.length,
        geoPercentage,
        usersWithGeo,
      },
    };
  }, [dataset]);

  if (isLoading) {
    return (
      <Card className="bg-[#1E2533] border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Dataset Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-400">Cargando insights...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !insights) {
    return (
      <Card className="bg-[#1E2533] border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Dataset Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-400">Error al cargar insights del dataset</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#1E2533] border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Tweets</CardTitle>
            <MessageSquare className="h-4 w-4 text-[#3B82F6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{insights.stats.totalTweets}</div>
            <p className="text-xs text-gray-500">Ventana de 28 minutos</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1E2533] border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Usuarios</CardTitle>
            <Users className="h-4 w-4 text-[#10B981]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{insights.stats.totalUsers}</div>
            <p className="text-xs text-gray-500">
              {insights.stats.geoPercentage}% con geolocalización
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1E2533] border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Avg. Retweets</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#8B5CF6]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{insights.engagement.avgRetweets}</div>
            <p className="text-xs text-gray-500">
              Total: {insights.engagement.totalRetweets.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1E2533] border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Avg. Likes</CardTitle>
            <Heart className="h-4 w-4 text-[#EC4899]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{insights.engagement.avgLikes}</div>
            <p className="text-xs text-gray-500">
              Total: {insights.engagement.totalLikes.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sentiment Distribution */}
      <Card className="bg-[#1E2533] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#3B82F6]" />
            Distribución de Sentimiento
          </CardTitle>
          <CardDescription className="text-gray-400">
            Análisis de sentimiento de {insights.stats.totalTweets} tweets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Positive */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Positivo</span>
                <span className="text-sm font-medium text-[#10B981]">
                  {insights.sentimentDistribution.positive.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-[#10B981] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${insights.sentimentDistribution.positive}%` }}
                />
              </div>
            </div>

            {/* Neutral */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Neutral</span>
                <span className="text-sm font-medium text-gray-400">
                  {insights.sentimentDistribution.neutral.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gray-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${insights.sentimentDistribution.neutral}%` }}
                />
              </div>
            </div>

            {/* Negative */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Negativo</span>
                <span className="text-sm font-medium text-[#EF4444]">
                  {insights.sentimentDistribution.negative.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-[#EF4444] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${insights.sentimentDistribution.negative}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Entities */}
        <Card className="bg-[#1E2533] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Entidades Principales</CardTitle>
            <CardDescription className="text-gray-400">
              Personas, lugares y organizaciones más mencionadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.topEntities.map((entity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        entity.category === 'Person'
                          ? 'bg-[#3B82F6]'
                          : entity.category === 'Location'
                            ? 'bg-[#10B981]'
                            : entity.category === 'Organization'
                              ? 'bg-[#F59E0B]'
                              : 'bg-[#8B5CF6]'
                      }`}
                    />
                    <span className="text-sm text-gray-300">{entity.text}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{entity.category}</span>
                    <span className="text-sm font-medium text-white">{entity.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Locations */}
        <Card className="bg-[#1E2533] border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#10B981]" />
              Ubicaciones Principales
            </CardTitle>
            <CardDescription className="text-gray-400">
              Distribución geográfica de usuarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.topLocations.map((loc, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">{loc.location}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-[#10B981] h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${(loc.count / insights.topLocations[0].count) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-white w-8 text-right">
                      {loc.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Influential Users */}
      <Card className="bg-[#1E2533] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-[#8B5CF6]" />
            Usuarios Más Influyentes
          </CardTitle>
          <CardDescription className="text-gray-400">
            Ordenados por número de seguidores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.topUsers.map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-[#151B26] hover:bg-[#1A2030] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{user.name}</span>
                      {user.verified && (
                        <svg
                          className="w-4 h-4 text-[#3B82F6]"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.5 12.8l-2.5-2.4-1.4 1.4L8.5 16l9-9-1.4-1.4z" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">@{user.username}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-white">
                    {user.followers.toLocaleString()}
                  </div>
                  <span className="text-xs text-gray-500">seguidores</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
