import React from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

type Props = {
    hasLiked: boolean;
    toggleLike: () => void;
}

export default function LikeButton({hasLiked, toggleLike}: Props) {
  return (
    <div onClick={toggleLike} className='relative hover:opacity-80 transition cursor-pointer'>
        <AiOutlineHeart size={28} className='fill-white absolute -top-[2px] -right-[2px]'/>
        <AiFillHeart size={24} className={hasLiked ? 'fill-rose-500' : 'fill-neutral-500/70'}/>
    </div>
  )
}