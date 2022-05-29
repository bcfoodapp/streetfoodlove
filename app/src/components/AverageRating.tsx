import React, { useEffect, useState } from "react";
import { useAverageRatingQuery, AverageRating } from "../api";
import {
  LineChart,
  Line,
  YAxis,
  XAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
} from "recharts";

export default function AverageRating() {
  const { data: averageRating } = useAverageRatingQuery();
  const [averageRatingByMonth, setAverageRatingByMonth] = useState([] as any);
  useEffect(() => {
    if (averageRating) {
      let temp = [] as AverageRating[];
      for (const Rating of averageRating) {
        let obj = {
          VendorID: Rating.VendorID,
          Name: Rating.Name,
          AverageRating: Rating.AverageRating,
          Month: Rating.Month,
        };

        temp.push(obj);
      }

      setAverageRatingByMonth(temp);
    }
  }, [averageRating]);

  console.log(averageRatingByMonth);

  return (
    <LineChart
      width={800}
      height={600}
      data={averageRating}
      margin={{ top: 50, right: 30, left: 20, bottom: 30 }}
    >
      <text
        x={500 / 2}
        y={20}
        fill="black"
        textAnchor="left"
        dominantBaseline="central"
      >
        <tspan fontSize="20">Average Rating Over Time</tspan>
      </text>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={"Month"} />
      <YAxis
        type={"number"}
        dataKey={"AverageRating"}
        label={{
          value: "Average Rating",
          angle: -90,
          position: "insideLeft",
          textAnchor: "middle",
        }}
      />
      <ZAxis type={"category"} dataKey={"Name"} />

      <Legend verticalAlign="top" />
      <Tooltip cursor={{ stroke: "red", strokeWidth: 2 }} />
      <Line dataKey="AverageRating" stroke="#FF0000" />
      <Line type="monotone" dataKey="Name" stroke="#FF0000" />
    </LineChart>
  );
}
