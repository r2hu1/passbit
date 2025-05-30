export default defineEventHandler((event) => {
  return {
    message: "Hello World!",
    event: event.node.req.url,
    method: event.node.req.method,
  };
});
