import React from "react";
import classes from "./styles/categoryElement.module.scss";
import { Link } from "react-router-dom";

interface CategoryElementProps {
  name: string;
  description?: string;
  img?: string;
}
export default function CategoryElement(props: CategoryElementProps) {
  return (
    <div className={classes.container}>
      <Link to={`/admin/categories/${props.name}`}>
        <img src={`/assets/categories/${props.img}`} alt={props.name} />
        <div className={classes.categoryDetails}>
          <h3>{props.name}</h3>
          <p>{props.description}</p>
        </div>
      </Link>
    </div>
  );
}
