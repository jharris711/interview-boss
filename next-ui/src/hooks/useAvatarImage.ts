import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

type AvatarImage = {
  avatar: string | null;
  loading: boolean;
};

const useAvatarImage = (avatar_url: string | null) => {
  const [avatarImage, setAvatarImage] = useState<AvatarImage>({
    avatar: null,
    loading: true,
  });

  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from('avatars')
          .download(path);
        if (error) {
          throw error;
        }

        const url = URL.createObjectURL(data);
        setAvatarImage({ avatar: url, loading: false });
      } catch (error) {
        console.log('Error downloading image: ', error);
        setAvatarImage({ avatar: null, loading: false });
      }
    }

    if (avatar_url) {
      downloadImage(avatar_url);
    } else {
      setAvatarImage({ avatar: null, loading: false });
    }
  }, [avatar_url, supabase]);

  return avatarImage;
};

export default useAvatarImage;
