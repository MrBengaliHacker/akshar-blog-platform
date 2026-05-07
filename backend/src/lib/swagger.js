const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Akshar Blog API',
      version: '1.0.0',
      description: `
## Akshar Blog REST API

A modern blog REST API with AI writing assistance, role-based access control, and complete admin panel.

## Authentication
This API uses JWT Bearer token authentication.
1. Register or login to get an access token
2. Click **Authorize** button and enter: \`your_access_token\`
3. All protected endpoints will use this token automatically

## Demo Access
| Role | Email | Password |
|------|-------|----------|
| Admin | demo@akshar.com | Demo@1234 |

> ⚠️ Destructive actions (delete, ban) are disabled in demo mode.

## Roles
- **user** → Can create, edit own blogs, comment, like
- **admin** → Full access including user management
      `,
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Development server',
      },
      {
        url: 'https://akshar-blog-platform.onrender.com/api/v1',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your access token here',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '675abc123def456789012345' },
            username: { type: 'string', example: 'user_abc123' },
            email: { type: 'string', example: 'john@gmail.com' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            avatar: { type: 'string', example: 'https://res.cloudinary.com/...' },
            bio: { type: 'string', example: 'I love writing blogs!' },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            isBanned: { type: 'boolean', example: false },
            socialLinks: {
              type: 'object',
              properties: {
                website: { type: 'string' },
                facebook: { type: 'string' },
                instagram: { type: 'string' },
                linkedin: { type: 'string' },
                x: { type: 'string' },
                youtube: { type: 'string' },
              },
            },
            createdAt: { type: 'string', example: '2026-01-01T00:00:00.000Z' },
          },
        },
        Blog: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '675abc123def456789012345' },
            title: { type: 'string', example: 'My First Blog' },
            slug: { type: 'string', example: 'my-first-blog-abc123' },
            content: { type: 'string', example: '<p>Hello world</p>' },
            banner: {
              type: 'object',
              properties: {
                url: { type: 'string', example: 'https://res.cloudinary.com/...' },
                width: { type: 'number', example: 800 },
                height: { type: 'number', example: 450 },
              },
            },
            author: { $ref: '#/components/schemas/User' },
            status: { type: 'string', enum: ['draft', 'published'], example: 'published' },
            viewsCount: { type: 'number', example: 100 },
            likesCount: { type: 'number', example: 50 },
            commentsCount: { type: 'number', example: 10 },
            publishedAt: { type: 'string', example: '2026-01-01T00:00:00.000Z' },
          },
        },
        Comment: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '675abc123def456789012345' },
            blogId: { type: 'string', example: '675abc123def456789012345' },
            userId: { $ref: '#/components/schemas/User' },
            content: { type: 'string', example: 'Great blog post!' },
            createdAt: { type: 'string', example: '2026-01-01T00:00:00.000Z' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            code: { type: 'string', example: 'ValidationError' },
            message: { type: 'string', example: 'Email is required' },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 100 },
            limit: { type: 'number', example: 20 },
            offset: { type: 'number', example: 0 },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Users', description: 'User management endpoints' },
      { name: 'Blogs', description: 'Blog CRUD endpoints' },
      { name: 'Comments', description: 'Comment endpoints' },
      { name: 'Likes', description: 'Like/Unlike endpoints' },
      { name: 'AI', description: 'AI writing assistant endpoints' },
    ],
    paths: {

      // ─── AUTH ─────────────────────────────────────────
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          security: [],
          description: 'Register a new user account. To register as **admin**, your email must be whitelisted in `ADMIN_EMAILS` or be the `DEMO_ADMIN_EMAIL`.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'john@gmail.com' },
                    password: { type: 'string', example: 'password123', minLength: 8 },
                    role: {
                      type: 'string',
                      enum: ['user', 'admin'],
                      example: 'user',
                      description: 'Admin role requires whitelisted email',
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'User registered successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      user: { $ref: '#/components/schemas/User' },
                      accessToken: { type: 'string' },
                    },
                  },
                },
              },
            },
            400: { description: 'Validation error' },
            403: { description: 'Not authorized to register as admin' },
            409: { description: 'Email already exists' },
          },
        },
      },

      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login user',
          security: [],
          description: 'Login with email and password. Returns access token and sets refresh token in httpOnly cookie.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'john@gmail.com' },
                    password: { type: 'string', example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      user: { $ref: '#/components/schemas/User' },
                      accessToken: { type: 'string' },
                    },
                  },
                },
              },
            },
            401: { description: 'Invalid email or password' },
          },
        },
      },

      '/auth/refresh-token': {
        post: {
          tags: ['Auth'],
          summary: 'Refresh access token',
          security: [],
          description: 'Get a new access token using the refresh token stored in httpOnly cookie. Call this when access token expires.',
          responses: {
            200: {
              description: 'New access token generated',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      accessToken: { type: 'string' },
                    },
                  },
                },
              },
            },
            401: { description: 'Refresh token missing or invalid or expired' },
          },
        },
      },

      '/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Logout user',
          description: 'Deletes refresh token from DB and clears httpOnly cookie.',
          responses: {
            204: { description: 'Logged out successfully' },
            500: { description: 'Server error' },
          },
        },
      },

      // ─── USERS ────────────────────────────────────────
      '/users/current': {
        get: {
          tags: ['Users'],
          summary: 'Get current user',
          description: 'Returns the currently authenticated user profile.',
          responses: {
            200: {
              description: 'Current user data',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: { user: { $ref: '#/components/schemas/User' } },
                  },
                },
              },
            },
            401: { description: 'Unauthorized' },
            404: { description: 'User not found' },
          },
        },
        patch: {
          tags: ['Users'],
          summary: 'Update current user',
          description: 'Update profile fields. All fields are optional. Upload avatar_image as file.',
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    avatar_image: { type: 'string', format: 'binary', description: 'Max 1MB' },
                    username: { type: 'string', maxLength: 20 },
                    email: { type: 'string' },
                    password: { type: 'string', minLength: 8 },
                    firstName: { type: 'string', maxLength: 20 },
                    lastName: { type: 'string', maxLength: 20 },
                    bio: { type: 'string', maxLength: 200 },
                    website: { type: 'string' },
                    facebook: { type: 'string' },
                    instagram: { type: 'string' },
                    linkedin: { type: 'string' },
                    x: { type: 'string' },
                    youtube: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'User updated successfully' },
            400: { description: 'Validation error' },
            409: { description: 'Username or email already exists' },
          },
        },
        delete: {
          tags: ['Users'],
          summary: 'Delete own account',
          description: 'Permanently deletes account, all blogs, banners from Cloudinary and refresh tokens.',
          responses: {
            204: { description: 'Account deleted successfully' },
            401: { description: 'Unauthorized' },
          },
        },
      },

      '/users': {
        get: {
          tags: ['Users'],
          summary: 'Get all users',
          description: '**Admin only.** Returns paginated list of all users.',
          parameters: [
            { name: 'limit', in: 'query', description: 'Max 50', schema: { type: 'integer', default: 20 } },
            { name: 'offset', in: 'query', description: 'Skip count', schema: { type: 'integer', default: 0 } },
          ],
          responses: {
            200: {
              description: 'List of users',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      total: { type: 'number' },
                      limit: { type: 'number' },
                      offset: { type: 'number' },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/User' },
                      },
                    },
                  },
                },
              },
            },
            403: { description: 'Admin access required' },
          },
        },
      },

      '/users/{userId}': {
        get: {
          tags: ['Users'],
          summary: 'Get user by ID',
          description: '**Admin only.**',
          parameters: [
            { name: 'userId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'User data' },
            404: { description: 'User not found' },
          },
        },
        delete: {
          tags: ['Users'],
          summary: 'Delete user by ID',
          description: '**Admin only.** Permanently deletes user and all their data.',
          parameters: [
            { name: 'userId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            204: { description: 'User deleted' },
            403: { description: 'Demo mode restriction or insufficient permissions' },
            404: { description: 'User not found' },
          },
        },
      },

      '/users/{userId}/ban': {
        patch: {
          tags: ['Users'],
          summary: 'Ban or unban user',
          description: '**Admin only.** Toggles ban status. Banned users cannot access protected endpoints.',
          parameters: [
            { name: 'userId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: {
              description: 'Ban status toggled',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'User banned successfully' },
                      isBanned: { type: 'boolean' },
                    },
                  },
                },
              },
            },
            403: { description: 'Demo mode restriction or insufficient permissions' },
            404: { description: 'User not found' },
          },
        },
      },

      // ─── BLOGS ────────────────────────────────────────
      '/blogs': {
        post: {
          tags: ['Blogs'],
          summary: 'Create a new blog',
          description: 'Create a blog post with banner image. Content should be HTML from Tiptap editor. Slug is auto-generated.',
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  required: ['banner_image', 'title', 'content'],
                  properties: {
                    banner_image: { type: 'string', format: 'binary', description: 'Max 2MB, jpg/png/webp' },
                    title: { type: 'string', example: 'My First Blog', maxLength: 180 },
                    content: { type: 'string', example: '<p>Hello world</p>', description: 'HTML content from Tiptap' },
                    status: { type: 'string', enum: ['draft', 'published'], default: 'draft' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Blog created successfully' },
            400: { description: 'Validation error or missing banner' },
          },
        },
        get: {
          tags: ['Blogs'],
          summary: 'Get all blogs',
          description: 'Admin sees all blogs (draft + published). Regular users see published only.',
          parameters: [
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
            { name: 'offset', in: 'query', schema: { type: 'integer', default: 0 } },
          ],
          responses: {
            200: {
              description: 'List of blogs',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      total: { type: 'number' },
                      limit: { type: 'number' },
                      offset: { type: 'number' },
                      blogs: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Blog' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      '/blogs/user/{userId}': {
        get: {
          tags: ['Blogs'],
          summary: 'Get blogs by user',
          description: 'Admin sees all statuses. Regular users see published only.',
          parameters: [
            { name: 'userId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
            { name: 'offset', in: 'query', schema: { type: 'integer', default: 0 } },
          ],
          responses: {
            200: { description: 'List of blogs by user' },
            404: { description: 'User not found' },
          },
        },
      },

      '/blogs/{slug}': {
        get: {
          tags: ['Blogs'],
          summary: 'Get blog by slug',
          description: 'Increments view count once per user per day using cookie tracking.',
          parameters: [
            { name: 'slug', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: {
              description: 'Blog data',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: { blog: { $ref: '#/components/schemas/Blog' } },
                  },
                },
              },
            },
            403: { description: 'Draft blog — admin access only' },
            404: { description: 'Blog not found' },
          },
        },
      },

      '/blogs/{blogId}': {
        patch: {
          tags: ['Blogs'],
          summary: 'Update blog',
          description: 'Only blog owner or admin can update. All fields optional.',
          parameters: [
            { name: 'blogId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    banner_image: { type: 'string', format: 'binary', description: 'Max 2MB' },
                    title: { type: 'string' },
                    content: { type: 'string' },
                    status: { type: 'string', enum: ['draft', 'published'] },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Blog updated successfully' },
            403: { description: 'Not authorized' },
            404: { description: 'Blog not found' },
          },
        },
        delete: {
          tags: ['Blogs'],
          summary: 'Delete blog',
          description: 'Only blog owner or admin can delete. Also removes banner from Cloudinary.',
          parameters: [
            { name: 'blogId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            204: { description: 'Blog deleted successfully' },
            403: { description: 'Not authorized or demo mode restriction' },
            404: { description: 'Blog not found' },
          },
        },
      },

      // ─── LIKES ────────────────────────────────────────
      '/likes/blog/{blogId}': {
        post: {
          tags: ['Likes'],
          summary: 'Like a blog',
          description: 'Like a blog post. Each user can only like once.',
          parameters: [
            { name: 'blogId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: {
              description: 'Blog liked successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: { likesCount: { type: 'number' } },
                  },
                },
              },
            },
            400: { description: 'Already liked this blog' },
            404: { description: 'Blog not found' },
          },
        },
        delete: {
          tags: ['Likes'],
          summary: 'Unlike a blog',
          description: 'Remove your like from a blog post.',
          parameters: [
            { name: 'blogId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            204: { description: 'Blog unliked successfully' },
            404: { description: 'Like not found' },
          },
        },
      },

      // ─── COMMENTS ─────────────────────────────────────
      '/comments/blog/{blogId}': {
        post: {
          tags: ['Comments'],
          summary: 'Add comment to blog',
          description: 'Add a comment to a blog post. Content is sanitized with DOMPurify.',
          parameters: [
            { name: 'blogId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['content'],
                  properties: {
                    content: { type: 'string', example: 'Great blog post!', maxLength: 1000 },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Comment added successfully' },
            404: { description: 'Blog not found' },
          },
        },
        get: {
          tags: ['Comments'],
          summary: 'Get comments by blog',
          description: 'Returns all comments for a blog post sorted by newest first.',
          parameters: [
            { name: 'blogId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: {
              description: 'List of comments',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      total: { type: 'number' },
                      comments: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Comment' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      '/comments/{commentId}': {
        delete: {
          tags: ['Comments'],
          summary: 'Delete comment',
          description: 'Only comment owner or admin can delete.',
          parameters: [
            { name: 'commentId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            204: { description: 'Comment deleted successfully' },
            403: { description: 'Not authorized' },
            404: { description: 'Comment not found' },
          },
        },
      },

      // ─── AI ───────────────────────────────────────────
      '/ai/assist': {
        post: {
          tags: ['AI'],
          summary: 'AI writing assistant',
          description: `Use Google Gemini AI to assist with blog writing.

**Available actions:**
- \`improve\` → Fix grammar and improve writing quality
- \`continue\` → Continue writing naturally
- \`summarize\` → Summarize in 2-3 sentences
- \`title\` → Generate 5 SEO-friendly title suggestions
- \`expand\` → Expand with more details
- \`tone_formal\` → Rewrite in formal tone
- \`tone_casual\` → Rewrite in casual tone
- \`fullBlog\` → Write complete blog from topic
- \`freePrompt\` → Free form AI writing prompt`,
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['prompt', 'action'],
                  properties: {
                    prompt: {
                      type: 'string',
                      example: 'The future of AI in healthcare',
                      maxLength: 10000,
                    },
                    action: {
                      type: 'string',
                      enum: [
                        'improve',
                        'continue',
                        'summarize',
                        'title',
                        'expand',
                        'tone_formal',
                        'tone_casual',
                        'fullBlog',
                        'freePrompt',
                      ],
                      example: 'fullBlog',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'AI generated text',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      text: { type: 'string', example: 'AI generated content here...' },
                    },
                  },
                },
              },
            },
            400: { description: 'Invalid action' },
            500: { description: 'AI service error' },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;