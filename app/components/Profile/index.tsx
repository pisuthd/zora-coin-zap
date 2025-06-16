"use client";

import { useState, useEffect, useCallback, useContext } from "react";
import { useAccount } from 'wagmi';
import { Camera, Edit3, Save, X, Plus, ExternalLink, Copy, Check } from "lucide-react";
import {
  useOpenUrl,
} from "@coinbase/onchainkit/minikit";
import { ProfileContext } from "@/contexts/profile";


type CreatorProfilePageProps = {
  setActiveTab: (tab: string) => void;
};
 
export function CreatorProfilePage({ setActiveTab }: CreatorProfilePageProps) {

  const { loadProfile, profileData, loading }: any = useContext(ProfileContext)

  const openUrl = useOpenUrl();

  const account = useAccount();
  const address = account?.address;
  const [copied, setCopied] = useState(false);

  // Load profile data
  useEffect(() => {
    if (address) {
      loadProfile(address)
    }
  }, [address]);

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-lg font-bold">Creator Profile</h1>
        </div>

        {address && (
          <button
            onClick={() => openUrl("https://zora.co")}
            className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-500 text-white`}
          >
            Edit
            <ExternalLink className="w-4 h-4 ml-1" />
          </button>
        )

        }


      </div>

      <div className="flex-1 overflow-auto p-4 pb-20">



        {loading ? (
          <>
            {address && (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>)

            }
            {!address && (
              <div className=" my-2 bg-amber-50 border border-amber-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium text-amber-800">Wallet not connected</h3>
                      <div className="mt-1 text-sm text-amber-700">
                        Connect your wallet to manage your creator profile
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )

            }
          </>
        ) : (
          <>
            {/* Profile Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
              <div className="flex items-center mb-4">
                {/* Profile Image */}
                <div className="relative mr-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                    <img
                      src={profileData?.profile?.avatar?.previewImage?.medium}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <div>
                    <h2 className="text-xl font-bold">{profileData?.profile?.displayName || 'Unnamed Creator'}</h2>
                    <p className="text-gray-600">@{profileData?.profile?.handle || 'no-handle'}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex space-x-4 mt-2 text-sm">
                    <div>
                      <span className="font-medium">{profileData?.profile?.followerCount || 0}</span>
                      <span className="text-gray-500"> followers</span>
                    </div>
                    <div>
                      <span className="font-medium">{profileData?.profile?.followingCount || 0}</span>
                      <span className="text-gray-500"> following</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-4">
                <p className="text-gray-700">{profileData?.profile?.bio || 'No bio yet'}</p>
              </div>

              {/* Address & Join Date */}
              <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3">
                <div className="flex items-center">{/*
              <span>Joined {formatJoinDate(profileData?.profile?.joinedAt)}</span>*/}
                </div>
                <button
                  className="flex items-center space-x-1 hover:text-gray-700"
                  onClick={copyAddress}
                >
                  <span className="font-mono text-xs">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                  {copied ? (
                    <Check className="w-3 h-3 text-green-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Social Links</h3>
              </div>

              <div className="space-y-2">
                {profileData?.profile?.socialAccounts && Object.entries(profileData.profile.socialAccounts).some(([_, url]) => url) ? (
                  Object.entries(profileData.profile.socialAccounts)
                    .filter(([_, url]) => url) // Only show non-null/non-empty links
                    .map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 group"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 mr-3 flex items-center justify-center bg-gray-100 rounded-full">
                            {platform === 'twitter' && (
                              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                              </svg>
                            )}
                            {platform === 'instagram' && (
                              <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                              </svg>
                            )}
                            {platform === 'tiktok' && (
                              <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19.321 5.562a5.124 5.124 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.849-1.242-1.89-1.242-3.338h-2.684v13.635a3.874 3.874 0 11-2.684-3.652V8.302a6.482 6.482 0 00-1.242.121c-.363.073-.726.194-1.045.363a6.5 6.5 0 104.5 6.214V9.847a8.963 8.963 0 004.234 1.045c.484 0 .968-.048 1.45-.145V7.064c-.484.097-.968.145-1.45.145a6.658 6.658 0 01-2.257-.387z" />
                              </svg>
                            )}
                          </div>
                          <span className="font-medium capitalize">{platform}</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                      </a>
                    ))
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No social links added yet
                  </p>
                )}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}