const staticAdapter = pathname => {
  return {
    pathname,

    listen() {
      return () => {};
    }

  };
};

export default staticAdapter;