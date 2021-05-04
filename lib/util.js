import axios from 'axios';

export const fetcher = url => axios.get(url).then(res => res.data);

export const isInViewport = element => {
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

export const formatDate = dateString => {
  try {
    return new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(new Date(dateString));
  } catch (error) {
    return null;
  }
};

export const flattenData = obj => {
  if (!obj) return null;

  if (Array.isArray(obj.data)) {
    // recursively flatten all documents inside the data array
    return {
      ...obj,
      data: obj.data.map(e => flattenData(e)),
    };
  } else {
    // flatten the document's data
    return { ...obj.data, id: obj.ref.value.id };
  }
};
