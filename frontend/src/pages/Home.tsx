import React from "react";
import Meta from "../components/Meta";
import { Breadcrumb } from "react-bootstrap";
import Sidebar, { SidebarItem } from "../components/SideBar";
import { IoStatsChartSharp } from "react-icons/io5";
import styles from "../styles/Home.module.scss";
import {
  IoIosAddCircleOutline,
  IoIosPlay,
  IoLogoGameControllerB,
} from "react-icons/io";
import { useUser } from "../store/userSlice";
import { useGame } from "../store/gameSlice";

const Home: React.FC = () => {
  const user = useUser();
  const game = useGame();

  const sidebarItems: SidebarItem[] = [
    ...(game?.status != "waiting_for_players"
      ? [
          {
            icon: IoIosAddCircleOutline,
            label: "Stwórz Grę",
            href: "/create-game",
          },
          { icon: IoIosPlay, label: "Dołącz do gry", href: "/join-game" },
        ]
      : [{ icon: IoIosPlay, label: "Wróć do gry", href: "/waiting-room" }]),

    ...(user.loggedIn
      ? [
          {
            icon: IoLogoGameControllerB,
            label: "Historia Gier",
            href: "/history",
          },
          { icon: IoStatsChartSharp, label: "Statystyki", href: "/stats" },
        ]
      : []), // Jeśli użytkownik nie jest zalogowany, te elementy zostaną pominięte
  ];
  return (
    <>
      <Meta title={"Stwórz grę"} />
      <Breadcrumb title="Stwórz grę" />
      <Sidebar items={sidebarItems} />
      <div className={`col-12 ${styles.picturesContainer}`}>
        <div className={`${styles.pictureWrapper}`}>
          <div className={styles.svgWrapper}>
            <svg
              viewBox="0 0 443 517"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.svgImage}
            >
              <path
                d="M172.077 155.182H186.989V195.056C186.989 199.664 185.892 203.679 183.699 207.099C181.505 210.5 178.446 213.136 174.522 215.008C170.598 216.859 166.04 217.785 160.849 217.785C155.597 217.785 151.009 216.859 147.085 215.008C143.161 213.136 140.112 210.5 137.939 207.099C135.765 203.679 134.679 199.664 134.679 195.056V155.182H149.62V193.758C149.62 195.891 150.083 197.792 151.009 199.463C151.954 201.133 153.272 202.441 154.963 203.387C156.653 204.333 158.615 204.805 160.849 204.805C163.082 204.805 165.034 204.333 166.705 203.387C168.395 202.441 169.713 201.133 170.659 199.463C171.605 197.792 172.077 195.891 172.077 193.758V155.182ZM253.504 217V208.488L283.538 167.316H253.534V155.182H302.433V163.694L272.399 204.866H302.403V217H253.504Z"
                fill="black"
              />
              <path
                d="M78.9446 491V412.455H111.697C117.578 412.455 122.5 413.286 126.463 414.947C130.452 416.609 133.443 418.936 135.438 421.928C137.457 424.919 138.467 428.384 138.467 432.321C138.467 435.312 137.841 437.984 136.588 440.337C135.335 442.663 133.609 444.594 131.411 446.128C129.212 447.662 126.668 448.736 123.778 449.349V450.116C126.949 450.27 129.876 451.126 132.561 452.686C135.271 454.246 137.445 456.419 139.081 459.206C140.717 461.967 141.536 465.24 141.536 469.024C141.536 473.243 140.462 477.014 138.314 480.338C136.166 483.636 133.06 486.244 128.994 488.162C124.929 490.054 119.994 491 114.19 491H78.9446ZM97.929 475.697H109.665C113.781 475.697 116.811 474.918 118.754 473.358C120.723 471.798 121.707 469.625 121.707 466.838C121.707 464.818 121.234 463.08 120.288 461.622C119.342 460.139 118 459.001 116.261 458.209C114.523 457.391 112.439 456.982 110.01 456.982H97.929V475.697ZM97.929 444.747H108.438C110.509 444.747 112.349 444.402 113.96 443.712C115.571 443.021 116.824 442.024 117.719 440.72C118.639 439.416 119.099 437.844 119.099 436.003C119.099 433.369 118.166 431.298 116.3 429.79C114.433 428.281 111.915 427.527 108.744 427.527H97.929V444.747ZM167.653 491H147.25L173.751 412.455H199.026L225.527 491H205.124L186.676 432.244H186.062L167.653 491ZM164.93 460.088H207.578V474.509H164.93V460.088ZM274.014 436.003C273.758 433.19 272.62 431.004 270.6 429.445C268.606 427.859 265.755 427.067 262.048 427.067C259.593 427.067 257.548 427.386 255.912 428.026C254.275 428.665 253.048 429.547 252.23 430.672C251.412 431.771 250.99 433.037 250.964 434.469C250.913 435.645 251.143 436.68 251.654 437.575C252.191 438.47 252.958 439.263 253.956 439.953C254.978 440.618 256.206 441.206 257.637 441.717C259.069 442.229 260.68 442.676 262.47 443.06L269.22 444.594C273.106 445.438 276.532 446.562 279.498 447.969C282.49 449.375 284.995 451.05 287.015 452.993C289.061 454.936 290.608 457.173 291.656 459.705C292.704 462.236 293.241 465.074 293.267 468.219C293.241 473.179 291.988 477.436 289.508 480.99C287.028 484.544 283.461 487.267 278.808 489.159C274.18 491.051 268.593 491.997 262.048 491.997C255.477 491.997 249.75 491.013 244.866 489.044C239.983 487.075 236.186 484.084 233.475 480.07C230.765 476.055 229.372 470.98 229.295 464.844H247.474C247.627 467.375 248.305 469.484 249.507 471.172C250.708 472.859 252.358 474.138 254.454 475.007C256.576 475.876 259.031 476.311 261.818 476.311C264.375 476.311 266.548 475.966 268.338 475.276C270.153 474.585 271.547 473.626 272.518 472.399C273.49 471.172 273.988 469.766 274.014 468.18C273.988 466.697 273.528 465.432 272.633 464.384C271.738 463.31 270.358 462.389 268.491 461.622C266.65 460.83 264.298 460.101 261.434 459.436L253.227 457.518C246.426 455.959 241.069 453.44 237.157 449.963C233.245 446.46 231.302 441.73 231.328 435.773C231.302 430.915 232.606 426.658 235.24 423.001C237.873 419.345 241.517 416.494 246.17 414.449C250.824 412.403 256.129 411.381 262.086 411.381C268.172 411.381 273.451 412.416 277.926 414.487C282.426 416.533 285.916 419.409 288.396 423.116C290.876 426.824 292.142 431.119 292.193 436.003H274.014ZM302.855 491V412.455H357.622V427.872H321.839V443.98H354.822V459.436H321.839V475.582H357.622V491H302.855Z"
                fill="black"
              />
              <path
                d="M433.5 187.098C433.5 283.744 340.15 364.697 221.5 364.697C102.85 364.697 9.5 283.744 9.5 187.098C9.5 90.4532 102.85 9.5 221.5 9.5C340.15 9.5 433.5 90.4532 433.5 187.098Z"
                stroke="black"
                strokeWidth="19"
              />
              <path
                d="M229.76 273.884L288.768 279.622L407.937 407.074L342.717 400.731L229.76 273.884Z"
                fill="black"
              />
              <path
                d="M193.943 160.281L209.283 156.128L245.916 209.81L229.25 212.994L193.943 160.281Z"
                fill="black"
              />
            </svg>
          </div>
          <div className={styles.imageWrapper}>
            <img
              src="/assets/homePhoto.png"
              alt="1"
              className={`img-fluid ${styles.img1}`}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
