export default function useQueryParam(name: string) {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  return params.get(name);
}