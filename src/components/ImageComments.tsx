import React, { useEffect, useState } from 'react';
import { ImageComment, imageAddComment, imageGetComments } from "../store";
import { Button, List, TextInput } from 'flowbite-react';

interface CommentProps {
  id: string
}

function ImageComments({ id } : CommentProps) {
  const [commentText, setCommentText] = useState<string>('');
  const [comments, setComments] = useState<ImageComment[]>([]);

  useEffect(() => {
    const comments = imageGetComments(id);
    setComments(comments);
  }, [id]);

  const updateComments = () => {
    const comments = imageGetComments(id);
    setComments(comments);
  };

  const imageCommentAdd = () => {
    if(commentText.length < 1) return;
    imageAddComment(id, commentText);
    setCommentText('');
    updateComments();
  };

  return <div>
    <List className='my-3'>
    {comments.map((item, index) => {
      return <>
        <List.Item key={index}>{new Date(item.date).toLocaleString()} {item.text}</List.Item>
      </>
    })}
    </List>
    <div className='flex flex-row'>
      <TextInput sizing="sm" value={commentText} onChange={(e) => {
        setCommentText(e.target.value);
      }}></TextInput>
      <Button size="xs" onClick={() => {
        imageCommentAdd()
      }}>Add</Button>
    </div>
  </div>;
}

export default ImageComments;