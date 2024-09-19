import React, { useEffect, useState } from "react";
import classes from "./categories.module.scss";
import CategoryElement from "./components/CategoryElement";
import getApi from "../../../api/axios.ts";
import { Category } from "@shared/game.js";
export default function Categories() {
  const [categories, setCategories] = useState([]);
  function getCategories() {
    getApi()
      .get("/questions/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    getCategories();

    return () => {};
  }, []);
  return (
    <div className={classes.container}>
      {categories.map((category: Category, index) => (
        <CategoryElement
          key={index}
          name={category.name}
          description={category?.description}
          img={category?.img}
        />
      ))}
    </div>
  );
}
