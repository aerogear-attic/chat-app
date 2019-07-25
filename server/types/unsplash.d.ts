export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  JSON: any;
};

export type Exif = {
  __typename?: "Exif";
  make: Scalars["String"];
  model: Scalars["String"];
  exposure_time: Scalars["String"];
  aperture: Scalars["String"];
  focal_length: Scalars["String"];
  iso: Scalars["Int"];
};

export type Links = {
  __typename?: "Links";
  self: Scalars["String"];
  html: Scalars["String"];
  download?: Maybe<Scalars["String"]>;
  download_location?: Maybe<Scalars["String"]>;
  photos?: Maybe<Scalars["String"]>;
  likes?: Maybe<Scalars["String"]>;
  portfolio?: Maybe<Scalars["String"]>;
  following?: Maybe<Scalars["String"]>;
  followers?: Maybe<Scalars["String"]>;
};

export type Location = {
  __typename?: "Location";
  title: Scalars["String"];
  name: Scalars["String"];
  city: Scalars["String"];
  country: Scalars["String"];
  position: Position;
};

export type Position = {
  __typename?: "Position";
  latitude: Scalars["Int"];
  longitude: Scalars["Int"];
};

export type Profile_Image = {
  __typename?: "Profile_image";
  small: Scalars["String"];
  medium: Scalars["String"];
  large: Scalars["String"];
};

export type RandomPhoto = {
  __typename?: "RandomPhoto";
  id: Scalars["String"];
  created_at: Scalars["String"];
  updated_at: Scalars["String"];
  width: Scalars["Int"];
  height: Scalars["Int"];
  color: Scalars["String"];
  description: Scalars["String"];
  alt_description: Scalars["String"];
  urls: Urls;
  links: Links;
  categories: Array<Maybe<Scalars["JSON"]>>;
  sponsored: Scalars["Boolean"];
  sponsored_by?: Maybe<Scalars["JSON"]>;
  sponsored_impressions_id?: Maybe<Scalars["JSON"]>;
  likes: Scalars["Int"];
  liked_by_user: Scalars["Boolean"];
  current_user_collections: Array<Maybe<Scalars["JSON"]>>;
  user: User;
  exif: Exif;
  location: Location;
  views: Scalars["Int"];
  downloads: Scalars["Int"];
};

export type RandomPhotoInput = {
  query: Scalars["String"];
  orientation: Scalars["String"];
};

export type Root = {
  __typename?: "Root";
  RandomPhoto?: Maybe<RandomPhoto>;
};

export type RootRandomPhotoArgs = {
  input?: Maybe<RandomPhotoInput>;
};

export type Urls = {
  __typename?: "Urls";
  raw: Scalars["String"];
  full: Scalars["String"];
  regular: Scalars["String"];
  small: Scalars["String"];
  thumb: Scalars["String"];
};

export type User = {
  __typename?: "User";
  id: Scalars["ID"];
  updated_at: Scalars["String"];
  username: Scalars["String"];
  name: Scalars["String"];
  first_name: Scalars["String"];
  last_name: Scalars["String"];
  twitter_username?: Maybe<Scalars["JSON"]>;
  portfolio_url?: Maybe<Scalars["JSON"]>;
  bio?: Maybe<Scalars["JSON"]>;
  location: Scalars["String"];
  links: Links;
  profile_image: Profile_Image;
  instagram_username: Scalars["String"];
  total_collections: Scalars["Int"];
  total_likes: Scalars["Int"];
  total_photos: Scalars["Int"];
  accepted_tos: Scalars["Boolean"];
};
