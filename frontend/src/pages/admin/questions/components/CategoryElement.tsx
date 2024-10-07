import React from "react";
import classes from "./styles/categoryElement.module.scss";
import { Link } from "react-router-dom";
import styles from "../categories.module.scss";

interface CategoryElementProps {
  name: string;
  description?: string;
  img?: string;
}
export default function CategoryElement(props: CategoryElementProps) {
  return (
    <div className={styles.catBox}>
      <Link to={`/admin/categories/${props.name}`}>
        <img
          src={`/assets/categories/${props.img}`}
          alt={props.name}
          className={styles.categoryImage}
        />
        <div className={classes.categoryDetails}>
          <h3>{props.name}</h3>
          <p>{props.description}</p>
        </div>
      </Link>
    </div>
  );
}
