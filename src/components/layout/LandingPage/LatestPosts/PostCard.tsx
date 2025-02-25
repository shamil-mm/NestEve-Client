import React from 'react';
import Tag from '../../../ui/LandingPage/Tag/Tag';

interface Post {
  id:number;
  title:string;
  description:string;
  image:string;
  featured?:boolean;
  tags?:string[];
}

interface PostCardProps{
  post:Post;
  featured?:boolean
}

const PostCard :React.FC<PostCardProps>= ({ post, featured = false }) => {
  return (
    <div className={`bg-black rounded-lg overflow-hidden ${featured ? 'col-span-2 row-span-2' : ''}`}>
      <div className="relative">
        <img
          src={post.image}
          alt={post.title}
          className={`w-full object-cover h-120`}
        />
      </div>
      <div className="p-4">
        {featured ? (
          <>
            <h3 className="text-xl font-bold mb-4">{post.title}</h3>
            <p className="text-gray-400 mb-4">{post.description}</p>
            <div className="flex flex-wrap gap-2">
              {post.tags && post.tags.map(tag => (
                <Tag key={tag}>#{tag}</Tag>
              ))}
            </div>
            <br />
          </>
        ) : (
          <>
            <h3 className="text-lg font-bold mb-2 text-white">{post.title}</h3>
            <p className="text-white text-sm">{post.description}</p>
            <br />
          </>
        )}
      </div>
    </div>
  );
};

export default PostCard;