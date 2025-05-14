"use client";

import { useState, useEffect } from "react";

type ActivityPageProps = {
  setActiveTab: (tab: string) => void;
};

type ActivityItem = {
  id: string;
  type: "buy" | "sell" | "create" | "reward";
  coinName: string;
  coinImage?: string;
  amount: string;
  value: string;
  timestamp: number;
};

export function ActivityPage({ setActiveTab }: ActivityPageProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadActivities() {
      try {
        // Mock data - replace with actual API call
        const data = [
          {
            id: "1",
            type: "buy",
            coinName: "Cool Cat Photo",
            coinImage: "https://picsum.photos/200/300",
            amount: "100",
            value: "0.05",
            timestamp: Date.now() - 3600000 // 1 hour ago
          },
          {
            id: "2",
            type: "create",
            coinName: "Sunset Vibes",
            coinImage: "https://picsum.photos/200/301",
            amount: "10,000,000",
            value: "0",
            timestamp: Date.now() - 86400000 // 1 day ago
          },
          {
            id: "3",
            type: "reward",
            coinName: "Pixel Art",
            coinImage: "https://picsum.photos/200/302",
            amount: "-",
            value: "0.003",
            timestamp: Date.now() - 172800000 // 2 days ago
          },
          {
            id: "4",
            type: "sell",
            coinName: "Morning Coffee",
            coinImage: "https://picsum.photos/200/303",
            amount: "50",
            value: "0.025",
            timestamp: Date.now() - 259200000 // 3 days ago
          }
        ];
        
        setActivities(data);
      } catch (error) {
        console.error("Failed to load activities:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadActivities();
  }, []);

  const formatTimestamp = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "buy":
        return (
          <div className="bg-green-100 p-2 rounded-full">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        );
      case "sell":
        return (
          <div className="bg-red-100 p-2 rounded-full">
            <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </div>
        );
      case "create":
        return (
          <div className="bg-blue-100 p-2 rounded-full">
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        );
      case "reward":
        return (
          <div className="bg-yellow-100 p-2 rounded-full">
            <svg className="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If no activity
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">No activity yet</h2>
        <p className="text-gray-600 mb-4">Your transactions and rewards will appear here</p>
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-lg"
          onClick={() => setActiveTab("discover")}
        >
          Start Exploring
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4">
      <h1 className="text-xl font-bold mb-4">Activity</h1>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
            {getActivityIcon(activity.type)}
            
            {activity.coinImage && (
              <img
                src={activity.coinImage}
                alt={activity.coinName}
                className="w-10 h-10 rounded-lg ml-3 object-cover"
              />
            )}
            
            <div className="ml-3 flex-1">
              <div className="flex items-center">
                <span className="font-medium capitalize">{activity.type}</span>
                <span className="text-gray-500 mx-1">•</span>
                <span className="text-gray-500 text-sm">{formatTimestamp(activity.timestamp)}</span>
              </div>
              <div className="text-sm text-gray-700">{activity.coinName}</div>
            </div>
            
            <div className="text-right">
              <div className="font-medium">{activity.value} ETH</div>
              {activity.type !== "reward" && (
                <div className="text-xs text-gray-500">{activity.amount} coins</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}