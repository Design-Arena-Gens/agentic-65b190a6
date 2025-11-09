'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [subject, setSubject] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const [loading, setLoading] = useState(false);
  const [scheduledPosts, setScheduledPosts] = useState<Array<{subject: string, post: string, date: string}>>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchScheduledPosts();
  }, []);

  const fetchScheduledPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setScheduledPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const generatePost = async () => {
    if (!subject.trim()) {
      setMessage('Please enter a subject');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject }),
      });

      const data = await res.json();

      if (data.error) {
        setMessage('Error: ' + data.error);
      } else {
        setGeneratedPost(data.post);
        setMessage('Post generated successfully!');
      }
    } catch (error) {
      setMessage('Error generating post');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const schedulePost = async () => {
    if (!generatedPost.trim()) {
      setMessage('Please generate a post first');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, post: generatedPost }),
      });

      const data = await res.json();

      if (data.error) {
        setMessage('Error: ' + data.error);
      } else {
        setMessage('Post scheduled successfully!');
        setSubject('');
        setGeneratedPost('');
        fetchScheduledPosts();
      }
    } catch (error) {
      setMessage('Error scheduling post');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          marginBottom: '10px',
          color: '#1a202c',
          textAlign: 'center'
        }}>
          LinkedIn Post Agent
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#718096',
          marginBottom: '40px',
          fontSize: '16px'
        }}>
          AI-powered LinkedIn content generator with daily scheduling
        </p>

        <div style={{ marginBottom: '30px' }}>
          <label style={{
            display: 'block',
            marginBottom: '10px',
            fontWeight: '600',
            color: '#2d3748',
            fontSize: '14px'
          }}>
            What subject would you like to post about?
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., AI in healthcare, leadership tips, remote work..."
            style={{
              width: '100%',
              padding: '14px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        <button
          onClick={generatePost}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: loading ? '#cbd5e0' : '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '20px',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#5568d3')}
          onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = '#667eea')}
        >
          {loading ? 'Generating...' : 'Generate Post'}
        </button>

        {message && (
          <div style={{
            padding: '12px',
            backgroundColor: message.includes('Error') ? '#fed7d7' : '#c6f6d5',
            color: message.includes('Error') ? '#9b2c2c' : '#22543d',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {message}
          </div>
        )}

        {generatedPost && (
          <div style={{ marginTop: '30px' }}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              fontWeight: '600',
              color: '#2d3748',
              fontSize: '14px'
            }}>
              Generated Post:
            </label>
            <textarea
              value={generatedPost}
              onChange={(e) => setGeneratedPost(e.target.value)}
              style={{
                width: '100%',
                padding: '14px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '15px',
                minHeight: '200px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                lineHeight: '1.6',
                resize: 'vertical'
              }}
            />
            <button
              onClick={schedulePost}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: loading ? '#cbd5e0' : '#48bb78',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '15px',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#38a169')}
              onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = '#48bb78')}
            >
              Schedule for Daily Posting
            </button>
          </div>
        )}

        {scheduledPosts.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '20px',
              color: '#2d3748'
            }}>
              Scheduled Posts
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {scheduledPosts.map((post, index) => (
                <div key={index} style={{
                  padding: '20px',
                  backgroundColor: '#f7fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#718096',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}>
                    Subject: {post.subject}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#2d3748',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {post.post}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#a0aec0',
                    marginTop: '10px',
                    fontStyle: 'italic'
                  }}>
                    Scheduled: {new Date(post.date).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
