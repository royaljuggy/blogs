import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Container } from 'react-bootstrap';
import './BlogPost.css'; // Import the CSS file

function BlogPost() {
  const { slug } = useParams();
  const [markdown, setMarkdown] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postDate, setPostDate] = useState('');
  const [postAuthor, setPostAuthor] = useState('');

  useEffect(() => {
    // Fetch the markdown file from the public folder
    fetch(`${process.env.PUBLIC_URL}/${slug}.md`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(text => {
        // Extract front matter (title, date, author)
        const frontMatterRegex = /---\n([\s\S]*?)\n---/;
        const match = frontMatterRegex.exec(text);
        let content = text;
        if (match && match[1]) {
          const frontMatter = match[1].split('\n').reduce((acc, line) => {
            const [key, value] = line.split(': ').map(s => s.trim());
            if (key && value) acc[key] = value;
            return acc;
          }, {});
          setPostTitle(frontMatter.title || '');
          setPostDate(frontMatter.date || '');
          setPostAuthor(frontMatter.author || '');
          content = text.replace(frontMatterRegex, ''); // Remove front matter from content
        }
        setMarkdown(content);
      })
      .catch(err => {
        console.error('Error fetching or parsing markdown:', err);
        setMarkdown(`# Post not found\n\nCould not load the blog post for slug: ${slug}`);
      });
  }, [slug]);

  if (!markdown) {
    return <Container className="mt-4">Loading blog post...</Container>;
  }

  return (
    <Container className="mt-4 blog-post-container">
      <h1 className="mb-3">{postTitle}</h1>
      <p className="text-muted">By {postAuthor} on {postDate}</p>
      <hr />
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </Container>
  );
}

export default BlogPost;
