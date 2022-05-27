import React, { useEffect, useState } from "react";
import { useNewChartQuery } from "../api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Label,
} from "recharts";

export default function ReviewsChart() {
  const { data: stars } = useNewChartQuery();
  const [starCount, setStarCount] = useState([] as any);

  useEffect(() => {
    if (stars) {
      let obj = {
        ID: "30f15697-8c12-41cf-83d9-a9ccfe07c43e",
        name: "Stars",
        "1-star": stars.One,
        "2-star": stars.Two,
        "3-star": stars.Three,
        "4-star": stars.Four,
        "5-star": stars.Five,
      };

      setStarCount([obj]);
    }
  }, [stars]);

  return (
    <BarChart
      width={800}
      height={500}
      data={starCount}
      barSize={"30"}
      margin={{ top: 80, right: 30, left: 30, bottom: 5 }}
    >

      <text x={500 / 2} y={20} fill="black" textAnchor="left" dominantBaseline="central">
        <tspan fontSize="20">New Reviews in the last Month</tspan>
      </text >
      /* <CartesianGrid strokeDasharray="3 3" />
      */
      <XAxis dataKey="Stars">
        <Label value="Date Posted" textAnchor="outside" position="center" />
      </XAxis>
      <YAxis
        label={{
          value: "Count of Star Reviews",
          angle: -90,
          position: "insideLeft",
          textAnchor: "middle",
        }}
      />
      <Legend verticalAlign="top"/>
      <Bar dataKey="1-star" fill="#FF6347" />
      <Bar dataKey="2-star" fill="#0000FF" />
      <Bar dataKey="3-star" fill="#FF00FF" />
      <Bar dataKey="4-star" fill="#4B0082" />
      <Bar dataKey="5-star" fill="#FFA500" />
    </BarChart>
  );
}
