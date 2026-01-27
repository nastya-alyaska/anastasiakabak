import { AdminView } from '@/pages/Admin';
import { DashboardOverview } from './DashboardOverview';
import { AnalyticsView } from './AnalyticsView';
import { RolesView } from './RolesView';
import { ContentView } from './ContentView';
import { ImagesView } from './ImagesView';

interface AdminDashboardProps {
  currentView: AdminView;
}

export function AdminDashboard({ currentView }: AdminDashboardProps) {
  switch (currentView) {
    case 'dashboard':
      return <DashboardOverview />;
    case 'analytics':
      return <AnalyticsView />;
    case 'roles':
      return <RolesView />;
    case 'content':
      return <ContentView />;
    case 'images':
      return <ImagesView />;
    default:
      return <DashboardOverview />;
  }
}
