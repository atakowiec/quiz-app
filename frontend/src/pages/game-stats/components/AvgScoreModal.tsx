import React, { useEffect, useState } from "react";
import { Modal, ModalBody } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import MainTitle from "../../../components/main-components/MainTitle.tsx";
import styles from "./StatsModal.module.scss";
import getApi from "../../../api/axios.ts";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

interface AverageScoreChartModalProps {
  show: boolean;
  handleClose: () => void;
  userId: number | undefined;
}

const AverageScoreChartModal: React.FC<AverageScoreChartModalProps> = ({
  show,
  handleClose,
  userId,
}) => {
  const [history, setHistory] = useState<
    { avgScore: number; createdAt: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (show && userId) {
      fetchHistory();
    }
  }, [show, userId]);

  const fetchHistory = async () => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await getApi().get(
        `history/stats/${userId}/avg/history`
      );
      setHistory(response.data);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = {
    labels: history.map((item) =>
      new Date(item.createdAt).toLocaleString("pl-PL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    ),
    datasets: [
      {
        label: "Średnia liczba punktów",
        data: history.map((item) => item.avgScore),
        borderColor: "#06a53b",
        backgroundColor: "rgba(6, 165, 59, 0.15)",
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
    },
    scales: {
      x: {
        ticks: { display: false },
      },
      y: { title: { display: true, text: "Średnia punktów" } },
    },
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <ModalBody className={styles.settModal}>
        <MainTitle>Średnia liczba punktów</MainTitle>
        {isLoading && <div className={styles.loadingMessage}>Ładowanie...</div>}
        {error && <div className={styles.errorMessage}>{error}</div>}
        {!isLoading && !error && (
          <div className={styles.chartContainer}>
            <Line data={chartData} options={chartOptions} />
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

export default AverageScoreChartModal;
