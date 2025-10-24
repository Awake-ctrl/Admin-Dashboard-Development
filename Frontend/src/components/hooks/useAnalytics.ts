import { useState, useEffect } from 'react';
import { 
  fetchAnalyticsData, 
  transformEnrollmentData, 
  transformCoursePerformance, 
  transformDeviceUsage, 
  transformEngagementData,
  formatCurrency 
} from '../api/analyticsapi';

export const useAnalytics = () => {
  const [data, setData] = useState({
    userStats: null,
    courseStats: null,
    contentStats: null,
    subscriptionStats: null,
    userDemographics: null,
    revenueData: null,
    enrollmentData: [],
    coursePerformance: [],
    deviceUsage: [],
    engagementData: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const {
          usersData,
          coursesData,
          contentsData,
          subscriptionsData,
          demographicsData,
          revenueData
        } = await fetchAnalyticsData();

        // Transform data for charts
        const enrollmentData = transformEnrollmentData(revenueData, coursesData);
        const coursePerformance = transformCoursePerformance(coursesData);
        const deviceUsage = transformDeviceUsage(demographicsData);
        const engagementData = transformEngagementData(revenueData, contentsData, usersData, coursesData);

        setData({
          userStats: usersData,
          courseStats: coursesData,
          contentStats: contentsData,
          subscriptionStats: subscriptionsData,
          userDemographics: demographicsData,
          revenueData,
          enrollmentData,
          coursePerformance,
          deviceUsage,
          engagementData
        });

      } catch (err) {
        console.error('Error loading analytics data:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    ...data,
    loading,
    error,
    formatCurrency
  };
};