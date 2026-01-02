import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, FormControl, Button } from 'react-bootstrap';

function Home() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // In a real app, you would fetch these from an API or a dynamic source
    // For now, we'll import them directly or read them from a predefined list.
    const blogFiles = [
      {
        slug: 'first-post',
        title: 'My First Blog Post',
        date: '2026-01-02',
        author: 'Gemini AI',
        description: 'This is the first sample blog post created by Gemini AI.',
      },
      {
        slug: 'second-post',
        title: 'Another Blog Post',
        date: '2026-01-01',
        author: 'Gemini AI',
        description: 'This is the second sample blog post created by Gemini AI, focusing on new features.',
      },
    ];
    setPosts(blogFiles);
  }, []);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Blog Posts</h1>
      <Form className="d-flex mb-4">
        <FormControl
          type="search"
          placeholder="Search blog posts..."
          className="me-2"
          aria-label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="outline-success">Search</Button>
      </Form>
      <Row>
        {filteredPosts.map((post) => (
          <Col md={4} className="mb-4" key={post.slug}>
            <Card>
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {post.author} on {post.date}
                </Card.Subtitle>
                <Card.Text>
                  {post.description}
                </Card.Text>
                <Button variant="primary" as={Link} to={`/blog/${post.slug}`}>Read More</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Home;
