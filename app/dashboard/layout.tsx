import './dashboard.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-root">
      <Sidebar />
      <div className="main">
        <Header />
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
