import { createContext, useContext, useReducer, useMemo } from "react";
import { getProfile } from "@zoralabs/coins-sdk";

export const ProfileContext = createContext({});

type ProfileData = {
  profile?: {
    address?: string;
    handle?: string;
    displayName?: string;
    bio?: string;
    joinedAt?: string;
    profileImage?: {
      small?: string;
      medium?: string;
      blurhash?: string;
    };
    linkedWallets?: Array<{
      type?: string;
      url?: string;
    }>;
    followerCount?: number;
    followingCount?: number;
  }
};
 

const ProfileProvider = ({ children }: any) => {
  const [values, dispatch] = useReducer(
    (curVal: any, newVal: any) => ({ ...curVal, ...newVal }),
    {
      profileData: null as ProfileData | null,
      loading: false,
      error: null
    }
  );

  const { profileData, loading, error } = values;

  const loadProfile = async (address: string) => {
    dispatch({ loading: true, error: null });
    try {

      const { data } = await getProfile({
        identifier: address as any,
      });

      dispatch({ profileData: data, loading: false });
    } catch (err) {
      dispatch({ error: err, loading: false });
    }
  };

  const updateProfile = async (updates: Partial<ProfileData['profile']>) => {
    dispatch({ loading: true });
    try {
      dispatch({
        profileData: { profile: updates },
        loading: false
      });
    } catch (err) {
      dispatch({ error: err, loading: false });
    }
  };

  const profileContext = useMemo(
    () => ({
      profileData,
      loading,
      error,
      loadProfile,
      updateProfile
    }),
    [profileData, loading, error]
  );

  return (
    <ProfileContext.Provider value={profileContext}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileProvider;