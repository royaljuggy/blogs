import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
    fetch(`${slug}.md`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(text => {
        // Extract front matter (title, date, author) - handles both \n and \r\n
        const frontMatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
        const match = frontMatterRegex.exec(text);
        let content = text;
        if (match && match[1]) {
          const frontMatter = match[1].split(/\r?\n/).reduce((acc, line) => {
            const separatorIndex = line.indexOf(':');
            if (separatorIndex !== -1) {
              const key = line.substring(0, separatorIndex).trim();
              const value = line.substring(separatorIndex + 1).trim();
              if (key && value) acc[key] = value;
            }
            return acc;
          }, {});
          setPostTitle(frontMatter.title || '');
          setPostDate(frontMatter.date || '');
          setPostAuthor(frontMatter.author || '');
          content = text.replace(frontMatterRegex, '').trim();
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
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </Container>
  );
}

export default BlogPost;
