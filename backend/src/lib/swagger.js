const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Akshar Blog Platform API',
      version: '1.0.0',
      description: 'A full-stack blog platform API with AI writing assistance, role-based access control, and complete admin panel.',
      contact: {
        name: 'MrBengaliHacker',
        url: 'https://github.com/MrBengaliHacker',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your access token',
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
      // ─── AUTH ───────────────────────────────────────────
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          security: [],
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
                    role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
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
            409: { description: 'Email already exists' },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login user',
          security: [],
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
            401: { description: 'Invalid credentials' },
          },
        },
      },
      '/auth/refresh-token': {
        post: {
          tags: ['Auth'],
          summary: 'Refresh access token',
          security: [],
          description: 'Uses refresh token from httpOnly cookie',
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
            401: { description: 'Refresh token missing or invalid' },
          },
        },
      },
      '/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Logout user',
          responses: {
            204: { description: 'Logged out successfully' },
            500: { description: 'Server error' },
          },
        },
      },

      // ─── USERS ──────────────────────────────────────────
      '/users/current': {
        get: {
          tags: ['Users'],
          summary: 'Get current user',
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
          },
        },
        patch: {
          tags: ['Users'],
          summary: 'Update current user',
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    avatar_image: { type: 'string', format: 'binary' },
                    username: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    bio: { type: 'string' },
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
          responses: {
            204: { description: 'Account deleted successfully' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/users': {
        get: {
          tags: ['Users'],
          summary: 'Get all users (Admin only)',
          parameters: [
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
            { name: 'offset', in: 'query', schema: { type: 'integer', default: 0 } },
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
          summary: 'Get user by ID (Admin only)',
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
          summary: 'Delete user by ID (Admin only)',
          parameters: [
            { name: 'userId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            204: { description: 'User deleted' },
            404: { description: 'User not found' },
          },
        },
      },
      '/users/{userId}/ban': {
        patch: {
          tags: ['Users'],
          summary: 'Ban or unban user (Admin only)',
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
                      message: { type: 'string' },
                      isBanned: { type: 'boolean' },
                    },
                  },
                },
              },
            },
            404: { description: 'User not found' },
          },
        },
      },

      // ─── BLOGS ──────────────────────────────────────────
      '/blogs': {
        post: {
          tags: ['Blogs'],
          summary: 'Create a new blog',
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  required: ['banner_image', 'title', 'content'],
                  properties: {
                    banner_image: { type: 'string', format: 'binary' },
                    title: { type: 'string', example: 'My First Blog' },
                    content: { type: 'string', example: '<p>Hello world</p>' },
                    status: { type: 'string', enum: ['draft', 'published'], example: 'draft' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Blog created successfully' },
            400: { description: 'Validation error' },
          },
        },
        get: {
          tags: ['Blogs'],
          summary: 'Get all blogs with pagination',
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
          parameters: [
            { name: 'slug', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'Blog data' },
            404: { description: 'Blog not found' },
          },
        },
      },
      '/blogs/{blogId}': {
        patch: {
          tags: ['Blogs'],
          summary: 'Update blog (owner or admin)',
          parameters: [
            { name: 'blogId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    banner_image: { type: 'string', format: 'binary' },
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
          summary: 'Delete blog (owner or admin)',
          parameters: [
            { name: 'blogId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            204: { description: 'Blog deleted successfully' },
            403: { description: 'Not authorized' },
            404: { description: 'Blog not found' },
          },
        },
      },

      // ─── LIKES ──────────────────────────────────────────
      '/likes/blog/{blogId}': {
        post: {
          tags: ['Likes'],
          summary: 'Like a blog',
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
            400: { description: 'Already liked' },
            404: { description: 'Blog not found' },
          },
        },
        delete: {
          tags: ['Likes'],
          summary: 'Unlike a blog',
          parameters: [
            { name: 'blogId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            204: { description: 'Blog unliked successfully' },
            404: { description: 'Like not found' },
          },
        },
      },

      // ─── COMMENTS ───────────────────────────────────────
      '/comments/blog/{blogId}': {
        post: {
          tags: ['Comments'],
          summary: 'Add comment to blog',
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
                    content: { type: 'string', example: 'Great blog post!' },
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
          summary: 'Delete comment (owner or admin)',
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

      // ─── AI ─────────────────────────────────────────────
      '/ai/assist': {
        post: {
          tags: ['AI'],
          summary: 'AI writing assistant',
          description: 'Use Gemini AI to assist with blog writing',
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