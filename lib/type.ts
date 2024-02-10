export type Post = {
  id: number;
  title: string;
  description: string;
  cover_url: string;
  tag: string;
  create_at: Date;
  md_file_url: string;
};

export type Moment = {
  id: number;
  content: string;
  image_url: string;
  tag: string;
  create_at: Date;
  comments: {
    id: number;
    user_name: string;
    user_email_md5: string;
    user_site_url: string;
    user_tag: string;
    content: string;
    create_at: Date;
    replies: {
      id: number;
      reply_id: number;
      reply_name: string;
      user_name: string;
      user_email_md5: string;
      user_site_url: string;
      user_tag: string;
      content: string;
      create_at: Date;
    }[];
  }[];
};

export type UserProfile = {
  name: string;
  emailMdD5: string;
  siteUrl: string;
  tag: string;
  commentCount: number;
  replyCount: number;
};
