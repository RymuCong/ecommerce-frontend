let history;

const setHistory = (historyObj) => (history = historyObj);

const filterProducts = (products, filter) => {
  if (filter === "All") return products;
  return products.filter((product) => product.category.categoryName === filter);
};

export { history, setHistory, filterProducts };
