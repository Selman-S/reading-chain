// Avatar options - Cute animals
export const AVATARS = [
  '🐶', // Dog
  '🐱', // Cat
  '🐼', // Panda
  '🦊', // Fox
  '🐨', // Koala
  '🐰', // Rabbit
  '🐹', // Hamster
  '🦁', // Lion
  '🐯', // Tiger
  '🐻', // Bear
  '🐸', // Frog
  '🦉', // Owl
  '🐧', // Penguin
  '🐥', // Chick
  '🦄', // Unicorn
  '🐺', // Wolf
] as const;

export type Avatar = typeof AVATARS[number];

export const DEFAULT_AVATAR: Avatar = '🐶';

// Avatar display için helper
export const getAvatarEmoji = (avatar?: string): string => {
  if (avatar && AVATARS.includes(avatar as Avatar)) {
    return avatar;
  }
  return DEFAULT_AVATAR;
};

