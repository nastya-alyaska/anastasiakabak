import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

interface VisitorData {
  id: string;
  page_path: string;
  visitor_id: string;
  user_agent: string | null;
  referrer: string | null;
  device_type: string | null;
  created_at: string;
}

interface DailyStats {
  date: string;
  visits: number;
}

export function AnalyticsView() {
  const { language } = useLanguage();
  const [visitors, setVisitors] = useState<VisitorData[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Get recent visitors
      const { data: visitorsData, error: visitorsError } = await supabase
        .from('visitor_analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (visitorsError) throw visitorsError;
      setVisitors(visitorsData || []);

      // Calculate daily stats for last 7 days
      const stats: DailyStats[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const { count } = await supabase
          .from('visitor_analytics')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startOfDay(date).toISOString())
          .lte('created_at', endOfDay(date).toISOString());

        stats.push({
          date: format(date, 'dd.MM'),
          visits: count || 0,
        });
      }
      setDailyStats(stats);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDeviceType = (userAgent: string | null): string => {
    if (!userAgent) return 'Unknown';
    if (/mobile/i.test(userAgent)) return 'Mobile';
    if (/tablet/i.test(userAgent)) return 'Tablet';
    return 'Desktop';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-medium text-foreground">
          {language === 'uk' ? 'Аналітика' : 'Analytics'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {language === 'uk' 
            ? 'Відстежуйте відвідувачів вашого сайту' 
            : 'Track your website visitors'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'uk' ? 'Відвідування за останні 7 днів' : 'Visits in the last 7 days'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="visits" fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'uk' ? 'Останні відвідувачі' : 'Recent Visitors'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : visitors.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {language === 'uk' ? 'Немає даних про відвідувачів' : 'No visitor data yet'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'uk' ? 'Дата' : 'Date'}</TableHead>
                    <TableHead>{language === 'uk' ? 'Сторінка' : 'Page'}</TableHead>
                    <TableHead>{language === 'uk' ? 'Пристрій' : 'Device'}</TableHead>
                    <TableHead>{language === 'uk' ? 'Реферер' : 'Referrer'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visitors.map((visitor) => (
                    <TableRow key={visitor.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(visitor.created_at), 'dd.MM.yyyy HH:mm')}
                      </TableCell>
                      <TableCell>{visitor.page_path}</TableCell>
                      <TableCell>{getDeviceType(visitor.user_agent)}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {visitor.referrer || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
