import classes from "./categories.module.scss";
import CategoryElement from "./components/CategoryElement";
import { ICategory } from "@shared/game.js";
import { useSelector } from "react-redux";
import { State } from "../../../store";

export default function Categories() {
  const categories = useSelector((state: State) => state.globalData.categories);
  console.log(categories);

  if (!categories) {
    return <div>Loading...</div>;
  }

  return (
    <div className={classes.container}>
      {categories.map((category: ICategory) => (
        <CategoryElement
          key={category.id}
          name={category.name}
          description={category?.description}
          img={category?.img}
        />
      ))}
    </div>
  );
}
