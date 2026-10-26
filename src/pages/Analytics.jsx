import { useEffect, useState } from 'react';
import StatsGrid from '../components/dashboard/StatsGrid';
import ClicksChart from '../components/dashboard/ClicksChart';
import TopDestinationsCard from '../components/dashboard/TopDestinationsCard';
import LinkHealthCard from '../components/dashboard/LinkHealthCard';
import api from '../api/api';
import toast from 'react-hot-toast';
import styles from './Analytics.module.css';

function Analytics() {
    const [links, setLinks] = useState(null);
    const [loading, setLoading] = useState(true);

    const getAnalyticsData = async () => {
        setLoading(true);
        try {
            const res = await api.get('/dashboard/urls');
            setLinks(res.data?.data || []);
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || "Failed to load analytics data";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAnalyticsData();
    }, []);

    const isInitialLoading = loading && !links;
    const linksData = links || [];

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.title}>Analytics</h1>
                    <p className={styles.subtitle}>Detailed overview of your link clicks, performance trends, and visitor insights.</p>
                </div>

                <StatsGrid urls={linksData} loading={isInitialLoading} />

                <div className={styles.analyticsGrid}>
                    <ClicksChart links={linksData} loading={isInitialLoading} />
                    <div className={styles.sideColumn}>
                        <TopDestinationsCard links={linksData} loading={isInitialLoading} />
                        <LinkHealthCard links={linksData} loading={isInitialLoading} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Analytics;