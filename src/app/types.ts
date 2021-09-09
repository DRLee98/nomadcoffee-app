import {
  seeCoffeeShopsQuery_seeCoffeeShops_categories,
  seeCoffeeShopsQuery_seeCoffeeShops_photos,
} from "../__generated__/seeCoffeeShopsQuery";

export type editItemType = {
  id: number;
  name?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  address?: string | null;
  categories?: seeCoffeeShopsQuery_seeCoffeeShops_categories[] | null;
  photos?: seeCoffeeShopsQuery_seeCoffeeShops_photos[] | null;
  totalComment?: number;
  totalLikes?: number;
  isLiked?: boolean;
};
