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
    <ul className="w-full flex justify-end gap-2.5 pt-2.5 box-border max-md:absolute max-md:left-1/2 max-md:-translate-x-1/2 max-md:justify-center max-md:z-10">
      <li
        className={`${activeCategory === '커피류' ? 'bg-primary' : 'bg-lightbrown'} rounded-2xl py-2.5 px-5 text-xs text-white flex flex-col items-center justify-center hover:bg-primary transition-all cursor-pointer max-md:flex-row max-md:gap-1.5 max-md:px-2.5 max-md:py-2 max-md:rounded-3xl`}
        onClick={() => handleCategoryClick('커피류')}
      >
        <img
          src={coffeeIcon}
          alt="커피 맛집"
          className="pb-1.5 w-7 max-md:w-4 max-md:pb-0"
        />
        커피류
      </li>
      <li
        className={`${activeCategory === '디저트' ? 'bg-primary' : 'bg-lightbrown'} rounded-2xl py-2.5 px-5 text-xs text-white flex flex-col items-center justify-center hover:bg-primary transition-all cursor-pointer max-md:flex-row max-md:gap-1.5 max-md:px-2.5 max-md:py-2 max-md:rounded-3xl`}
        onClick={() => handleCategoryClick('디저트')}
      >
        <img
          src={desertIcon}
          alt="디저트 맛집"
          className="pb-1.5 w-7 max-md:w-4 max-md:pb-0"
        />
        디저트
      </li>
    </ul>
  );
};
