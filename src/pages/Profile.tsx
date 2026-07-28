
import { useProfileData } from "@/hooks/useProfileData";
import ProfileLoadingState from "@/components/profile/ProfileLoadingState";
import NoProfileState from "@/components/profile/NoProfileState";
import ProfileLayout from "@/components/profile/ProfileLayout";

const ProfilePage = () => {
  const { user, profile, isLoading, debugInfo, refetchProfile } = useProfileData();


  if (isLoading) {
    return <ProfileLoadingState />;
  }

  // Check if user has no profile at all
  if (!profile) {
    return (
      <NoProfileState 
        user={user} 
        onProfileUpdate={refetchProfile} 
      />
    );
  }

  // Check if user has a profile but no role assigned
  if (!profile.role || profile.role.trim() === '') {
    return (
      <NoProfileState 
        user={user} 
        onProfileUpdate={refetchProfile} 
      />
    );
  }

  return (
    <ProfileLayout
      user={user}
      profile={profile}
      debugInfo={debugInfo}
      onProfileUpdate={refetchProfile}
    />
  );
};

export default ProfilePage;
