import Meta from "../components/Meta";
import { Breadcrumb, Container } from "react-bootstrap";
import styles from "../styles/Category.module.scss";
import { FaEarthAfrica } from "react-icons/fa6";
import TimeBar from "../components/TimeBar";
import { useEffect, useState } from "react";

const Category: React.FC = () => {
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const totalTime = 60000;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed((prevTime) => prevTime + 100);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  //TODO: make category a component
  //TODO: show chosen category
  return (
    <div>
      <Meta title={"Question"} />
      <Breadcrumb title="Question" />
      <Container className={styles.categoryContainer}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-4">
            <div className={styles.categoryBox}>
              <div className={styles.categoryText}>Wybór kategorii</div>
              <div className={styles.categoryChoiceBox}>
                <div className={styles.choice}>
                  <FaEarthAfrica className={styles.categoryIcon} />
                  Przyroda
                </div>
                <div className={styles.choice}>
                  <FaEarthAfrica className={styles.categoryIcon} />
                  Przyroda
                </div>
                <div className={styles.choice}>
                  <FaEarthAfrica className={styles.categoryIcon} />
                  Przyroda
                </div>
                <div className={styles.choice}>
                  <FaEarthAfrica className={styles.categoryIcon} />
                  Przyroda
                </div>
                <div className={styles.choice}>
                  <FaEarthAfrica className={styles.categoryIcon} />
                  Przyroda
                </div>
                <div className={styles.choice}>
                  <FaEarthAfrica className={styles.categoryIcon} />
                  Przyroda
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <TimeBar timeElapsed={timeElapsed} totalTime={totalTime} />
    </div>
  );
};

export default Category;
