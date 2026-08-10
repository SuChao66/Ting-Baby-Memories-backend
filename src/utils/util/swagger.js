// Swagger 接口文档配置
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ting Baby Memories API",
      version: "1.0.0",
      description: "汀宝宝成长记忆后端接口文档",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "开发环境",
      },
    ],
    tags: [
      { name: "Baby", description: "宝宝信息管理" },
      { name: "Timeline", description: "成长时间线" },
    ],
    components: {
      schemas: {
        // 统一响应结构
        ApiResponse: {
          type: "object",
          properties: {
            code: { type: "integer", example: 0 },
            message: { type: "string", example: "success" },
            data: {},
          },
        },
        // 宝宝信息
        Baby: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string", example: "宝宝" },
            birthday: { type: "string", format: "date" },
            avatar: { type: "string" },
          },
        },
        // 时间线项
        TimelineItem: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            date: { type: "string", format: "date" },
          },
        },
      },
    },
  },
  // 扫描路由文件中的 OpenAPI 注释
  apis: ["src/routes/modules/*.js"],
};

module.exports = swaggerJsdoc(options);
