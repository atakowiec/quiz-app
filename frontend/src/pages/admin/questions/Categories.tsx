import CategoryElement from "./components/CategoryElement";
import { ICategory } from "@shared/game.js";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../../store";
import styles from "./categories.module.scss";
import { useState } from "react";
import CreateCategoryModal, {
  CategoryFormData,
} from "./components/CreateCategoryModal.tsx";
import { toast } from "react-toastify";
import getApi from "../../../api/axios.ts";
import { AxiosResponse } from "axios";
import { globalDataActions } from "../../../store/globalDataSlice.ts";

export default function Categories() {
  const categories = useSelector((state: State) => state.globalData.categories);
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const dispatch = useDispatch();
  const api = getApi();
  if (!categories) {
    return <div>Loading...</div>;
  }

  function confirmAddingCategory(categoryData: CategoryFormData) {
    getApi()
      .get("/categories")
      .then((response: AxiosResponse) => {
        dispatch(globalDataActions.setData({ categories: response.data }));
      })
      .catch(() => {
        toast.error("Podczas pobierania kategorii wystąpił błąd");
      });
    toast.success("Pomyślnie utworzono kategorie " + categoryData.categoryName);
  }

  function handleGiveOwnerClick() {
    setShowCreateCategoryModal(true);
  }

  function onErrorAccured(error: Error) {
    toast.error("Wystąpił error podczas tworzenia kategorii: " + error.message);
  }

  async function onDeleteClick(
      id: number
  ) {
      try {
          await api.delete(`/categories/${id}`);
          getApi()
              .get("/categories")
              .then((response: AxiosResponse) => {
                  dispatch(globalDataActions.setData({ categories: response.data }));
              })
              .catch(() => {
                  toast.error("Podczas pobierania kategorii wystąpił błąd");
              });
          toast.success("Pomyślnie usunięto kategorię");
      } catch (error) {
          console.error('Error deleting resource:', error);
          toast.error("Wystąpił błąd podczas usuwania kategorii")
      }
  }
  function onEditClick() {}

  return (
    <>
      <div className={styles.fixedButton}>
        <button
          className={styles.createCategoryBtn}
          onClick={() => handleGiveOwnerClick()}
        >
          Add Category
        </button>
      </div>
      <div className={styles.container}>
        {categories.map((category: ICategory) => (
          <CategoryElement
            key={category.id}
            id={category.id}
            name={category.name}
            description={category?.description}
            img={category?.img}
            onDelete={onDeleteClick}
          />
        ))}
      </div>

      <CreateCategoryModal
        show={showCreateCategoryModal}
        setShow={setShowCreateCategoryModal}
        onConfirm={confirmAddingCategory}
        confirmText={"Dodaj kategorię"}
        onError={onErrorAccured}
      />
    </>
  );
}
