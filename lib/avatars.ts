// Avatar seçenekleri - Emoji based
export const AVATARS = [
  '😊', // Happy
  '🤓', // Nerdy
  '😎', // Cool
  '🥳', // Party
  '🤩', // Star-struck
  '🥰', // Love
  '🐶', // Dog
  '🐱', // Cat
  '🦊', // Fox
  '🐼', // Panda
  '🦁', // Lion
  '🐨', // Koala
] as const;

export type Avatar = typeof AVATARS[number];

export const DEFAULT_AVATAR: Avatar = '😊';

// Avatar display için helper
export const getAvatarEmoji = (avatar?: string): string => {
  if (avatar && AVATARS.includes(avatar as Avatar)) {
    return avatar;
  }
  return DEFAULT_AVATAR;
};

