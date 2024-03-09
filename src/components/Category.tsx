import coffeeIcon from '../assets/coffee_icon.png';
import desertIcon from '../assets/desert_icon.png';

interface CategoryProps {
  activeCategory: string;
  setActiveCategory: React.Dispatch<React.SetStateAction<string>>;
}

export const Category = ({
  activeCategory,
  setActiveCategory,
}: CategoryProps) => {
  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
  };

  return (
    <ul className="flex flex-row gap-2.5">
      <li
        className={`${activeCategory === '커피류' ? 'bg-primary' : 'bg-lightbrown'} rounded-2xl py-2.5 px-5 text-xs text-white flex flex-col items-center justify-center hover:bg-primary transition-all cursor-pointer`}
        onClick={() => handleCategoryClick('커피류')}
      >
        <img src={coffeeIcon} width="28" alt="커피 맛집" className="pb-1.5" />
        커피류
      </li>
      <li
        className={`${activeCategory === '디저트' ? 'bg-primary' : 'bg-lightbrown'} rounded-2xl py-2.5 px-5 text-xs text-white flex flex-col items-center justify-center hover:bg-primary transition-all cursor-pointer`}
        onClick={() => handleCategoryClick('디저트')}
      >
        <img src={desertIcon} width="28" alt="디저트 맛집" className="pb-1.5" />
        디저트
      </li>
    </ul>
  );
};
