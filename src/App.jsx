import axios from "axios";
import { useEffect, useReducer, useState } from "react";

function generateValidNumbers(data) {
  const usedNumbers = new Set([...data[0].numbers, ...data[1].numbers]);

  // Tạo danh sách từ 01 đến 45, loại các số đã dùng
  const pool = [];
  for (let i = 1; i <= 45; i++) {
    const num = i.toString().padStart(2, "0");
    if (!usedNumbers.has(num)) {
      pool.push(num);
    }
  }

  // Shuffle danh sách (Fisher–Yates)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Chọn số theo điều kiện hàng chục
  const result = [];
  const tensCount = {};

  for (const num of pool) {
    const tens = Math.floor(parseInt(num) / 10);

    tensCount[tens] = tensCount[tens] || 0;

    if (tensCount[tens] < 2) {
      result.push(num);
      tensCount[tens]++;
    }

    if (result.length === 6) break;
  }

  return result.sort();
}

function App() {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    axios("https://mega645-api.vercel.app/").then((res) => {
      setData(res.data);
      setIsLoading(false);
    });
  }, []);

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <a style={{ margin: 0, pointerEvents: "none", fontWeight: 700 }}>
              Số đẹp
            </a>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              {generateValidNumbers(data).map((item) => (
                <h2
                  style={{
                    margin: 0,
                  }}
                  key={item}
                >
                  {item}
                </h2>
              ))}
            </div>
            <button
              onClick={forceUpdate}
              style={{
                marginTop: "10px",
              }}
            >
              Số khác
            </button>
          </div>
          <br />
          <table>
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Số</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 5).map((item) => (
                <tr key={item.date}>
                  <td>{item.date}</td>
                  <td>{item.numbers.join("-")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
