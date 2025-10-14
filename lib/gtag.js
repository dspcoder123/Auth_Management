export const GA_MEASUREMENT_ID = 'G-70QEE0P49H';

export const pageview = (url) => {
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: '/',
  });
};
