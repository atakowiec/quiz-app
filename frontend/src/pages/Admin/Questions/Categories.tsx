import React, { useEffect, useState } from "react";
import classes from "./categories.module.scss";
import CategoryElement from "./components/CategoryElement";
import getApi from "../../../api/axios.ts";
import { Category } from "@shared/game.js";
import { useSelector } from "react-redux";
import { GlobalDataState } from "../../../store/globalDataSlice.ts";
import { State } from "../../../store/index.ts";
import useApi from "../../../api/useApi.ts";
export default function Categories() {
  const categories = useSelector((state: State) => state.globalData.categories);
  console.log(categories);

  if (!categories) {
    return <div>Loading...</div>;
  }

  return (
    <div className={classes.container}>
      {categories.map((category: Category) => (
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
