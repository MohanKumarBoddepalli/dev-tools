export const parseUrl = (url) => {
  const urlObj = new URL(url, "http://localhost");
  const endpoint = urlObj.pathname;
  const pathParams = endpoint.match(/:\w+/g) || [];
  const queryParams = [...urlObj.searchParams.entries()];

  return { endpoint, pathParams, queryParams };
};
