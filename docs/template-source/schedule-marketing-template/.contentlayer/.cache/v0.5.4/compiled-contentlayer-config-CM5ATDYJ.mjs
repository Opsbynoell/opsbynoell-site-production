// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer2/source-files";
var BlogPost = defineDocumentType(() => ({
  name: "BlogPost",
  filePathPattern: `blogs/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the blog post",
      required: true
    },
    date: {
      type: "date",
      description: "The date of the blog post",
      required: true
    },
    author: {
      type: "string",
      required: true
    },
    authorAvatar: {
      type: "string",
      required: true
    },
    description: {
      type: "string",
      required: true
    },
    image: {
      type: "string",
      required: true
    },
    categories: {
      type: "list",
      of: { type: "string" },
      required: true
    }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/blog/${doc._raw.flattenedPath.split("/").pop()}`
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "data",
  documentTypes: [BlogPost]
});
export {
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-CM5ATDYJ.mjs.map
