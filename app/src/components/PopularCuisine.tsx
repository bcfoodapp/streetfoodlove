import React, { useEffect, useState } from "react";
import { PopularCuisine, usePopularCuisineQuery } from "../api";
import { Bar, BarChart, Label, Legend, Tooltip, XAxis, YAxis } from "recharts";

const barColors = ["#FF4782", "#FFA500", "#FF6347"];
export default function PopularCuisine() {
  const { data: popularCuisine } = usePopularCuisineQuery();
  const [cuisineByArea, setCuisineByArea] = useState([] as any);
  useEffect(() => {
    if (popularCuisine) {
      let temp = [] as PopularCuisine[];
      for (const Cuisine of popularCuisine) {
        let obj = {
          TotalRating: Cuisine.TotalRating,
          CuisineType: Cuisine.CuisineType,
          Location: Cuisine.Location,
        };

        temp.push(obj);
      }

      setCuisineByArea(temp);
    }
  }, [popularCuisine]);
  console.log(cuisineByArea);

  return (
    <BarChart
      width={600}
      height={400}
      data={popularCuisine}
      layout={"vertical"}
      margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
    >
      <text
        x={500 / 2}
        y={20}
        fill="black"
        textAnchor="left"
        dominantBaseline="left"
        spacing={"50"}
      >
        <tspan fontSize="20">Top 3 Cuisine Type by Location</tspan>
      </text>
      <XAxis type={"number"} />

      <YAxis
        type="category"
        dataKey={"Location"}
        label={{
          value: "Location",
          angle: -90,
          position: "left",
          textAnchor: "middle",
        }}
      />

      <Tooltip />
      <Legend verticalAlign="top" />
      <Bar
        dataKey="TotalRating"
        label={{ value: "TotalRating", position: "insideRight" }}
        maxBarSize={40}
        fill="#FF6347"
      />
      <Bar
        dataKey="CuisineType"
        label={{ value: "CuisineType", position: "insideTopLeft" }}
        maxBarSize={40}
        fill="#FF4782"
      />
    </BarChart>
  );
}
