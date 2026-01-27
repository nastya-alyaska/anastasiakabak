import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Eye, FileText, Image } from 'lucide-react';

interface Stats {
  totalVisitors: number;
  todayVisitors: number;
  totalContent: number;
  totalImages: number;
}

export function DashboardOverview() {
  const { language } = useLanguage();
  const { isAdmin, isPsychologist } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalVisitors: 0,
    todayVisitors: 0,
    totalContent: 0,
    totalImages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get total visitors
      const { count: totalVisitors } = await supabase
        .from('visitor_analytics')
        .select('*', { count: 'exact', head: true });

      // Get today's visitors
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: todayVisitors } = await supabase
        .from('visitor_analytics')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      // Get content count
      const { count: totalContent } = await supabase
        .from('site_content')
        .select('*', { count: 'exact', head: true });

      // Get images count
      const { count: totalImages } = await supabase
        .from('site_images')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalVisitors: totalVisitors || 0,
        todayVisitors: todayVisitors || 0,
        totalContent: totalContent || 0,
        totalImages: totalImages || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: language === 'uk' ? 'Всього відвідувань' : 'Total Visits',
      value: stats.totalVisitors,
      icon: Eye,
      color: 'text-blue-500',
    },
    {
      title: language === 'uk' ? 'Сьогодні' : 'Today',
      value: stats.todayVisitors,
      icon: Users,
      color: 'text-green-500',
    },
    {
      title: language === 'uk' ? 'Контент' : 'Content',
      value: stats.totalContent,
      icon: FileText,
      color: 'text-purple-500',
    },
    {
      title: language === 'uk' ? 'Зображення' : 'Images',
      value: stats.totalImages,
      icon: Image,
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-medium text-foreground">
          {language === 'uk' ? 'Огляд' : 'Dashboard'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {language === 'uk' 
            ? 'Загальна статистика вашого сайту' 
            : 'Overview of your website statistics'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'uk' ? 'Ваша роль' : 'Your Role'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {isAdmin && (
              <span className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm font-medium">
                Admin
              </span>
            )}
            {isPsychologist && (
              <span className="px-3 py-1 bg-accent/20 text-accent-foreground rounded-full text-sm font-medium">
                {language === 'uk' ? 'Психолог' : 'Psychologist'}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
