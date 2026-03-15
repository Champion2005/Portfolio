export const useAnalytics = () => {
  const trackEvent = (eventName, parameters = {}) => {
    // Use the gtag instance loaded in index.html
    if (window.gtag) {
      window.gtag('event', eventName, parameters);
    }
  };

  return { trackEvent };
};
