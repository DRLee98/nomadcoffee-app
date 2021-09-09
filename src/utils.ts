import { seeCoffeeShopsQuery_seeCoffeeShops_categories } from "./__generated__/seeCoffeeShopsQuery";

export const getCategoryObj = (categories: string) => {
  const returnArray: seeCoffeeShopsQuery_seeCoffeeShops_categories[] = [];
  if (categories) {
    const categoriesList = categories.split(",") || [];
    const filterList = categoriesList.filter(
      (category) => category.trim() !== "",
    );
    filterList.forEach((category) => {
      const name = category.trim();
      const slug = getSlug(name);
      if (name !== "") {
        const categoryObj: seeCoffeeShopsQuery_seeCoffeeShops_categories = {
          __typename: "Category",
          name,
          slug,
        };
        returnArray.push(categoryObj);
      }
    });
  }
  return returnArray;
};

const getSlug = (category: string) => {
  return category.replace(/ /gi, "_").toLowerCase();
};
